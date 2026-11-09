// Pure business logic and utilities for BreatheLife

export interface BreathingPattern {
  id: string;
  name: string;
  category: 'basic' | 'relaxation' | 'concentration' | 'buteyko' | 'routine';
  inhale: number; // in seconds
  hold1: number; // hold after inhale
  exhale: number; // in seconds
  hold2: number; // hold after exhale
  description: string;
  benefits: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  safetyWarning?: string;
  recommendedCycles: number;
}

export const BREATHING_PRESETS: BreathingPattern[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing (Square)',
    category: 'relaxation',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: 'Equal duration for inhale, hold, exhale, and hold. Used by elite athletes and Navy SEALs to regain calm and heightened focus under pressure.',
    benefits: 'Calms the nervous system, lowers cortisol, stabilizes heart rate variability.',
    difficulty: 'Beginner',
    recommendedCycles: 8
  },
  {
    id: '4-7-8',
    name: '4-7-8 Relaxing Breath',
    category: 'relaxation',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: 'Extended hold and slow exhalation that acts as a natural tranquilizer for the nervous system.',
    benefits: 'Promotes deep sleep onset, eases evening anxiety, shifts tone to parasympathetic.',
    difficulty: 'Intermediate',
    safetyWarning: 'If you feel lightheaded, reduce hold time to 4 seconds.',
    recommendedCycles: 6
  },
  {
    id: 'coherent-5-5',
    name: 'Coherent Breathing (5-5)',
    category: 'relaxation',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
    description: 'Breathing at approximately 6 breaths per minute to synchronize heart rate, blood pressure, and brainwaves (HRV resonance).',
    benefits: 'Maximizes heart rate variability (HRV), optimizes autonomic balance and emotional steadiness.',
    difficulty: 'Beginner',
    recommendedCycles: 12
  },
  {
    id: 'diaphragmatic-belly',
    name: 'Diaphragmatic Belly Breath',
    category: 'basic',
    inhale: 4,
    hold1: 1,
    exhale: 6,
    hold2: 1,
    description: 'Deep abdominal breathing expanding the lower rib cage and engaging the diaphragm.',
    benefits: 'Strengthens diaphragm, lowers blood pressure, reduces muscular tension across shoulders.',
    difficulty: 'Beginner',
    recommendedCycles: 10
  },
  {
    id: 'equal-breathing',
    name: 'Equal Breathing (Sama Vritti)',
    category: 'concentration',
    inhale: 4,
    hold1: 0,
    exhale: 4,
    hold2: 0,
    description: 'Steady, matched inhalation and exhalation promoting mental clarity before study or high-stakes work.',
    benefits: 'Enhances cognitive focus, settles wandering mind, sharpens attention span.',
    difficulty: 'Beginner',
    recommendedCycles: 10
  },
  {
    id: 'extended-exhale',
    name: 'Extended Exhale (4-6)',
    category: 'relaxation',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 1,
    description: 'Longer exhalation stimulates the vagus nerve and activates parasympathetic response.',
    benefits: 'Rapidly decelerates racing heart rate, relieves panic sensations.',
    difficulty: 'Beginner',
    recommendedCycles: 10
  },
  {
    id: 'buteyko-reduced',
    name: 'Buteyko Reduced Breathing',
    category: 'buteyko',
    inhale: 3,
    hold1: 0,
    exhale: 3,
    hold2: 2,
    description: 'Gentle, light nasal breathing to create a comfortable, mild air hunger (educational wellness practice).',
    benefits: 'Improves CO2 tolerance, promotes natural nasal breathing, prevents chronic hyperventilation.',
    difficulty: 'Intermediate',
    safetyWarning: 'Never practice while driving, swimming, or if pregnant/hypertensive. Keep air hunger mild and comfortable.',
    recommendedCycles: 15
  },
  {
    id: 'morning-energize',
    name: 'Morning Wake-Up Rhythm',
    category: 'routine',
    inhale: 4,
    hold1: 2,
    exhale: 3,
    hold2: 0,
    description: 'Uplifting morning breath pattern to oxygenate tissues and bring energetic alertness.',
    benefits: 'Wakes up mental faculty, clears morning brain fog without synthetic stimulants.',
    difficulty: 'Beginner',
    recommendedCycles: 8
  }
];

