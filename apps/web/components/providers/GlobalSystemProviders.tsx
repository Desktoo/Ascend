"use client";

import React from "react";
import { useNetworkStatus } from "@/core/hooks/system/useNetworkStatus";
import { useLastActive } from "@/core/hooks/system/useLastActive";
import { pingUserActive } from "@/core/services/user/user-activity";

export default function GlobalSystemProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Mount network status tracking (Sonner toasts automatically handle online/offline)
  useNetworkStatus();

  // 2. Mount last active tracking (pings backend every 5 minutes when user is active)
  useLastActive({
    pingIntervalMs: 5 * 60 * 1000, // 5 Minutes
    onPingActive: async () => {
      try {
        await pingUserActive();
      } catch (err) {
        // Silently swallow background network failures to keep UX smooth
        console.warn("Background activity ping failed:", err);
      }
    },
  });

  return <>{children}</>;
}