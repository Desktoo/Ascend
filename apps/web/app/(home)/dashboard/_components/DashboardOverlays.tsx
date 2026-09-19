"use client";

import React, { useState, useRef, useEffect } from "react";
import AbandonedTasksOverlay from "@/app/(home)/dashboard/_components/overlays/abandonedTasksOverlay";
import CreateTaskOverlay from "@/app/(home)/dashboard/_components/overlays/CreateTaskOverlay";
import DailyReflectionOverlay from "@/app/(home)/dashboard/_components/overlays/DailyReflectionOverlay/DailyReflectionOverlay";
import useDashboardTasks from "@/core/hooks/useDashboardTasks";
import useUserProfile from "@/core/hooks/useUserProfile";
import RankUnlockAnimation from "./animations/RankUnlockAnimation";
import {
  ActiveGoalOption,
  ReflectionSubmissionPayload,
  SelfReflectionResponse,
} from "./overlays/DailyReflectionOverlay/Daily-Reflection.types";
import { useObjectiveNewTasks } from "@/core/hooks/useObjective";
import { submitSelfReflection } from "@/core/services/user/self-reflection";
import NotificationOverlay from "./overlays/NotificationOverlay";
import { toast } from "sonner";

export type ActiveModalType = "TASK" | "GOAL" | "HABIT" | "REFLECTION" | null;

interface DashboardOverlaysProps {
  activeModal: ActiveModalType;
  onCloseModal: () => void;
  onSubmitReflection?: (
    payload: ReflectionSubmissionPayload
  ) => Promise<SelfReflectionResponse | void>;
}

export default function DashboardOverlays({
  activeModal,
  onCloseModal,
  onSubmitReflection,
}: DashboardOverlaysProps) {
  const {
    todayTasks,
    dashboardUrl,
    abandonedTasks,
    handleRescue,
    handlePurge,
  } = useDashboardTasks();

 

  const { user, mutate: mutateUserProfile } = useUserProfile();
  const { objectives } = useObjectiveNewTasks();

  const [oldRankTitle, setOldRankTitle] = useState<string>("");
  const [activeUnlockTitle, setActiveUnlockTitle] = useState<string>("");

  const acknowlegeRankRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (acknowlegeRankRef.current === null) {
      acknowlegeRankRef.current = user.rank;
      return;
    }

    if (user.rank !== acknowlegeRankRef.current) {
      setOldRankTitle(acknowlegeRankRef.current);
      setActiveUnlockTitle(user.rank);
      acknowlegeRankRef.current = user.rank;
    }
  }, [user?.rank]);

  const isUnlockAnimationTriggered = activeUnlockTitle !== "";

  // 🎯 Handles sending self reflection & goal tasks to backend
  const handleReflectionSubmit = async (
    payload: ReflectionSubmissionPayload
  ): Promise<void> => {
    try {
      if (onSubmitReflection) {
        await onSubmitReflection(payload);
      } else {
        const timeZone =
          user?.timeZone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone;

        await submitSelfReflection({
          ...payload,
          timeZone,
        });
      }

      // Revalidate user profile so `hasSubmittedReflectionToday` updates immediately
      await mutateUserProfile();
      onCloseModal();
    } catch (error) {
      console.error("Failed to submit daily self reflection:", error);
      toast.error("Failed to submit daily self reflection. Please try again.");
    }
  };

  // Map objectives safely to ActiveGoalOption array structure
  const activeGoals: ActiveGoalOption[] = (objectives || []).map((goal) => ({
    id: goal.id,
    title: goal.title,
    description: goal.description,
    completedDays: goal.completedDays ?? 0,
    targetDays: goal.targetDays ?? 1,
  }));

  return (
    <>
      <RankUnlockAnimation
        isTriggered={isUnlockAnimationTriggered}
        oldRank={oldRankTitle}
        newRank={activeUnlockTitle}
        onAnimationComplete={() => {
          setActiveUnlockTitle("");
        }}
      />

      {abandonedTasks.length > 0 && (
        <AbandonedTasksOverlay
          tasks={abandonedTasks}
          onRescue={handleRescue}
          onPurge={handlePurge}
        />
      )}

      <CreateTaskOverlay
        isOpen={activeModal === "TASK"}
        onClose={onCloseModal}
        todaysTasks={todayTasks}
        dashboardUrl={dashboardUrl}
        abandonedTasks={abandonedTasks}
      />

      {/* Daily Self-Reflection Overlay */}
      <DailyReflectionOverlay
        isOpen={activeModal === "REFLECTION"}
        onClose={onCloseModal}
        activeGoals={activeGoals}
        onSubmitReflection={handleReflectionSubmit}
      />

      <NotificationOverlay />
    </>
  );
}