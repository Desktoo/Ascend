import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @IsOptional()
  @IsBoolean()
  masterNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  webPushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  midDayReminder?: boolean;
}
