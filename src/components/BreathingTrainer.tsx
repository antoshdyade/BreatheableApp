import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPattern } from '../utils/wellnessData';
import { soundSynth } from '../utils/soundSynth';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BreathingTrainerProps {
  pattern: BreathingPattern;
  onCompleteSession?: (patternName: string, minutes: number) => void;
  onBack?: () => void;
}

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Sustain';

export const BreathingTrainer: React.FC<BreathingTrainerProps> = ({
  pattern,
  onCompleteSession,
  onBack
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(pattern.inhale);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const cycleRef = useRef<number>(1);
  cycleRef.current = cycleCount;

  // Compute scale and label for visual breathing circle
  const getScale = () => {
    if (!isActive) return 1;
    if (currentPhase === 'Inhale') {
      const progress = 1 - (phaseSecondsLeft / pattern.inhale);
      return 1 + progress * 0.55; // Expand from 1.0 to 1.55
    } else if (currentPhase === 'Hold') {
      return 1.55; // Maintained full
    } else if (currentPhase === 'Exhale') {
      const progress = 1 - (phaseSecondsLeft / pattern.exhale);
      return 1.55 - progress * 0.55; // Deflate down to 1.0
    } else {
      // Sustain / empty hold
      return 1.0;
    }
  };

  const advancePhase = useCallback(() => {
    if (currentPhase === 'Inhale') {
      if (pattern.hold1 > 0) {
        setCurrentPhase('Hold');
        setPhaseSecondsLeft(pattern.hold1);
        if (soundOn) soundSynth.playClick(true);
      } else {
        setCurrentPhase('Exhale');
        setPhaseSecondsLeft(pattern.exhale);
        if (soundOn) soundSynth.playClick(false);
      }
    } else if (currentPhase === 'Hold') {
      setCurrentPhase('Exhale');
      setPhaseSecondsLeft(pattern.exhale);
      if (soundOn) soundSynth.playClick(false);
    } else if (currentPhase === 'Exhale') {
      if (pattern.hold2 > 0) {
        setCurrentPhase('Sustain');
        setPhaseSecondsLeft(pattern.hold2);
        if (soundOn) soundSynth.playClick(false);
      } else {
        finishCycle();
      }
    } else if (currentPhase === 'Sustain') {
      finishCycle();
    }
  }, [currentPhase, pattern, soundOn]);

  const finishCycle = () => {
    if (cycleRef.current >= pattern.recommendedCycles) {
      setIsActive(false);
      setIsFinished(true);
      if (soundOn) soundSynth.playBell(528, 4);
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignored
      }
      const minutesSpent = Math.max(1, Math.round(totalSecondsElapsed / 60));
      onCompleteSession?.(pattern.name, minutesSpent);
    } else {
      setCycleCount(c => c + 1);
      setCurrentPhase('Inhale');
      setPhaseSecondsLeft(pattern.inhale);
      if (soundOn) soundSynth.playBell(432, 1.5);
    }
  };

  // Timer heartbeat
  useEffect(() => {
    if (!isActive || isFinished) return;

    const interval = setInterval(() => {
      setTotalSecondsElapsed(s => s + 1);
      setPhaseSecondsLeft(prev => {
        if (prev <= 1) {
          advancePhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isFinished, advancePhase]);

  const toggleActive = () => {
    if (!isActive && totalSecondsElapsed === 0 && soundOn) {
      soundSynth.playBell(432, 2);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsFinished(false);
    setCurrentPhase('Inhale');
    setPhaseSecondsLeft(pattern.inhale);
    setCycleCount(1);
    setTotalSecondsElapsed(0);
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'Inhale': return 'Gently breathe in through your nose';
      case 'Hold': return 'Rest gently with full lungs — stay soft';
      case 'Exhale': return 'Smooth, effortless release';
      case 'Sustain': return 'Rest comfortable at natural pause';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] p-6 text-slate-800 dark:text-slate-100 max-w-xl mx-auto">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          &larr; Back to Library
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title={soundOn ? 'Mute chimes' : 'Unmute chimes'}
            aria-label={soundOn ? 'Mute chimes' : 'Unmute chimes'}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium">
            Cycle {cycleCount} / {pattern.recommendedCycles}
          </span>
        </div>
      </div>

      {/* Title & Pattern Details */}
      <div className="text-center my-3">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {pattern.name}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          {pattern.description}
        </p>
      </div>

      {/* Safety Banner if present */}
      {pattern.safetyWarning && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200 mb-2">
          <ShieldAlert size={16} className="shrink-0 text-amber-500" />
          <span>{pattern.safetyWarning}</span>
        </div>
      )}

      {/* Central Visual Breathing Orb */}
      <div className="relative flex items-center justify-center my-6 h-64 w-64">
        {/* Ambient Ring Glow */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out opacity-25 filter blur-xl"
          style={{
            transform: `scale(${getScale() * 1.15})`,
            backgroundColor: currentPhase === 'Inhale' ? '#0d9488' : currentPhase === 'Hold' ? '#3b82f6' : '#6366f1'
          }}
        />

        {/* Outer Guide Boundary */}
        <div className="absolute h-56 w-56 rounded-full border border-dashed border-teal-500/30 dark:border-teal-400/20" />

        {/* Core Animated Breath Circle */}
        <div
          className="h-44 w-44 rounded-full flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-1000 ease-in-out select-none"
          style={{
            transform: `scale(${getScale()})`,
            background: currentPhase === 'Inhale'
              ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
              : currentPhase === 'Hold'
              ? 'linear-gradient(135deg, #38bdf8, #2563eb)'
              : currentPhase === 'Exhale'
              ? 'linear-gradient(135deg, #818cf8, #4f46e5)'
              : 'linear-gradient(135deg, #94a3b8, #64748b)'
          }}
        >
          <span className="text-xs uppercase tracking-widest text-teal-100 font-semibold opacity-90">
            {currentPhase}
          </span>
          <span className="text-4xl font-extrabold text-white my-1 font-mono">
            {isActive ? phaseSecondsLeft : pattern.inhale}s
          </span>
          <span className="text-[11px] text-teal-100/90 font-medium px-2">
            {isActive ? getPhaseInstruction() : 'Tap Start to begin'}
          </span>
        </div>
      </div>

      {/* Pattern Blueprint Timing pills */}
      <div className="flex items-center justify-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full mb-4">
        <span className={currentPhase === 'Inhale' ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}>In: {pattern.inhale}s</span>
        <span>•</span>
        {pattern.hold1 > 0 && (
          <>
            <span className={currentPhase === 'Hold' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''}>Hold: {pattern.hold1}s</span>
            <span>•</span>
          </>
        )}
        <span className={currentPhase === 'Exhale' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>Out: {pattern.exhale}s</span>
        {pattern.hold2 > 0 && (
          <>
            <span>•</span>
            <span className={currentPhase === 'Sustain' ? 'text-slate-700 dark:text-slate-300 font-bold' : ''}>Hold: {pattern.hold2}s</span>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleReset}
          className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Restart Session"
          aria-label="Restart Session"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={toggleActive}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-semibold shadow-lg shadow-teal-500/25 transition-all text-base"
        >
          {isActive ? (
            <>
              <Pause size={20} className="fill-white" /> Pause
            </>
          ) : (
            <>
              <Play size={20} className="fill-white" /> {totalSecondsElapsed > 0 ? 'Resume' : 'Start Session'}
            </>
          )}
        </button>
      </div>

      {/* Completion Modal / Banner */}
      {isFinished && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="h-16 w-16 mx-auto mb-4 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center">
              <Award size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Session Completed!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
              You completed all {pattern.recommendedCycles} cycles of {pattern.name}. Your nervous system is grounded and balanced.
            </p>
            <button
              onClick={() => {
                setIsFinished(false);
                onBack?.();
              }}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold"
            >
              Done & Return to Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
