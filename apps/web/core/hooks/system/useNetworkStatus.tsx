"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff, X } from "lucide-react";

export interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== "undefined" && "navigator" in window) {
      return navigator.onLine;
    }
    return true;
  });

  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);

      toast.custom(
        (t) => (
          <div className="relative group overflow-hidden flex items-center justify-between gap-4 px-4 py-3 min-w-[320px] max-w-md rounded-2xl bg-neutral-900/95 border border-emerald-500/20 backdrop-blur-2xl text-white shadow-2xl shadow-emerald-950/30 transition-all duration-300">
            {/* Ambient Inner Glow */}
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Wifi className="w-4 h-4 animate-pulse" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wide text-emerald-300">
                    Connection Restored
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">
                  You are back online. Syncing changes...
                </span>
              </div>
            </div>

            {/* Manual Dismiss Button */}
            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="z-10 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
              aria-label="Close toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        { id: "network-status", duration: 4000 }
      );
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);

      toast.custom(
        (t) => (
          <div className="relative group overflow-hidden flex items-center justify-between gap-4 px-4 py-3 min-w-[320px] max-w-md rounded-2xl bg-neutral-900/95 border border-rose-500/25 backdrop-blur-2xl text-white shadow-2xl shadow-rose-950/30 transition-all duration-300">
            {/* Ambient Inner Glow */}
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-rose-500/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <WifiOff className="w-4 h-4 animate-bounce" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wide text-rose-300">
                    You Are Offline
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Operating in offline mode.
                </span>
              </div>
            </div>

            {/* Manual Dismiss Button */}
            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="z-10 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
              aria-label="Close toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        { id: "network-status", duration: Infinity }
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}