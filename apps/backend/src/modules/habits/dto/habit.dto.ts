import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PriorityLevel } from '@day-mark/db';

export class HabitDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  selectedDays!: string[];

  @IsString()
  @IsNotEmpty()
  selectedTag!: string;

  @IsString()
  @IsNotEmpty()
  taskTitle!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'dueTime must be in valid HH:MM format',
  })
  dueTime!: string;

  @IsEnum(PriorityLevel)
  priority!: PriorityLevel;
}
