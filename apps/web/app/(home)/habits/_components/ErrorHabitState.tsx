"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorHabitsStateProps {
  onRetry?: () => void;
}

export default function ErrorHabitsState({ onRetry }: ErrorHabitsStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 min-h-87.5 rounded-2xl bg-rose-500/2 dark:bg-rose-500/[0.01] border border-rose-200/60 dark:border-rose-950/30 transition-all duration-300">
      {/* Icon Bracket Layout */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 mb-4 text-rose-500 dark:text-rose-400">
        <AlertCircle className="w-5 h-5" />
      </div>

      {/* Technical Status Copy */}
      <div className="space-y-1.5 max-w-sm mb-6">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-200">
          Sync Execution Failed
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
          Failed to load habit matrices from the data grid. This might be due to an active connection bottleneck.
        </p>
      </div>

      {/* Interactive Retry Trigger */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 transition-all active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reconnect 
        </button>
      )}
    </div>
  );
}