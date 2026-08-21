import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTimeZoneDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  timeZone!: string;
}
