import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PriorityLevel } from '@day-mark/db';
import { Type } from 'class-transformer';

// Explicitly declare an execution enum for task types to enforce clean boundary layers
export enum TaskType {
  STANDARD = 'Standard',
  HABIT_TASK = 'HabitTask',
  GOAL_TASK = 'GoalTask',
}

export class TaskDTO {
  @IsString()
  title!: string;

  @IsEnum(PriorityLevel)
  priority!: PriorityLevel;

  @IsString()
  @IsOptional()
  scheduledDate!: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueTime?: Date;

  @IsEnum(TaskType)
  @IsOptional()
  type?: 'Standard' | 'HabitTask' | 'GoalTask';

  @IsString()
  @IsUUID()
  @IsOptional()
  habitId?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  goalId?: string;
}
