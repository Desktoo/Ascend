"use client";

import { useEffect, useCallback, useRef } from "react";
import useUserProfile from "@/core/hooks/useUserProfile";
import { useLastActive } from "@/core/hooks/system/useLastActive";

interface UseReflectionTriggerProps {
  onTriggerReflection: () => void;
  thresholdHours?: number; // Defaults to 12 hours
}

export default function useReflectionTrigger({
  onTriggerReflection,
  thresholdHours = 12,
}: UseReflectionTriggerProps) {
  const { user, isLoading } = useUserProfile();

  // Track if the modal was already triggered during this active session/mount
  const hasTriggeredThisSessionRef = useRef<boolean>(false);

  // 🎯 Pure evaluation logic
  const evaluateTimeAndTrigger = useCallback(() => {
    // 1. Guard check: do not trigger if loading, missing data, submitted, or already shown
    if (
      isLoading ||
      !user ||
      user.hasSubmittedReflectionToday ||
      !user.dayStartTime ||
      hasTriggeredThisSessionRef.current
    ) {
      return;
    }

    const [startHours, startMinutes] = user.dayStartTime
      .split(":")
      .map(Number);
    const now = new Date();

    // 2. Calculate current logical day start
    const startOfCurrentDay = new Date();
    startOfCurrentDay.setHours(startHours || 0, startMinutes || 0, 0, 0);

    // If local time is before start time (e.g. 2 AM local, start is 5 AM), shift back 1 day
    if (now < startOfCurrentDay) {
      startOfCurrentDay.setDate(startOfCurrentDay.getDate() - 1);
    }

    // 3. Compute elapsed active hours
    const elapsedMs = now.getTime() - startOfCurrentDay.getTime();
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    // 4. Trigger modal if threshold reached
    if (elapsedHours >= thresholdHours) {
      hasTriggeredThisSessionRef.current = true;
      onTriggerReflection();
    }
  }, [user, isLoading, thresholdHours, onTriggerReflection]);

  // 📡 Listen to system-level activity triggers instead of adding raw window listeners
  const { lastActiveAt } = useLastActive();

  // Re-evaluate whenever user activity/tab refocus occurs or profile data updates
  useEffect(() => {
    evaluateTimeAndTrigger();
  }, [lastActiveAt, evaluateTimeAndTrigger]);
}