export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  avatar_url: string | null;
  rank: string;
  dayStartTime: string;
  level: number;
  hasSubmittedReflectionToday: boolean;
  haspassword: boolean;
  timeZone: string;
  xp: number;
}

export interface ProfileFormValues {
  userName: string;
  email: string;
  dayStartTime: string;
}

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}