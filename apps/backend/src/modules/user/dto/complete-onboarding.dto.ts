import { IsString, Matches } from 'class-validator';

export class CompleteOnboardingDto {
  @IsString()
  userName!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'dayStartTime must be in HH:mm format (e.g. 09:00)',
  })
  dayStartTime!: string;
}
