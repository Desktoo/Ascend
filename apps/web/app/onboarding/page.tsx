"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { OnboardingService } from "@/core/services/user/onboarding.service";
import BgWrapper from "@/components/custom-components/backgrounds/BgWrapper";
import useUserProfile from "@/core/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// 1. Define the Zod validation schema
const onboardingSchema = z.object({
  userName: z.string().min(1, "Please enter a username"),
  dayStartTime: z.string().min(1, "Start time is required"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  // Extract user and the revalidation function (mutate/refetch) from your hook
  const { user, mutate } = useUserProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    values: {
      userName: user?.userName ?? "",
      dayStartTime: "09:00",
    },
  });

  // 3. Handle Form Submission
  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      await OnboardingService.completeOnboarding({
        userName: data.userName.trim(),
        dayStartTime: data.dayStartTime,
      });

      // 🎯 Revalidate the profile cache. 
      // This tells the OnboardingGuard to immediately swap this view for the Dashboard.
      if (mutate && user) {
        await mutate(
          { ...user, isOnboarded: true }, 
          { revalidate: true }
        );
      }
      router.push("/dashboard");
    } catch (error) {
      // Set an API error to the form's root error state
      console.error("Onboarding API error:", error);
      toast.error("Failed to complete onboarding. Please try again.");
    }
  };

  // Consolidate validation and API errors for the top-level error box
  const displayError = errors.root?.message || errors.userName?.message || errors.dayStartTime?.message;

  return (
    <BgWrapper>
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        
        {/* RIGHT COLUMN: ONBOARDING FORM */}
        <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center bg-transparent">
          <div className="max-w-sm w-full mx-auto space-y-6">
            <div>
              <h1 className="text-lg font-semibold text-white">
                Welcome to DayMark
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Let&apos;s set up your profile to personalize your experience.
              </p>
            </div>

            {/* Error Display */}
            {displayError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 flex items-center gap-2">
                  Username
                </label>
                <input
                  type="text"
                  style={{ outline: "none" }}
                  placeholder="e.g. alex_dev"
                  {...register("userName")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Day Start Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 flex items-center gap-2">
                  When does your day start?
                </label>
                <input
                  type="time"
                  style={{ outline: "none" }}
                  {...register("dayStartTime")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all scheme-dark"
                />
                <p className="text-[10px] text-gray-500">
                  Used to calculate daily streaks and habit resets.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/50 text-black/95 font-bold py-2 px-4 rounded-lg text-xs transition-colors disabled:opacity-50 mt-6 shadow-md shadow-purple-900/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Complete Setup"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </BgWrapper>
  );
}