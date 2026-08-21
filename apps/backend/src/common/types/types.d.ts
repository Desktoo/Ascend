export interface CachedHabitMeta {
  currentStreak: string;
  longestStreak: string;
  stabilityScore: string;
}

export type TaskMetaDataType = 'Standard' | 'HabitTask' | 'GoalTask';

export interface CreateHabitLogDto {
  userId: string;
  habitId: string;
  timestamp: string; // ISO String or Unix timestamp string
  status: 'COMPLETED' | 'SKIPPED' | 'FAILED';
  notes?: string;
  metadata?: Record<string, any>;
}

export interface HabitLogItem extends Omit<
  CreateHabitLogDto,
  'userId' | 'habitId' | 'timestamp'
> {
  PK: string; // USER#<userId>
  SK: string; // LOG#HABIT#<habitId>#<timestamp>
  userId: string;
  habitId: string;
  timestamp: string;
  createdAt: string;
}

export interface HistoricalDayLog {
  isOffDay: boolean;
  tasksSnapshot: Array<{ name: string; completed: boolean }>;
}

export interface TaskSnapshotItem {
  name: string;
  completed: boolean;
}

export interface CreateGoalLogDto {
  userId: string;
  goalId: string;
  timestamp: string; // ISO String (e.g., "2026-07-19T00:00:00.000Z")
  isOffDay: boolean;
  wasSuccessful: boolean;
  progressAtDate: number;
  velocityAtDate: number;
  tasksSnapshot: TaskSnapshotItem[];
}

export interface GoalLogItem extends CreateGoalLogDto {
  PK: string;
  SK: string;
  createdAt: string; // Operational system log audit time
}
