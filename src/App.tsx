import React, { useState, useEffect } from 'react';
import { BREATHING_PRESETS, BreathingPattern } from './utils/wellnessData';
import { BreathingTrainer } from './components/BreathingTrainer';
import { ButeykoModule } from './components/ButeykoModule';
import { PomodoroModule } from './components/PomodoroModule';
import { HabitsModule } from './components/HabitsModule';
import { MeditationModule } from './components/MeditationModule';
import { AndroidExportHub } from './components/AndroidExportHub';
import { AppStorage, ActivityHistoryItem, UserProfileState } from './utils/appStorage';
import {
  Wind,
  Flame,
  Clock,
  Sparkles,
  Smartphone,
  ChevronRight,
  Play,
  Heart,
  Moon,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Sliders,
  Settings
} from 'lucide-react';

type NavTab = 'dashboard' | 'breathe' | 'buteyko' | 'pomodoro' | 'habits' | 'meditation' | 'publish' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeBreathingPattern, setActiveBreathingPattern] = useState<BreathingPattern | null>(null);
  const [profile, setProfile] = useState<UserProfileState>(AppStorage.getProfile());
  const [history, setHistory] = useState<ActivityHistoryItem[]>(AppStorage.getHistory());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setProfile(AppStorage.getProfile());
    setHistory(AppStorage.getHistory());
  }, [activeTab]);

  const handleStartExercise = (p: BreathingPattern) => {
    setActiveBreathingPattern(p);
    setActiveTab('breathe');
  };

  const handleCompleteBreathing = (name: string, minutes: number) => {
    const updated = AppStorage.addHistory({
      id: `hist-${Date.now()}`,
      type: 'breathing',
      title: name,
      durationMinutes: minutes,
      timestamp: new Date().toISOString()
    });
    setHistory(updated);
  };

  // Filtered breathing library
  const filteredPresets = selectedCategory === 'all'
    ? BREATHING_PRESETS
    : BREATHING_PRESETS.filter(p => p.category === selectedCategory);

  // Stats calculation
  const totalBreathingMinutes = history
    .filter(h => h.type === 'breathing')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const totalFocusMinutes = history
    .filter(h => h.type === 'pomodoro')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const totalMeditationMinutes = history
    .filter(h => h.type === 'meditation')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Wind size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  BreatheLife
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  Android & Web
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Breathing • Buteyko • Pomodoro • Habits • Wellness
              </p>
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('dashboard'); setActiveBreathingPattern(null); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('breathe')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'breathe'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Breathe
            </button>
            <button
              onClick={() => { setActiveTab('buteyko'); setActiveBreathingPattern(null); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'buteyko'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Buteyko CP
            </button>
            <button
              onClick={() => { setActiveTab('pomodoro'); setActiveBreathingPattern(null); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'pomodoro'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Focus (Pomodoro)
            </button>
            <button
              onClick={() => { setActiveTab('habits'); setActiveBreathingPattern(null); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'habits'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Habits
            </button>
            <button
              onClick={() => { setActiveTab('meditation'); setActiveBreathingPattern(null); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'meditation'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Meditation
            </button>
            <button
              onClick={() => { setActiveTab('publish'); setActiveBreathingPattern(null); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'publish'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Android Studio Hub
            </button>
          </nav>

          <button
            onClick={() => setActiveTab('publish')}
            className="md:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-600 text-white"
          >
            <Smartphone size={14} /> Android Hub
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 mb-16 md:mb-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Greeting & Routine */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-teal-600/30 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs uppercase tracking-wider text-teal-300 font-bold block mb-1">
                  Welcome Back, {profile.name}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  Ground Your Breath. Elevate Your Focus.
                </h2>
                <p className="text-xs md:text-sm text-teal-100/90 mt-2 leading-relaxed">
                  Your daily holistic sanctuary combining conscious respiratory biomechanics, educational Buteyko pause tracking, distraction-free Pomodoro sprints, and daily habit consistency.
                </p>

                {/* Quick action shortcuts */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button
                    onClick={() => handleStartExercise(BREATHING_PRESETS[0])}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-md hover:bg-teal-50 active:scale-95 transition-all"
                  >
                    <Play size={15} className="fill-teal-900" /> Quick Box Breathing (4m)
                  </button>
                  <button
                    onClick={() => setActiveTab('buteyko')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-900/90 text-teal-200 border border-teal-500/30 text-xs font-semibold transition-all"
                  >
                    Test Control Pause
                  </button>
                  <button
                    onClick={() => setActiveTab('pomodoro')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-900/90 text-teal-200 border border-teal-500/30 text-xs font-semibold transition-all"
                  >
                    Start 25m Focus Sprint
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Breathing Time</span>
                  <Wind size={16} className="text-teal-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {totalBreathingMinutes} <span className="text-sm font-normal text-slate-400">mins</span>
                </div>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold block mt-1">
                  Parasympathetic tone
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Focus Duration</span>
                  <Clock size={16} className="text-amber-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {totalFocusMinutes} <span className="text-sm font-normal text-slate-400">mins</span>
                </div>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  Deep productivity blocks
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Meditation</span>
                  <Sparkles size={16} className="text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {totalMeditationMinutes} <span className="text-sm font-normal text-slate-400">mins</span>
                </div>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-1">
                  Mindfulness awareness
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Habit Consistency</span>
                  <Flame size={16} className="text-rose-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  3 <span className="text-sm font-normal text-slate-400">day streak</span>
                </div>
                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  Active daily ritual
                </span>
              </div>
            </div>

            {/* Daily Personalized Routine Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-teal-600 dark:text-teal-400" />
                Personalized Daily Routine Blueprint
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Morning */}
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-800 dark:text-teal-300 mb-2">
                    <span>Morning (06:30 – 08:00)</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-[10px]">Energize</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    <li>• Natural wake-up & hydration</li>
                    <li>• <strong>Buteyko Control Pause</strong> test</li>
                    <li>• 6m <strong>Box Breathing</strong> or 5-5 Coherent</li>
                    <li>• Review daily habit checklist</li>
                  </ul>
                </div>

                {/* Afternoon */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                    <span>Afternoon (13:00 – 16:00)</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-[10px]">Productivity</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    <li>• 25m <strong>Pomodoro Focus</strong> blocks</li>
                    <li>• 5m short breathing breaks between tasks</li>
                    <li>• Mindful nasal breathing posture check</li>
                  </ul>
                </div>

                {/* Night */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-800 dark:text-indigo-300 mb-2">
                    <span>Evening & Sleep (21:00 – 22:30)</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-[10px]">Restore</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                    <li>• Screen light down</li>
                    <li>• 4-7-8 Relaxing breath (6 cycles)</li>
                    <li>• <strong>Evening Ocean Drift</strong> audio timer</li>
                    <li>• Sleep journal rating</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-600 dark:text-teal-400" />
                Recent Wellness Activity Log
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {history.slice(0, 5).map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
                        {item.type === 'breathing' && <Wind size={16} />}
                        {item.type === 'buteyko' && <Heart size={16} />}
                        {item.type === 'pomodoro' && <Clock size={16} />}
                        {item.type === 'meditation' && <Sparkles size={16} />}
                        {item.type === 'habit' && <CheckCircle2 size={16} />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{item.title}</span>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">
                      {item.durationMinutes} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BREATHING LIBRARY & TRAINER */}
        {activeTab === 'breathe' && (
          <div>
            {activeBreathingPattern ? (
              <BreathingTrainer
                pattern={activeBreathingPattern}
                onCompleteSession={handleCompleteBreathing}
                onBack={() => setActiveBreathingPattern(null)}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      Breathing Exercise Library
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Scientifically-grounded respiratory cadences with animated pacing guides and audio chimes.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
                    {['all', 'relaxation', 'basic', 'concentration', 'buteyko', 'routine'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                          selectedCategory === cat
                            ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Exercises */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPresets.map(pattern => (
                    <div
                      key={pattern.id}
                      className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-500/50 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                            {pattern.category}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {pattern.recommendedCycles} cycles
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {pattern.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {pattern.description}
                        </p>

                        {/* Rhythm breakdown */}
                        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 my-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                          <span>In: {pattern.inhale}s</span>
                          {pattern.hold1 > 0 && <span>• Hold: {pattern.hold1}s</span>}
                          <span>• Out: {pattern.exhale}s</span>
                          {pattern.hold2 > 0 && <span>• Hold: {pattern.hold2}s</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartExercise(pattern)}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-teal-600 dark:bg-slate-800 dark:hover:bg-teal-600 text-slate-700 hover:text-white dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Play size={14} className="fill-current" /> Start Practice
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BUTEYKO MODULE */}
        {activeTab === 'buteyko' && <ButeykoModule />}

        {/* TAB 4: POMODORO MODULE */}
        {activeTab === 'pomodoro' && <PomodoroModule />}

        {/* TAB 5: HABITS MODULE */}
        {activeTab === 'habits' && <HabitsModule />}

        {/* TAB 6: MEDITATION MODULE */}
        {activeTab === 'meditation' && <MeditationModule />}

        {/* TAB 7: PUBLISH & ANDROID ARTIFACTS */}
        {activeTab === 'publish' && <AndroidExportHub />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-3 flex items-center justify-around text-[10px] font-semibold text-slate-500 dark:text-slate-400">
        <button
          onClick={() => { setActiveTab('dashboard'); setActiveBreathingPattern(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}
        >
          <BarChart3 size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('breathe')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'breathe' ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}
        >
          <Wind size={18} />
          <span>Breathe</span>
        </button>

        <button
          onClick={() => { setActiveTab('pomodoro'); setActiveBreathingPattern(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'pomodoro' ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}
        >
          <Clock size={18} />
          <span>Focus</span>
        </button>

        <button
          onClick={() => { setActiveTab('habits'); setActiveBreathingPattern(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'habits' ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}
        >
          <Flame size={18} />
          <span>Habits</span>
        </button>

        <button
          onClick={() => { setActiveTab('publish'); setActiveBreathingPattern(null); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'publish' ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}
        >
          <Smartphone size={18} />
          <span>Android</span>
        </button>
      </nav>
    </div>
  );
}
