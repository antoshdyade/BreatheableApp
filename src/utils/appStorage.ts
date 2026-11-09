// Local persistence engine mirroring Room Database and Android DataStore
import { HabitItem, ButeykoMeasurement } from './wellnessData';

export interface UserProfileState {
  name: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  wakeTime: string;
  bedTime: string;
  hapticFeedback: boolean;
  soundEnabled: boolean;
  voiceGuidance: boolean;
  keepScreenAwake: boolean;
  onboardingCompleted: boolean;
}

export interface ActivityHistoryItem {
  id: string;
  type: 'breathing' | 'buteyko' | 'meditation' | 'pomodoro' | 'habit';
  title: string;
  durationMinutes: number;
  timestamp: string;
  notes?: string;
}

const DEFAULT_PROFILE: UserProfileState = {
  name: 'Alex Rivera',
  experienceLevel: 'Beginner',
  wakeTime: '06:30',
  bedTime: '22:30',
  hapticFeedback: true,
  soundEnabled: true,
  voiceGuidance: false,
  keepScreenAwake: true,
  onboardingCompleted: true
};

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    title: 'Morning 5-5 Coherent Breathing',
    category: 'Breathing',
    targetDaysPerWeek: 7,
    completedDates: ['2026-11-08', '2026-11-09'],
    streak: 2,
    longestStreak: 5,
    color: '#06b6d4'
  },
  {
    id: 'h-2',
    title: 'Educational Buteyko CP Check',
    category: 'Breathing',
    targetDaysPerWeek: 5,
    completedDates: ['2026-11-09'],
    streak: 1,
    longestStreak: 3,
    color: '#10b981'
  },
  {
    id: 'h-3',
    title: 'Daily 25m Focus Block',
    category: 'Productivity',
    targetDaysPerWeek: 5,
    completedDates: ['2026-11-07', '2026-11-08', '2026-11-09'],
    streak: 3,
    longestStreak: 12,
    color: '#f59e0b'
  },
  {
    id: 'h-4',
    title: 'Evening Body Scan Meditation',
    category: 'Mindfulness',
    targetDaysPerWeek: 6,
    completedDates: ['2026-11-08'],
    streak: 1,
    longestStreak: 4,
    color: '#8b5cf6'
  },
  {
    id: 'h-5',
    title: 'Nasal Breathing Awareness Walk',
    category: 'Health',
    targetDaysPerWeek: 5,
    completedDates: ['2026-11-09'],
    streak: 1,
    longestStreak: 8,
    color: '#ec4899'
  }
];

const DEFAULT_BUTEYKO_HISTORY: ButeykoMeasurement[] = [
  {
    id: 'b-1',
    date: '2026-11-07T07:15:00Z',
    cpSeconds: 16,
    mpSeconds: 28,
    pulseBefore: 74,
    pulseAfter: 72,
    notes: 'Morning measurement upon waking. Felt relaxed.'
  },
  {
    id: 'b-2',
    date: '2026-11-08T07:20:00Z',
    cpSeconds: 19,
    mpSeconds: 31,
    pulseBefore: 72,
    pulseAfter: 70,
    notes: 'After 5 mins of gentle diaphragmatic resting.'
  },
  {
    id: 'b-3',
    date: '2026-11-09T07:10:00Z',
    cpSeconds: 22,
    mpSeconds: 35,
    pulseBefore: 70,
    pulseAfter: 68,
    notes: 'Noticed easier nasal breathing throughout sleep.'
  }
];

const DEFAULT_HISTORY: ActivityHistoryItem[] = [
  {
    id: 'hist-1',
    type: 'breathing',
    title: 'Box Breathing (Square)',
    durationMinutes: 6,
    timestamp: '2026-11-09T08:30:00Z'
  },
  {
    id: 'hist-2',
    type: 'pomodoro',
    title: 'Focus Session: Architecture Planning',
    durationMinutes: 25,
    timestamp: '2026-11-09T10:15:00Z'
  },
  {
    id: 'hist-3',
    type: 'meditation',
    title: 'Morning Clarity & Grounding',
    durationMinutes: 5,
    timestamp: '2026-11-09T07:45:00Z'
  }
];

export class AppStorage {
  private static PROFILE_KEY = 'breathelife_profile';
  private static HABITS_KEY = 'breathelife_habits';
  private static BUTEYKO_KEY = 'breathelife_buteyko';
  private static HISTORY_KEY = 'breathelife_history';

  static getProfile(): UserProfileState {
    try {
      const data = localStorage.getItem(this.PROFILE_KEY);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(p: UserProfileState) {
    try {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(p));
    } catch {
      // Ignored
    }
  }

  static getHabits(): HabitItem[] {
    try {
      const data = localStorage.getItem(this.HABITS_KEY);
      return data ? JSON.parse(data) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  }

  static saveHabits(habits: HabitItem[]) {
    try {
      localStorage.setItem(this.HABITS_KEY, JSON.stringify(habits));
    } catch {
      // Ignored
    }
  }

  static getButeykoMeasurements(): ButeykoMeasurement[] {
    try {
      const data = localStorage.getItem(this.BUTEYKO_KEY);
      return data ? JSON.parse(data) : DEFAULT_BUTEYKO_HISTORY;
    } catch {
      return DEFAULT_BUTEYKO_HISTORY;
    }
  }

  static addButeykoMeasurement(m: ButeykoMeasurement) {
    const list = this.getButeykoMeasurements();
    list.unshift(m);
    try {
      localStorage.setItem(this.BUTEYKO_KEY, JSON.stringify(list));
    } catch {
      // Ignored
    }
    return list;
  }

  static getHistory(): ActivityHistoryItem[] {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  }

  static addHistory(item: ActivityHistoryItem) {
    const list = this.getHistory();
    list.unshift(item);
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(list));
    } catch {
      // Ignored
    }
    return list;
  }

  static exportJSON(): string {
    const backup = {
      profile: this.getProfile(),
      habits: this.getHabits(),
      buteyko: this.getButeykoMeasurements(),
      history: this.getHistory(),
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0'
    };
    return JSON.stringify(backup, null, 2);
  }

  static clearAllData() {
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.removeItem(this.HABITS_KEY);
    localStorage.removeItem(this.BUTEYKO_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
  }
}
