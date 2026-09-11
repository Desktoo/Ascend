import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginCard from "./LoginCard";
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

describe("Integration: LoginCard (Auth Category)", () => {
  let mockRouterPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterPush = vi.fn();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it("triggers silent DB warming on first keystroke", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient).mockResolvedValueOnce({ message: "warmed" } as any);

    render(<LoginCard />);

    const identifierInput = screen.getByPlaceholderText(/email or username/i);
    await user.type(identifierInput, "abc"); // First keystroke

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/health/warm",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  it("validates empty inputs using native HTML5 required attributes", async () => {
    const user = userEvent.setup();
    render(<LoginCard />);

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitBtn);

    // Because of native HTML5 'required', apiClient should NOT be called if fields are empty
    expect(apiClient).not.toHaveBeenCalledWith(
      "/auth/login",
      expect.anything(),
    );
  });

  it("handles invalid credentials and renders toast error", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient).mockImplementation(async (url) => {
      if (url === "/auth/login") {
        throw new Error("Invalid credentials");
      }
      return { message: "warmed" };
    });

    render(<LoginCard />);

    await user.type(
      screen.getByPlaceholderText(/email or username/i),
      "wronguser",
    );
    await user.type(screen.getByPlaceholderText(/password/i), "wrongpass");

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid credentials"),
      );
    });

    // Ensure we do not navigate
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("handles successful submission, shows loading state, and routes to dashboard", async () => {
    const user = userEvent.setup();

    // Create a delayed promise to test the loading state
    let resolveApi: (value: any) => void;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    vi.mocked(apiClient)
    .mockResolvedValueOnce({ message: 'warmed' })
    .mockReturnValueOnce(apiPromise as any);

    render(<LoginCard />);

    await user.type(
      screen.getByPlaceholderText(/email or username/i),
      "validuser",
    );
    await user.type(screen.getByPlaceholderText(/password/i), "validpass123");

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitBtn);

    // Resolve the API call
    resolveApi!({ message: "success" });

    // Assert successful completion
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            identifier: "validuser",
            password: "validpass123",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Welcome back to Ascend!");
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
