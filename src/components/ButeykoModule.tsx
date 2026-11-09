import React, { useState, useEffect } from 'react';
import { ButeykoMeasurement, interpretControlPause } from '../utils/wellnessData';
import { AppStorage } from '../utils/appStorage';
import { soundSynth } from '../utils/soundSynth';
import { Play, Square, Activity, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const ButeykoModule: React.FC = () => {
  const [measurements, setMeasurements] = useState<ButeykoMeasurement[]>([]);
  const [testState, setTestState] = useState<'idle' | 'holding' | 'finished'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [pulseBefore, setPulseBefore] = useState<string>('');
  const [pulseAfter, setPulseAfter] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    setMeasurements(AppStorage.getButeykoMeasurements());
  }, []);

  // Timer loop when holding
  useEffect(() => {
    if (testState !== 'holding') return;
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [testState]);

  const startPauseTest = () => {
    setElapsedSeconds(0);
    setTestState('holding');
    soundSynth.playBell(432, 1);
  };

  const stopPauseTest = () => {
    setTestState('finished');
    soundSynth.playBell(528, 2);
  };

  const saveMeasurement = () => {
    if (elapsedSeconds <= 0) return;
    const item: ButeykoMeasurement = {
      id: `cp-${Date.now()}`,
      date: new Date().toISOString(),
      cpSeconds: elapsedSeconds,
      pulseBefore: pulseBefore ? parseInt(pulseBefore, 10) : undefined,
      pulseAfter: pulseAfter ? parseInt(pulseAfter, 10) : undefined,
      notes: notes.trim() || 'Standard morning CP check'
    };

    const updated = AppStorage.addButeykoMeasurement(item);
    setMeasurements(updated);
    AppStorage.addHistory({
      id: `hist-${Date.now()}`,
      type: 'buteyko',
      title: `Control Pause Check (${elapsedSeconds}s)`,
      durationMinutes: 1,
      timestamp: new Date().toISOString()
    });

    // Reset test form
    setTestState('idle');
    setElapsedSeconds(0);
    setPulseBefore('');
    setPulseAfter('');
    setNotes('');
  };

  const latestScore = measurements.length > 0 ? measurements[0].cpSeconds : null;
  const interpretation = latestScore !== null ? interpretControlPause(latestScore) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 text-slate-800 dark:text-slate-100">
      {/* Educational Notice Banner */}
      <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-start gap-3">
        <Info className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" size={20} />
        <div className="text-xs text-sky-900 dark:text-sky-200 space-y-1">
          <p className="font-semibold text-sm">Educational Wellness Tool – Non-Diagnostic Notice</p>
          <p>
            The Buteyko Control Pause (CP) measured here is purely an educational wellness parameter measuring comfortable breath-hold time after a normal, calm exhalation. It is not an arterial blood gas test, spirometry, or diagnostic indicator of disease. Stop immediately at the very first slight involuntary impulse to breathe. Never push to uncomfortable air hunger or hyperventilate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Test Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="text-teal-600 dark:text-teal-400" size={20} />
                Control Pause (CP) Test
              </h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Educational Protocol
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              1. Sit tall and relaxed. Breathe gently through your nose for 2 minutes.<br />
              2. Take a small, natural breath in through your nose, then a gentle, silent breath out.<br />
              3. Tap <strong className="text-teal-600">Start Hold</strong> and hold your nose with fingers.<br />
              4. Stop at the <span className="underline">very first definite desire</span> to breathe. Your subsequent breath should be completely calm, not a gasp!
            </p>

            {/* Hold Counter UI */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 my-4 text-center">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                {testState === 'holding' ? 'Holding Breath Comfortably' : testState === 'finished' ? 'Measurement Recorded' : 'Ready to Test'}
              </span>
              <div className="text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white my-3">
                {elapsedSeconds} <span className="text-2xl font-normal text-slate-400">sec</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                {testState === 'holding'
                  ? 'Keep shoulders relaxed. Tap Stop at the first involuntary flutter in throat or diaphragm.'
                  : testState === 'finished'
                  ? 'Great job. Now review your measurement below and save to journal.'
                  : 'Ensure you exhaled naturally before beginning.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4">
            {testState === 'idle' && (
              <button
                onClick={startPauseTest}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md shadow-teal-500/20 active:scale-95 transition-all"
              >
                <Play size={18} className="fill-white" /> Start Control Pause Test
              </button>
            )}

            {testState === 'holding' && (
              <button
                onClick={stopPauseTest}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-500/20 active:scale-95 transition-all animate-pulse"
              >
                <Square size={18} className="fill-white" /> Stop (First Involuntary Impulse)
              </button>
            )}

            {testState === 'finished' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Pulse Before (BPM)</label>
                    <input
                      type="number"
                      placeholder="e.g. 72"
                      value={pulseBefore}
                      onChange={e => setPulseBefore(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Pulse After (BPM)</label>
                    <input
                      type="number"
                      placeholder="e.g. 70"
                      value={pulseAfter}
                      onChange={e => setPulseAfter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Journal Notes / Context</label>
                  <input
                    type="text"
                    placeholder="e.g. Morning baseline after walking, relaxed nasal breath"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTestState('idle');
                      setElapsedSeconds(0);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Discard
                  </button>
                  <button
                    onClick={saveMeasurement}
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={16} /> Save to History
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Interpretation & Guidelines */}
        <div className="space-y-6">
          {/* Latest Metric Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-2">
              Latest CP Baseline
            </span>
            {interpretation ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {latestScore}s
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${interpretation.color}20`, color: interpretation.color }}
                  >
                    {interpretation.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {interpretation.description}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No baseline recorded yet today.</p>
            )}
          </div>

          {/* Safety screening */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-3xl border border-amber-200/70 dark:border-amber-800/40 p-5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase mb-2">
              <AlertTriangle size={16} /> Safety Guidelines
            </div>
            <ul className="text-xs text-amber-900 dark:text-amber-200/90 space-y-1.5 list-disc pl-4">
              <li>Do not perform tests during strenuous activity, driving, or swimming.</li>
              <li>Individuals with cardiovascular disease, severe hypertension, or pregnancy should avoid breath-holding.</li>
              <li>Stop immediately if you experience dizziness or shortness of breath.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Measurement History Log */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock size={16} className="text-teal-600 dark:text-teal-400" />
          Self-Recorded Practice Journal ({measurements.length} records)
        </h4>

        {measurements.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No tests recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5">Date & Time</th>
                  <th className="py-2.5">Control Pause</th>
                  <th className="py-2.5">Pulse (Before / After)</th>
                  <th className="py-2.5">Context & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                {measurements.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 font-mono">
                      {new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 font-bold font-mono text-teal-600 dark:text-teal-400">
                      {m.cpSeconds} seconds
                    </td>
                    <td className="py-3 font-mono">
                      {m.pulseBefore ? `${m.pulseBefore} BPM` : '—'} / {m.pulseAfter ? `${m.pulseAfter} BPM` : '—'}
                    </td>
                    <td className="py-3 max-w-xs truncate text-slate-500 dark:text-slate-400">
                      {m.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
