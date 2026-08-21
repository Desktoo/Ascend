"use client";

import React, { useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CircleX } from "lucide-react";
import {
  ActiveGoalOption,
  GoalTomorrowTaskInput,
  ReflectionFormData,
  ReflectionSubmissionPayload,
} from "./Daily-Reflection.types";
import { ReflectionStep } from "./ReflectionStep";
import { GoalTaskStep } from "./GoalTaskStep";
import useUserProfile from "@/core/hooks/useUserProfile";

interface DailyReflectionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeGoals?: ActiveGoalOption[];
  onSubmitReflection: (payload: ReflectionSubmissionPayload) => Promise<void>;
}

export default function DailyReflectionOverlay({
  isOpen,
  onClose,
  activeGoals = [],
  onSubmitReflection,
}: DailyReflectionOverlayProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Compute lookup dictionary and IDs array from activeGoals prop
  const activeGoalIds = useMemo(
    () => activeGoals.map((g) => g.id),
    [activeGoals]
  );

  const activeGoalsMap = useMemo(
    () =>
      activeGoals.reduce<Record<string, ActiveGoalOption>>((acc, goal) => {
        acc[goal.id] = goal;
        return acc;
      }, {}),
    [activeGoals]
  );

  const { user } = useUserProfile();

  const methods = useForm<ReflectionFormData>({
    defaultValues: {
      reflectionText: "",
      tomorrowTasks: {},
    },
    mode: "onChange",
  });

  if (!isOpen) return null;

  const totalPages = 1 + activeGoalIds.length;
  const isReflectionPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  const currentGoalIndex = currentPageIndex - 1;
  const currentGoalId = activeGoalIds[currentGoalIndex];
  const currentGoal = currentGoalId ? activeGoalsMap[currentGoalId] : undefined;

  const handleNextPage = async () => {
    if (isReflectionPage) {
      const isReflectionValid = await methods.trigger("reflectionText");
      if (!isReflectionValid) return;

      if (activeGoalIds.length === 0) {
        await handleFormSubmit(methods.getValues());
        return;
      }
    } else if (currentGoalId) {
      const isTaskValid = await methods.trigger(
        `tomorrowTasks.${currentGoalId}.taskTitle`
      );
      if (!isTaskValid) return;
    }

    setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = async (data: ReflectionFormData) => {
    try {
      setIsSubmitting(true);

      // Base tomorrow's target date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasksPayload: GoalTomorrowTaskInput[] = Object.entries(
        data.tomorrowTasks || {}
      )
        .filter(([_, task]) => task?.taskTitle?.trim() !== "")
        .map(([goalId, task]) => {
          // Parse "09:00" string from input
          const [hours, minutes] = (task.taskDueTime || "09:00")
            .split(":")
            .map(Number);

          // Combine hours & minutes into tomorrow's date instance
          const dueDateTime = new Date(tomorrow);
          dueDateTime.setHours(hours || 9, minutes || 0, 0, 0);

          return {
            goalId,
            taskTitle: task.taskTitle.trim(),
            taskDueTime: dueDateTime.toISOString(), // 👈 Converts HH:mm to ISO 8601 string
            priority: task.priority || "MEDIUM",
          };
        });

      await onSubmitReflection({
        reflectionText: data.reflectionText.trim(),
        dayStartTime: user?.dayStartTime ?? "",
        tomorrowTasks: tasksPayload,
      });

      onClose();
    } catch (error) {
      console.error("Failed to submit reflection wizard:", error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl text-white grid grid-cols-1 md:grid-cols-12 min-h-125">
          {/* ================= LEFT COLUMN: PROGRESS ================= */}
          <div className="relative md:col-span-4 bg-linear-to-br from-indigo-950/70 via-purple-950/40 to-neutral-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800/80">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 tracking-wide uppercase">
                Step {currentPageIndex + 1} of {totalPages}
              </span>
              {activeGoalIds.length > 0 && (
                <span className="text-xs text-neutral-400 font-medium">
                  {isReflectionPage
                    ? "Daily Review"
                    : `Goal ${currentGoalIndex + 1}/${activeGoalIds.length}`}
                </span>
              )}
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">
                {isReflectionPage ? "🌙" : "🎯"}
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
                {isReflectionPage ? (
                  <>
                    Clear your mind, <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                      reflect on today.
                    </span>
                  </>
                ) : (
                  <>
                    Tomorrow&apos;s Action <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                      {currentGoal?.title || "Goal Action"}
                    </span>
                  </>
                )}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isReflectionPage
                  ? "Acknowledge your efforts, log distractions, and check off completed targets."
                  : "Break big goals into daily micro-tasks. What single action will move the needle tomorrow?"}
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CAROUSEL PAGES ================= */}
          <div className="md:col-span-8 p-6 sm:p-7 flex flex-col justify-between bg-neutral-900/90">
            {/* Header Bar */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isReflectionPage
                    ? "End of Day Reflection"
                    : `Plan Goal: ${currentGoal?.title || "Active Goal"}`}
                </h2>
                <p className="text-xs text-neutral-400">
                  {isReflectionPage
                    ? "Write down your key learnings or mindset today."
                    : `Define tomorrow's task for this goal.`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-white"
              >
                <CircleX className="w-5 h-5" />
              </button>
            </div>

            {/* RHF Form Steps */}
            <form
              onSubmit={methods.handleSubmit(handleFormSubmit)}
              className="flex-1 flex flex-col justify-between"
            >
              {isReflectionPage && <ReflectionStep />}

              {!isReflectionPage && currentGoalId && (
                <GoalTaskStep
                  key={currentGoalId}
                  goalId={currentGoalId}
                  goalTitle={currentGoal?.title}
                  completedDays={currentGoal?.completedDays}
                  targetDays={currentGoal?.targetDays}
                />
              )}

              {/* Footer Controls */}
              <div className="pt-4 flex items-center justify-between border-t border-neutral-800/80 mt-4">
                <div>
                  {!isReflectionPage && (
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      className="px-3.5 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  {isReflectionPage ? (
                    <button
                      type="button"
                      onClick={
                        activeGoalIds.length > 0
                          ? handleNextPage
                          : methods.handleSubmit(handleFormSubmit)
                      }
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                    >
                      {activeGoalIds.length > 0
                        ? "Plan for Tomorrow →"
                        : "Submit Reflection"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={
                        isLastPage
                          ? methods.handleSubmit(handleFormSubmit)
                          : handleNextPage
                      }
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : isLastPage
                        ? "Finish & Submit"
                        : "Next Goal →"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}