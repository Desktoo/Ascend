"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

interface ErrorStateProps {
  onRetry?: () => void;
}

export default function ObjectivesErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex w-full min-h-[50vh] items-center justify-center py-8">
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#1B1015] via-[#100D0E] to-[#0B0809] p-8 text-center shadow-2xl">
        {/* Warning Badge Container */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <AlertCircle className="h-6 w-6" />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white tracking-wide" style={display}>
          Sync Failed
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-xs">
          Unable to retrieve active objective blueprints from the server. Check your connection or retry.
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-500/20 hover:text-white active:scale-95 cursor-pointer"
            style={mono}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
}