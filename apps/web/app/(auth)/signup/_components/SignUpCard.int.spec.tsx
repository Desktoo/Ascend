import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignUpCard from "./SignUpCard";
import { useRouter } from "next/navigation";
import { apiClient } from "@/core/services/client";
import { toast } from "sonner";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/core/services/client", () => ({
  apiClient: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Integration: SignUpCard (Auth Category)", () => {
  let mockRouterPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterPush = vi.fn();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it("prevents submission on empty required fields", async () => {
    const user = userEvent.setup();
    render(<SignUpCard />);

    const submitBtn = screen.getByRole("button", { name: /create account/i });
    await user.click(submitBtn);

    expect(apiClient).not.toHaveBeenCalledWith(
      "/auth/signup",
      expect.anything(),
    );
  });

  it("shows password in plain text when toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<SignUpCard />);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // Assuming the toggle button has no accessible text, we might need to query by role or just generic button if it's the only icon button.
    // In SignUpCard.tsx it's an absolute button inside the relative div.
    // Let's find it by looking for the closest button to the password input, or just the 3rd button.
    const buttons = screen.getAllByRole("button");
    const toggleButton = buttons[0]; // Assuming it's the first button in the form

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("submits payload with correctly appended timeZone and routes to onboarding", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient).mockResolvedValue({ message: "success" } as any);

    render(<SignUpCard />);

    await user.type(screen.getByPlaceholderText(/username/i), "newuser123");
    await user.type(
      screen.getByPlaceholderText(/email address/i),
      "test@example.com",
    );
    await user.type(screen.getByPlaceholderText(/password/i), "SecurePass!23");

    const submitBtn = screen.getByRole("button", { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/auth/signup",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("newuser123"),
        }),
      );
    });

    // Find the specific call made to the signup endpoint to ignore the DB warming ping
    const signupCall = vi.mocked(apiClient).mock.calls.find(call => call[0] === '/auth/signup');
    const callArgs = signupCall![1];
    const payload = JSON.parse(callArgs!.body as string);
    expect(payload.timeZone).toBeDefined();
    expect(payload.email).toBe("test@example.com");

    expect(toast.success).toHaveBeenCalledWith("Account created successfully!");
    expect(mockRouterPush).toHaveBeenCalledWith("/onboarding");
  });

  it("handles server errors gracefully during registration", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient).mockImplementation(async (url: string) => {
      if (url === "/auth/signup") throw new Error("Email already in use");
      return { message: "ok" };
    });

    render(<SignUpCard />);

    await user.type(screen.getByPlaceholderText(/username/i), "existinguser");
    await user.type(
      screen.getByPlaceholderText(/email address/i),
      "exist@example.com",
    );
    await user.type(screen.getByPlaceholderText(/password/i), "SecurePass!23");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create the user");
    });

    // Ensure we do not navigate
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
