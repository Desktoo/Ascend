export interface ActiveGoalOption {
  id: string;
  title: string;
  description?: string;
  completedDays: number;
  targetDays: number;
}

export interface GoalTomorrowTaskInput {
  goalId: string;
  taskTitle: string;
  taskDueTime: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface ReflectionFormData {
  reflectionText: string;
  tomorrowTasks: Record<string, GoalTomorrowTaskInput>;
}

export interface ReflectionSubmissionPayload {
  reflectionText: string;
  dayStartTime: string;
  tomorrowTasks: GoalTomorrowTaskInput[];
}

export interface SubmitSelfReflectionPayload {
  reflectionText: string;
  completedGoalIds?: string[];
  tomorrowTasks?: GoalTomorrowTaskInput[];
  dayStartTime: string;
  timeZone: string;
}

export interface SelfReflectionResponse {
  success: boolean;
  reflectionId: string;
  logicalDate: string;
  submittedAt: string;
  createdTasksCount: number;
}