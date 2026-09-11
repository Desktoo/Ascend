import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OnboardingPage from './page';
import { useRouter } from 'next/navigation';
import { OnboardingService } from '@/core/services/user/onboarding.service';
import useUserProfile from '@/core/hooks/useUserProfile';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/core/services/user/onboarding.service', () => ({
  OnboardingService: {
    completeOnboarding: vi.fn(),
  },
}));

vi.mock('@/core/hooks/useUserProfile', () => ({
  default: vi.fn(),
}));

describe('Integration: OnboardingPage (Long-Form Pages)', () => {
  let mockRouterPush: ReturnType<typeof vi.fn>;
  let mockMutate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterPush = vi.fn();
    mockMutate = vi.fn();

    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockRouterPush,
    });

    vi.mocked(useUserProfile).mockReturnValue({
      user: { userName: 'initial_user', isOnboarded: false },
      mutate: mockMutate,
    } as any);
  });

  it('displays Zod validation errors on empty submission', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    // Clear the prepopulated username to trigger Zod min(1) validation
    const usernameInput = screen.getByPlaceholderText(/e.g. alex_dev/i);
    await user.clear(usernameInput);

    const submitBtn = screen.getByRole('button', { name: /complete setup/i });
    await user.click(submitBtn);

    // Assert Zod error message renders
    expect(await screen.findByText('Please enter a username')).toBeInTheDocument();
    expect(OnboardingService.completeOnboarding).not.toHaveBeenCalled();
  });

  it('submits valid data, mutates cache, and routes to dashboard', async () => {
    const user = userEvent.setup();
    vi.mocked(OnboardingService.completeOnboarding).mockResolvedValueOnce({} as any);

    render(<OnboardingPage />);

    const usernameInput = screen.getByPlaceholderText(/e.g. alex_dev/i);
    await user.clear(usernameInput);
    await user.type(usernameInput, 'alex_dev_updated');

    const submitBtn = screen.getByRole('button', { name: /complete setup/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(OnboardingService.completeOnboarding).toHaveBeenCalledWith({
        userName: 'alex_dev_updated',
        dayStartTime: '09:00', // Default value
      });
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ userName: 'initial_user', isOnboarded: true }),
      { revalidate: true }
    );
    expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
  });

  it('gracefully handles 500 server errors', async () => {
    const user = userEvent.setup();
    vi.mocked(OnboardingService.completeOnboarding).mockRejectedValueOnce(new Error('Network Error 500'));

    render(<OnboardingPage />);

    const submitBtn = screen.getByRole('button', { name: /complete setup/i });
    await user.click(submitBtn);

    expect(await screen.findByText('Network Error 500')).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
