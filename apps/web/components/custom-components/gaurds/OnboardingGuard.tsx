"use client";

import { ReactNode, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useUserProfile from "@/core/hooks/useUserProfile";
import OnboardingPage from "@/app/onboarding/page";

export default function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user, isLoading, isError } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.push("/login");
    }
  }, [isLoading, isError, user, router]);

  // 1. Show a loader while fetching profile
  if (isLoading || (!user && !isError)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

  // 2. If no user or error, show loading while redirecting to login
  if (isError || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

  // 3. Intercept the dashboard! Render Onboarding INSTEAD of the dashboard children
  if (!user.isOnboarded) {
    return <OnboardingPage />;
  }

  // 4. Fully onboarded? Render the dashboard shell normally
  return <>{children}</>;
}