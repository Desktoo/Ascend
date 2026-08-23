"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import useUserProfile from "@/core/hooks/useUserProfile";
import OnboardingPage from "@/app/onboarding/page"; // Import your page directly

export default function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user, isLoading, isError } = useUserProfile();

  // 1. Show a loader while fetching from Redis

  console.log("user details", user)
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

  // 2. If no user, let middleware or the layout handle the login redirect
  if (isError || !user) {
    return null; 
  }

  // 3. Intercept the dashboard! Render Onboarding INSTEAD of the dashboard children
  if (!user.isOnboarded) {
    return <OnboardingPage />;
  }

  // 4. Fully onboarded? Render the dashboard shell normally
  return <>{children}</>;
}