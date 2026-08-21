"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseLastActiveProps {
  onPingActive?: (lastActiveDate: Date) => Promise<void> | void;
  pingIntervalMs?: number; // Minimum gap between backend pings (default 3 mins)
}

export function useLastActive({
  onPingActive,
  pingIntervalMs = 3 * 60 * 1000, // 3 Minutes
}: UseLastActiveProps = {}) {
  // Lazy state initialization prevents calling new Date() during impure render evaluation
  const [lastActiveAt, setLastActiveAt] = useState<Date>(() => new Date());

  // Initialize ref with 0 instead of calling Date.now() during render phase
  const lastPingRef = useRef<number>(0);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    const currentActiveDate = new Date(now);
    setLastActiveAt(currentActiveDate);

    // If first activity or interval has elapsed, trigger ping
    if (lastPingRef.current === 0 || now - lastPingRef.current >= pingIntervalMs) {
      lastPingRef.current = now;
      if (onPingActive) {
        onPingActive(currentActiveDate);
      }
    }
  }, [pingIntervalMs, onPingActive]);

  useEffect(() => {
    // Set baseline timestamp on client mount safely
    if (lastPingRef.current === 0) {
      lastPingRef.current = Date.now();
    }

    const handleEventListener = () => {
      if (document.visibilityState === "visible") {
        handleActivity();
      }
    };

    // 1. Window events
    const windowEvents: Array<keyof WindowEventMap> = ["focus", "click", "keydown"];
    windowEvents.forEach((evt) => window.addEventListener(evt, handleEventListener));

    // 2. Document events (visibilitychange lives on Document)
    const documentEvents: Array<keyof DocumentEventMap> = ["visibilitychange"];
    documentEvents.forEach((evt) => document.addEventListener(evt, handleEventListener));

    return () => {
      windowEvents.forEach((evt) => window.removeEventListener(evt, handleEventListener));
      documentEvents.forEach((evt) => document.removeEventListener(evt, handleEventListener));
    };
  }, [handleActivity]);

  return { lastActiveAt, triggerActivityCheck: handleActivity };
}