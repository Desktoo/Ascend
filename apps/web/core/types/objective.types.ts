export type HorizonType = "Weekly" | "Monthly";
export type GoalTaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type GoalStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";

export interface GoalDto {
  title: string;
  description?: string;
  rewardText?: string;
  timeframe: HorizonType;
  weekendsExcluded: boolean;
  configuredWorkDaysPerWeek: number;
  startDate: string; // ISO Date String "YYYY-MM-DD"
  monthlyWeekThemes?: string[];
  firstGoalTask: string;
  groupTaskDueTime?: string; // Maps to goalTaskDueTime based on payload configuration
  goalTaskDueTime: string;   // "HH:mm" format
  goalTaskPriority: GoalTaskPriority;
}

// Represents the schema output shape returned inside the standard operational response matrix
export interface GoalData {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  rewardText: string | null;
  timeFrame: "WEEKLY" | "MONTHLY";
  weekendsExcluded: boolean;
  configeDaysPerWeek: number;
  monthlyWeekSprints: string[];
  status: GoalStatus;
  startDate: string;
  createdAt: string;
  updatedTime: string;
}



export interface GoalResponse {
  status: "success" | "error";
  message: string;
  data: {
    goal: GoalData;
  };
}

export interface GoalPageResponse {
  id: string;
  title: string;
  timeFrame: HorizonType;
  currentProgress: number;
  startDate: string;
}

export interface Objective {
  id: string;
  title: string;
  percentage: number;
  timeframe: HorizonType;
  startDate: string;
}

export interface GoalDetailResponse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  rewardText?: string;
  timeFrame: HorizonType;
  weekendsExcluded: boolean;
  configeDaysPerWeek: number;
  monthlyWeekSprints: string[];
  status: GoalStatus;
  targetDays: number;
  completedDays: number;
  startDate: string;
  currentProgress: number;
  currentVelocity: number;
  totalActiveDays: number;
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "LOCKED";

export interface TaskLog {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  type: "Standard" | "HabitTask" | "GoalTask";
  priority: "HIGH" | "MEDIUM" | "LOW";
  scheduledDate: string; // "YYYY-MM-DD"
  dueTime: string | null; // ISO UTC string
  completedDate: string; // "YYYY-MM-DD"
  completedAt: string | null; // ISO UTC string
  isOntime: boolean;
  completionStatus: "ON_TIME" | "LATE" | "PENDING";
  goalId: string | null;
  habitId: string | null;
  dayNumber?: number; // Optional fallback if calculated or mapped on FE
  status?: string;
  PK?: string;
  SK?: string;
  GSI1_PK?: string;
  GSI1_SK?: string;
}

export interface GoalPlanningResponse {
  id: string;
  title: string;    
  description?: string;
  completedDays: number;
  targetDays: number;
}