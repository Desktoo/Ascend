import { IsString, MinLength, Matches, NotEquals } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain upper and lower case letters, and numbers or special characters',
  })
  @NotEquals('currentPassword', {
    message: 'New password must be different from current password',
  })
  newPassword!: string;
}
