import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateHabitPage from "./page";
import { SWRConfig } from "swr";
import { useRouter } from "next/navigation";
import '@testing-library/jest-dom/vitest';
import { habitService } from "@/core/services/habits/habits.service";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/core/services/habits/habits.service", () => ({
  habitService: {
    createHabit: vi.fn(),
  },
}));

describe("Integration: CreateHabitPage (Long-Form Pages)", () => {
  let mockRouterPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterPush = vi.fn();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockRouterPush,
      back: vi.fn(),
    });
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {ui}
      </SWRConfig>,
    );
  };

  it('blocks transition if Step 1 is invalid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateHabitPage />);

    const nextButtons = screen.getAllByRole('button', { name: /next/i });
    await user.click(nextButtons[0]); // Step 1 Next Button

    // Because fields are invalid, the button should remain disabled
    expect(screen.getByRole('button', { name: /next parameters/i })).toBeDisabled();
  });

  it('progresses through steps, retains state on back navigation, and submits payload', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateHabitPage />);

    // --- STEP 1 ---
    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test Habit Payload');
    
    const nextButtons1 = screen.getAllByRole('button', { name: /next/i });
    await user.click(nextButtons1[0]); // Step 1 Next Button

    // --- STEP 2 ---
    // User clicks "Back" to test state retention
    const backBtn = screen.getByRole('button', { name: /back to step 1/i });
    await user.click(backBtn);
    
    // Assert value is retained
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Test Habit Payload');

    // Go to Step 2 again
    const nextButtons2 = screen.getAllByRole('button', { name: /next/i });
    await user.click(nextButtons2[0]);

    // Fill out required fields in Step 2 
    const categoryBtn = screen.getByRole('button', { name: /lifestyle & order/i });
    await user.click(categoryBtn);
    
    const everydayBtn = screen.getByRole('button', { name: /every day/i });
    await user.click(everydayBtn);

    // Mock SWR mutation to immediately resolve
    vi.mocked(habitService.createHabit).mockResolvedValueOnce({} as any);

    // Proceed to Step 3
    const nextButtons3 = screen.getAllByRole('button', { name: /next/i });
    await user.click(nextButtons3[1]); // Step 2 Next Button

    // --- STEP 3 ---
    // Fill out required fields in Step 3
    const taskInput = screen.getByPlaceholderText("e.g., Read for 20 minutes");
    await user.type(taskInput, 'Daily reading task');

    const priorityBtn = screen.getByRole('button', { name: /high/i });
    await user.click(priorityBtn);

    // Submit the form
    const submitBtn = screen.getByRole('button', { name: /create habit/i });
    
    // The button should now be fully enabled
    expect(submitBtn).toBeEnabled();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(habitService.createHabit).toHaveBeenCalledWith(
        "/habits/create",
        expect.objectContaining({
          arg: expect.objectContaining({
            title: "Test Habit Payload",
          }),
        }),
      );
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
  });
});