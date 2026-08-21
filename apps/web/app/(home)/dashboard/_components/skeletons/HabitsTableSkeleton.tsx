"use client";

import React from "react";

export default function HabitsTableSkeleton() {
  return (
    <div className="space-y-2 animate-pulse w-full h-full">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50 dark:bg-[#0A0A0C] h-[46px]"
        >
          {/* Title & Checkbox Area */}
          <div className="flex items-center gap-3 w-1/3">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-800 shrink-0" />
            <div className="h-3 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
          </div>
          
          {/* Metadata Area */}
          <div className="flex items-center gap-3 w-1/4 justify-end">
            <div className="h-4 w-12 bg-slate-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-4 w-8 bg-slate-200 dark:bg-zinc-800 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}