export interface HabitItem {
  id: string;
  title: string;
  category: 'Breathing' | 'Mindfulness' | 'Productivity' | 'Health' | 'Sleep';
  targetDaysPerWeek: number;
  completedDates: string[]; // YYYY-MM-DD
  streak: number;
  longestStreak: number;
  color: string;
}

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

export interface ButeykoMeasurement {
  id: string;
  date: string; // ISO
  cpSeconds: number; // Control Pause (educational)
  mpSeconds?: number; // Maximum Pause
  pulseBefore?: number;
  pulseAfter?: number;
  notes: string;
}

export interface MeditationTrack {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'guided' | 'ambient' | 'silent' | 'body-scan';
  description: string;
  ambientSound?: 'rain' | 'forest' | 'waves' | 'bell' | 'white-noise';
}

export const MEDITATION_PRESETS: MeditationTrack[] = [
  {
    id: 'morning-clarity',
    title: 'Morning Clarity & Grounding',
    durationMinutes: 5,
    type: 'guided',
    description: 'Start your morning with grounded intention, soft posture scan, and calm breath presence.',
    ambientSound: 'forest'
  },
  {
    id: 'stress-release-bodyscan',
    title: 'Full Body Tension Release',
    durationMinutes: 10,
    type: 'body-scan',
    description: 'Systematic awareness scan from crown to toes, releasing trapped tension in jaw, neck, and shoulders.',
    ambientSound: 'rain'
  },
  {
    id: 'open-awareness',
    title: 'Silent Open Awareness & Bell',
    durationMinutes: 15,
    type: 'silent',
    description: 'Unstructured mindfulness observing sensations and thoughts without grasping, guided by gentle interval bells.',
    ambientSound: 'bell'
  },
  {
    id: 'ocean-drift-sleep',
    title: 'Evening Ocean Drift (Sleep Prep)',
    durationMinutes: 20,
    type: 'ambient',
    description: 'Slow rhythmic waves designed to lower mental chatter and gently transition into deep slumber.',
    ambientSound: 'waves'
  }
];

// Helper calculations
export function calculateStreak(completedDates: string[], todayStr: string): number {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const sorted = Array.from(new Set(completedDates)).sort().reverse();
  const today = new Date(todayStr);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Is today completed or yesterday completed?
  const hasToday = sorted.includes(todayStr);
  const hasYesterday = sorted.includes(yesterdayStr);
  
  if (!hasToday && !hasYesterday) {
    return 0;
  }
  
  let currentStreak = 0;
  let checkDate = new Date(hasToday ? todayStr : yesterdayStr);
  
  while (true) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (sorted.includes(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return currentStreak;
}

export function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Educational Buteyko CP Interpretation (strictly non-diagnostic wellness feedback)
export function interpretControlPause(cp: number): { label: string; description: string; color: string } {
  if (cp < 10) {
    return {
      label: 'Gentle Support Needed',
      description: 'Educational indicator of elevated breathing volume. Focus on slow, effortless nasal breathing.',
      color: '#f87171' // red-400
    };
  } else if (cp < 20) {
    return {
      label: 'Developing Awareness',
      description: 'Typical sedentary baseline. Gentle relaxation and posture awareness can help gradually lengthen natural pause.',
      color: '#fbbf24' // amber-400
    };
  } else if (cp < 30) {
    return {
      label: 'Good Functional Baseline',
      description: 'Shows comfortable breathing control. You are naturally pacing your respiratory cycles well.',
      color: '#34d399' // emerald-400
    };
  } else if (cp < 40) {
    return {
      label: 'Strong Respiratory Stamina',
      description: 'High CO2 tolerance and calm autonomic balance. Excellent physical efficiency.',
      color: '#60a5fa' // blue-400
    };
  } else {
    return {
      label: 'Exceptional Calm & Control',
      description: 'Mastery of relaxed, slow breathing physiology.',
      color: '#a78bfa' // purple-400
    };
  }
}
