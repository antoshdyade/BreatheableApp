import React, { useState, useEffect } from 'react';
import { HabitItem, calculateStreak, getTodayDateString } from '../utils/wellnessData';
import { AppStorage } from '../utils/appStorage';
import { CheckCircle2, Circle, Flame, Plus, Trash2, Calendar, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HabitsModule: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<HabitItem['category']>('Breathing');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const todayStr = getTodayDateString();

  useEffect(() => {
    setHabits(AppStorage.getHabits());
  }, []);

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      const isDoneToday = h.completedDates.includes(todayStr);
      let newDates: string[];

      if (isDoneToday) {
        newDates = h.completedDates.filter(d => d !== todayStr);
      } else {
        newDates = [...h.completedDates, todayStr];
        try {
          confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });
        } catch {
          // Ignored
        }
      }

      const streak = calculateStreak(newDates, todayStr);
      const longest = Math.max(h.longestStreak, streak);

      return {
        ...h,
        completedDates: newDates,
        streak,
        longestStreak: longest
      };
    });

    setHabits(updated);
    AppStorage.saveHabits(updated);
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const item: HabitItem = {
      id: `habit-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetDaysPerWeek: 7,
      completedDates: [],
      streak: 0,
      longestStreak: 0,
      color: randomColor
    };

    const updated = [...habits, item];
    setHabits(updated);
    AppStorage.saveHabits(updated);
    setNewTitle('');
    setShowAddForm(false);
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    AppStorage.saveHabits(updated);
  };

  // 7-day mini timeline view
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const completedTodayCount = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const habitPercentage = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header and Summary stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 p-6 rounded-3xl border border-teal-500/20">
        <div>
          <span className="text-xs uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold block mb-1">
            Habit Consistency Engine
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Daily Rituals & Streaks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build sustained nervous-system resilience through daily micro-habits.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Today's Progress</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                {habitPercentage}%
              </span>
              <span className="text-xs text-slate-400">({completedTodayCount}/{habits.length})</span>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} /> New Habit
          </button>
        </div>
      </div>

      {/* Add Habit Dialog */}
      {showAddForm && (
        <form onSubmit={addHabit} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Create New Habit</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Habit Title</label>
              <input
                type="text"
                placeholder="e.g. 10m Box breathing before meetings"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as HabitItem['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Breathing">Breathing</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Productivity">Productivity</option>
                <option value="Health">Health</option>
                <option value="Sleep">Sleep</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white"
            >
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Habit Cards List */}
      <div className="space-y-3">
        {habits.map(habit => {
          const isDoneToday = habit.completedDates.includes(todayStr);
          return (
            <div
              key={habit.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Left Habit Info & Checkbox */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className="transition-transform active:scale-90"
                  aria-label={isDoneToday ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
                >
                  {isDoneToday ? (
                    <CheckCircle2 size={24} className="text-teal-600 dark:text-teal-400" />
                  ) : (
                    <Circle size={24} className="text-slate-300 dark:text-slate-600 hover:text-teal-500" />
                  )}
                </button>
                <div>
                  <h4 className={`text-sm font-bold ${isDoneToday ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {habit.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                    >
                      {habit.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Flame size={12} className={habit.streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
                      {habit.streak}d streak (Best: {habit.longestStreak}d)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Mini-Calendar (Last 7 Days) */}
              <div className="flex items-center gap-4 self-end md:self-auto">
                <div className="flex items-center gap-1.5">
                  {last7Days.map((dateStr, idx) => {
                    const done = habit.completedDates.includes(dateStr);
                    const dayLabel = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'narrow' });
                    const isToday = dateStr === todayStr;

                    return (
                      <div key={dateStr} className="flex flex-col items-center">
                        <span className={`text-[9px] mb-1 font-mono ${isToday ? 'font-bold text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
                          {dayLabel}
                        </span>
                        <button
                          onClick={() => {
                            if (dateStr === todayStr) toggleHabit(habit.id);
                          }}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all ${
                            done
                              ? 'bg-teal-500 text-white font-bold'
                              : isToday
                              ? 'border-2 border-dashed border-teal-500/50 bg-teal-50/50 dark:bg-teal-950/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                          title={`${dateStr}: ${done ? 'Completed' : 'Missed'}`}
                        >
                          {done ? '✓' : ''}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg"
                  title="Delete habit"
                  aria-label="Delete habit"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
