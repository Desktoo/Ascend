import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import CreateObjectivePage from "./page";
import { SWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { objectiveService } from "@/core/services/objectives/objective.service";

// Mock missing JSDOM PointerEvent and Scroll methods required by Radix UI / shadcn
beforeAll(() => {
  if (typeof window !== "undefined") {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/core/services/objectives/objective.service", () => ({
  objectiveService: {
    createObjective: vi.fn(),
  },
}));

describe("Integration: CreateObjectivePage (Wizard Flow)", () => {
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

  it("blocks transition to Horizon if Identity (Step 1) is invalid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateObjectivePage />);

    // Try to click 'Next' without typing anything
    const nextButtons = screen.getAllByRole("button", { name: /next/i });

    // RHF disables the button physically, proving the validation gatekeeper prevents the slide.
    expect(nextButtons[0]).toBeDisabled();
  });

  it("dynamically renders Monthly Sprints and submits fully merged payload", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateObjectivePage />);

    // --- STEP 1: Identity ---
    const titleInput = screen.getByPlaceholderText(/Build Coding Platform/i);
    await user.type(titleInput, "Launch SaaS Product");

    const nextButtons1 = screen.getAllByRole("button", { name: /next/i });
    expect(nextButtons1[0]).not.toBeDisabled();
    await user.click(nextButtons1[0]); // Go to Step 2

    // --- STEP 2: Horizon ---
    // Change cadence to Monthly
    const monthlyBtn = screen.getByRole("button", { name: /Monthly/i });
    await user.click(monthlyBtn);

    // Verify weekends check disables when 7 days is chosen via Radix Select
    const dropdownTrigger = screen.getByRole("combobox");
    await user.click(dropdownTrigger);

    // Use findByRole because Radix UI Select renders options asynchronously in a portal
    const sevenDaysOption = await screen.findByRole("option", {
      name: /7 days/i,
    });
    await user.click(sevenDaysOption);

    const nextButtons2 = screen.getAllByRole("button", { name: /next/i });
    await user.click(nextButtons2[1]); // Go to Step 3

    // --- STEP 3: Blueprint ---
    // Because we chose "Monthly", we should see Sprint theme inputs
    expect(screen.getByText(/Give each sprint a focus/i)).toBeInTheDocument();

    // Fill all 5 mandatory sprint themes so the form becomes fully valid
    await user.type(
      screen.getByPlaceholderText(/Get the basics down/i),
      "Research phase",
    );
    await user.type(
      screen.getByPlaceholderText(/Build momentum/i),
      "Development",
    );
    await user.type(
      screen.getByPlaceholderText(/Push into the hard part/i),
      "Integration",
    );
    await user.type(
      screen.getByPlaceholderText(/Bring it together/i),
      "Testing",
    );
    await user.type(
      screen.getByPlaceholderText(/Reach your milestone/i),
      "Launch",
    );

    // Fill the mandatory task title so the Activate button unlocks
    const firstTaskInput = screen.getByPlaceholderText(
      /Configure system core matrix/i,
    );
    await user.type(firstTaskInput, "Setup Turborepo");

    vi.mocked(objectiveService.createObjective).mockResolvedValueOnce({
      id: "obj-123",
    } as any);

    const submitBtn = screen.getByRole("button", {
      name: /Activate Objective/i,
    });

    // Ensure it's unlocked and submit
    expect(submitBtn).toBeEnabled();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(objectiveService.createObjective).toHaveBeenCalledWith(
        "/goals",
        expect.objectContaining({
          arg: expect.objectContaining({
            title: "Launch SaaS Product",
            timeframe: "Monthly",
            configuredWorkDaysPerWeek: 7,
            weekendsExcluded: false,
            monthlyWeekThemes: expect.arrayContaining([
              "Research phase",
              "Development",
              "Integration",
              "Testing",
              "Launch",
            ]),
            firstGoalTask: "Setup Turborepo",
          }),
        }),
      );
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
  });

  it("handles server errors gracefully during objective creation", async () => {
    const user = userEvent.setup();
    vi.mocked(objectiveService.createObjective).mockRejectedValueOnce(
      new Error("Validation Failed"),
    );

    renderWithProviders(<CreateObjectivePage />);

    // Identity Step
    await user.type(
      screen.getByPlaceholderText(/Build Coding Platform/i),
      "Failing Goal",
    );
    await user.click(screen.getAllByRole("button", { name: /next/i })[0]);

    // Horizon Step
    await user.click(screen.getAllByRole("button", { name: /next/i })[1]);

    // Blueprint Step
    await user.type(
      screen.getByPlaceholderText(/Configure system core matrix/i),
      "Any task",
    );

    const submitBtn = screen.getByRole("button", {
      name: /Activate Objective/i,
    });
    await user.click(submitBtn);

    // Verify router did NOT push
    await waitFor(() => {
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });
});
