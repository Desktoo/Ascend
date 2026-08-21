import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsArray,
  IsDateString,
} from 'class-validator';

export enum HorizonType {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export enum GoalTaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  rewardText?: string;

  @IsEnum(HorizonType)
  timeframe!: HorizonType;

  @IsBoolean()
  weekendsExcluded!: boolean;

  @IsInt()
  @Min(5)
  @Max(7)
  configuredWorkDaysPerWeek!: number;

  @IsDateString()
  startDate!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  monthlyWeekThemes?: string[];

  @IsString()
  @IsNotEmpty()
  firstGoalTask!: string;

  @IsString()
  @IsNotEmpty()
  goalTaskDueTime!: string;

  @IsEnum(GoalTaskPriority)
  goalTaskPriority!: 'HIGH' | 'MEDIUM' | 'LOW';
}
