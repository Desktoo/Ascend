import { apiClient } from '@/core/services/client';

export interface CompleteOnboardingData {
  userName: string;
  dayStartTime: string;
}

export const OnboardingService = {
  async completeOnboarding(data: CompleteOnboardingData) {
    return await apiClient('/user/onboarding', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};