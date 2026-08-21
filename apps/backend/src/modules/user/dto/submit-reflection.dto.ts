import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PriorityLevel } from '@day-mark/db';

export class TomorrowTaskDto {
  @IsString()
  @IsNotEmpty()
  goalId!: string;

  @IsString()
  @IsNotEmpty()
  taskTitle!: string;

  @IsEnum(PriorityLevel)
  priority!: PriorityLevel;

  @IsString()
  @IsOptional()
  scheduledDate?: string;

  @IsDateString()
  @IsOptional()
  taskDueTime?: string;
}

export class SubmitSelfReflectionDto {
  @IsString()
  @IsNotEmpty()
  reflectionText!: string;

  @IsString()
  @IsNotEmpty()
  dayStartTime!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TomorrowTaskDto)
  @IsOptional()
  tomorrowTasks?: TomorrowTaskDto[];

  @IsString()
  @IsNotEmpty()
  timeZone!: string;
}
