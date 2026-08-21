import { Priority } from "@/core/types/tasks.types";

export interface HabitDto {
  title: string;
  description?: string;
  selectedDays: string[];
  selectedTag: string;
  taskTitle: string;
  dueTime: string;
  priority: string;
}

export interface HabitResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  tag: string;
  daysOfWeek: string[];
  isActive: boolean;
  taskTitle: string;
  taskDueTime: string;
  taskPriority: Priority;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface HabitsPageResponse {
  id: string;
  title: string;
  isActive: boolean;
  tag: string;
  currentStreak: number;
  longestStreak: number;
  stabilityScore: number;
}

export interface HabitDetailsPageResponse {
  id: string;
  title: string;
  description: string;
  tag: string;
  isActive: boolean;
  taskTitle: string;
  taskPriority: "HIGH" | "MEDIUM" | "LOW";
  taskDueTime: string;
  currentStreak: number;
  longestStreak: number;
  stabilityScore: number;
  daysOfWeek: string[];
}

export interface HabitBackendLog {
  yearMonth: string;
  history: string;
}

export interface DynamoDBLog {
  PK: string;
  SK: string;
  userId: string;
  habitId: string;
  timestamp: string;
  status: string;
  notes?: string;
  metadata?: Record<string, string>;
  createdAt: string;
}