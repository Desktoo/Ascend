"use client";

import React from "react";
import { ClipboardList, AlertCircle } from "lucide-react";

interface HabitsTableFallbackProps {
  isError?: boolean;
}

export default function HabitsTableFallback({ isError = false }: HabitsTableFallbackProps) {
  return (
    <div className="flex flex-col h-52 items-center justify-center p-6 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#0A0A0C]/30 text-center space-y-2.5 w-full">
      {/* Icon Selector based on status */}
      <div className={`p-2.5 rounded-xl ${
        isError 
          ? "bg-rose-500/10 text-rose-500 dark:text-rose-400" 
          : "bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-slate-500"
      }`}>
        {isError ? <AlertCircle className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
      </div>

      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {isError ? "Failed to load habits" : "No habits scheduled"}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[220px] mx-auto leading-normal">
          {isError 
            ? "Something went wrong on our end. Please try refreshing." 
            : "Enjoy your free track or configure new routines."}
        </p>
      </div>
    </div>
  );
}