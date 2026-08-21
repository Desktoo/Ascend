export type HorizonType = "Weekly" | "Monthly";

export interface CreateObjectiveFormState {
  title: string;
  description: string;
  rewardText: string;
  timeframe: HorizonType;
  weekendsExcluded: boolean;
  firstGoalTask: string;
  goalTaskPriority: "HIGH" | "MEDIUM" | "LOW";
  goalTaskDueTime: string;
  configuredWorkDaysPerWeek: number;
  dayStartTime: string;
  startDate: string;
  monthlyWeekThemes: string[];
  initialTodayTask: string;
  initialTomorrowTask: string;
}

export interface StepProps {
  formData: CreateObjectiveFormState;
  updateField: (key: keyof CreateObjectiveFormState, value: any) => void;
}