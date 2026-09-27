export type StopwatchMode = 'inertia' | 'goal';

export interface Lap {
  id: string;
  lapNumber: number;
  lapTime: number; // in milliseconds
  totalTime: number; // in milliseconds
  mode: StopwatchMode;
  timestamp: number;
}

export interface SessionRecord {
  id: string;
  date: string;
  title: string;
  inertiaTimeMs: number;
  goalTimeMs: number;
  totalTimeMs: number;
  lapsCount: number;
  completedGoal: boolean;
}

export type AppTheme = 'light' | 'dark' | 'midnight' | 'slate';

export interface DualStopwatchConfig {
  inertiaTargetMs: number; // Default e.g. 2 minutes (120000ms) or 5 minutes (300000ms)
  goalTargetMs: number; // Default e.g. 30 minutes (1800000ms) or unlimited
  autoTransitionToGoal: boolean; // Auto start Goal stopwatch when Inertia target is reached
  soundEnabled: boolean;
  tickSoundEnabled: boolean;
  theme: AppTheme;
}
