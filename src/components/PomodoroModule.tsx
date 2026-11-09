import React, { useState, useEffect } from 'react';
import { formatSeconds } from '../utils/wellnessData';
import { AppStorage } from '../utils/appStorage';
import { soundSynth } from '../utils/soundSynth';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Target, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export const PomodoroModule: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<string>('Deep Work & Focus');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Mode durations (in seconds)
  const durations: Record<PomodoroMode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const switchMode = (newMode: PomodoroMode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(durations[newMode]);
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          handleTimerFinished();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, mode]);

  const handleTimerFinished = () => {
    setIsActive(false);
    if (soundEnabled) soundSynth.playBell(528, 4);

    if (mode === 'focus') {
      try {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      } catch {
        // Ignored
      }
      const newCount = completedSessionsCount + 1;
      setCompletedSessionsCount(newCount);

      // Record to history
      AppStorage.addHistory({
        id: `pomo-${Date.now()}`,
        type: 'pomodoro',
        title: `Focus: ${currentTask}`,
        durationMinutes: 25,
        timestamp: new Date().toISOString()
      });

      // Transition to break
      if (newCount % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      // Break finished, back to focus
      switchMode('focus');
    }
  };

  const toggleTimer = () => {
    if (!isActive && soundEnabled) {
      soundSynth.playBell(432, 1);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(durations[mode]);
  };

  const progressPct = ((durations[mode] - secondsLeft) / durations[mode]) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6 text-slate-800 dark:text-slate-100">
      {/* Mode Selector Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'focus'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'shortBreak'
              ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'longBreak'
              ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Main Timer Display */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center relative overflow-hidden">
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              mode === 'focus' ? 'bg-teal-500' : mode === 'shortBreak' ? 'bg-sky-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Task Title Input */}
        <div className="max-w-xs mx-auto mb-6">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Focus Goal
          </label>
          <input
            type="text"
            value={currentTask}
            onChange={e => setCurrentTask(e.target.value)}
            className="w-full text-center text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Big Countdown */}
        <div className="text-7xl md:text-8xl font-black font-mono tracking-tighter text-slate-900 dark:text-white my-6 select-none">
          {formatSeconds(secondsLeft)}
        </div>

        {/* Subtext info */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 flex items-center justify-center gap-1.5">
          {mode === 'focus' ? (
            <>
              <Target size={15} className="text-teal-600 dark:text-teal-400" />
              Maintain mindful immersion. Resist multi-tasking.
            </>
          ) : (
            <>
              <Coffee size={15} className="text-sky-600 dark:text-sky-400" />
              Rest your eyes. Stand up, stretch, and take 3 deep nasal breaths.
            </>
          )}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Reset Timer"
            aria-label="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-9 py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all text-base ${
              mode === 'focus'
                ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/25'
                : mode === 'shortBreak'
                ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-500/25'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
            }`}
          >
            {isActive ? (
              <>
                <Pause size={20} className="fill-white" /> Pause
              </>
            ) : (
              <>
                <Play size={20} className="fill-white" /> Start
              </>
            )}
          </button>

          <button
            onClick={() => handleTimerFinished()}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Skip Phase"
            aria-label="Skip Phase"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Daily Progress & Session Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Focus Rounds
          </span>
          <span className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400">
            {completedSessionsCount} / 4
          </span>
          <div className="flex justify-center gap-1.5 mt-2">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full ${
                  i <= (completedSessionsCount % 4 || (completedSessionsCount > 0 && completedSessionsCount % 4 === 0 ? 4 : 0))
                    ? 'bg-teal-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Total Minutes
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {completedSessionsCount * 25}m
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Today's Focus</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Next Break
          </span>
          <span className="text-sm font-semibold text-sky-600 dark:text-sky-400 mt-2 block">
            {completedSessionsCount % 4 === 3 ? '15m Long Break' : '5m Short Break'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Audio Alert
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg mt-1 transition-colors ${
              soundEnabled
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? 'Tibetan Bell On' : 'Muted'}
          </button>
        </div>
      </div>
    </div>
  );
};
