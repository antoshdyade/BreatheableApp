import React, { useState, useEffect } from 'react';
import { MEDITATION_PRESETS, MeditationTrack, formatSeconds } from '../utils/wellnessData';
import { soundSynth } from '../utils/soundSynth';
import { AppStorage } from '../utils/appStorage';
import { Play, Pause, RotateCcw, CloudRain, Trees, Waves, BellRing, Sparkles, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MeditationModule: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<MeditationTrack>(MEDITATION_PRESETS[0]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(selectedTrack.durationMinutes * 60);
  const [ambientSound, setAmbientSound] = useState<'rain' | 'waves' | 'forest' | 'white-noise' | 'none'>('rain');

  useEffect(() => {
    setSecondsLeft(selectedTrack.durationMinutes * 60);
    setIsActive(false);
    soundSynth.stopAmbient();
  }, [selectedTrack]);

  useEffect(() => {
    if (!isActive) return;

    if (ambientSound !== 'none') {
      soundSynth.startAmbient(ambientSound);
    } else {
      soundSynth.stopAmbient();
    }

    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          handleComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, ambientSound]);

  const handleComplete = () => {
    setIsActive(false);
    soundSynth.stopAmbient();
    soundSynth.playBell(528, 5);
    try {
      confetti({ particleCount: 50, spread: 50 });
    } catch {
      // Ignored
    }

    AppStorage.addHistory({
      id: `med-${Date.now()}`,
      type: 'meditation',
      title: selectedTrack.title,
      durationMinutes: selectedTrack.durationMinutes,
      timestamp: new Date().toISOString()
    });
  };

  const toggleMeditation = () => {
    if (!isActive) {
      soundSynth.playBell(432, 2);
    } else {
      soundSynth.stopAmbient();
    }
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    setIsActive(false);
    soundSynth.stopAmbient();
    setSecondsLeft(selectedTrack.durationMinutes * 60);
  };

  const totalSecs = selectedTrack.durationMinutes * 60;
  const progressPct = ((totalSecs - secondsLeft) / totalSecs) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-slate-800 dark:text-slate-100">
      {/* Active Meditation Player */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-indigo-900/40 shadow-xl relative overflow-hidden">
        {/* Ambient background ripples */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 mb-3">
            {selectedTrack.type} session
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {selectedTrack.title}
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-md">
            {selectedTrack.description}
          </p>

          {/* Countdown Clock */}
          <div className="text-6xl md:text-7xl font-mono font-black text-indigo-100 my-8 tracking-tight">
            {formatSeconds(secondsLeft)}
          </div>

          {/* Progress Indicator */}
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Audio Soundscape Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
            <button
              onClick={() => setAmbientSound('rain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                ambientSound === 'rain'
                  ? 'bg-indigo-600 border-indigo-400 text-white font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain size={14} /> Soft Rain
            </button>
            <button
              onClick={() => setAmbientSound('waves')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                ambientSound === 'waves'
                  ? 'bg-indigo-600 border-indigo-400 text-white font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Waves size={14} /> Ocean Surf
            </button>
            <button
              onClick={() => setAmbientSound('forest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                ambientSound === 'forest'
                  ? 'bg-indigo-600 border-indigo-400 text-white font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Trees size={14} /> Forest Wind
            </button>
            <button
              onClick={() => setAmbientSound('none')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                ambientSound === 'none'
                  ? 'bg-slate-700 border-slate-500 text-white font-semibold'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <BellRing size={14} /> Bell Only
            </button>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetMeditation}
              className="p-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={toggleMeditation}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            >
              {isActive ? (
                <>
                  <Pause size={18} className="fill-slate-950" /> Pause
                </>
              ) : (
                <>
                  <Play size={18} className="fill-slate-950" /> Begin Meditation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Track Library List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-500" />
          Mindfulness & Sleep Meditation Library
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEDITATION_PRESETS.map(track => {
            const isSelected = selectedTrack.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {track.title}
                  </span>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {track.durationMinutes} min
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {track.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
