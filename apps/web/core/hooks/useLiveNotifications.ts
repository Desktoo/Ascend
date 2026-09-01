// src/core/hooks/useLiveNotifications.ts
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSWRConfig } from "swr";
import { toast } from "sonner"; 

export function useLiveNotifications(userId?: string) {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!userId) return;

    // Connect to your NestJS backend
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("🟢 WebSocket connected:", socket.id);
    });

    socket.on("NEW_NOTIFICATION", (payload) => {
      console.log("🔔 Live Notification received:", payload);
      
      // 1. Pop the live UI toast on the screen
      toast.success(payload.title, {
        description: payload.body,
        duration: 5000,
      });

      // 2. Silently fetch the latest MongoDB data to update the bell icon's red dot
      mutate("/notifications");
    });

    return () => {
      socket.off("connect");
      socket.off("NEW_NOTIFICATION");
      socket.disconnect();
    };
  }, [userId, mutate]);
}