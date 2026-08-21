"use client";

import React from "react";

export default function TaskTableSkeleton() {
  return (
    <div className="w-full lg:col-span-2 h-[380px] bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 flex flex-col overflow-hidden transition-colors duration-300">
      
      {/* ── Fixed Static Header Section (Kept alive, not skeletal) ── */}
      <div className="flex items-center justify-between mb-4 select-none shrink-0">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-[#A855F7]" />
          Today&apos;s Priorities
        </h2>

        {/* Disabled sorting container mockup */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60">
          <div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />
          <div className="w-14 h-3 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </div>

      {/* ── Pure Task Rows Skeletons Container ── */}
      <div className="flex-1 overflow-hidden space-y-2">
        {/* Render 3 structured task mockup nodes to comfortably populate the 380px view container */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex items-center justify-between px-3 py-3 border border-slate-200 dark:border-[#222226] bg-slate-50 dark:bg-[#0A0A0C] rounded-lg"
          >
            {/* Left Hand: Checkbox ring & Title metadata lines */}
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
              {/* Circular Checkbox mock indicator node */}
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 animate-pulse" />

              {/* Dynamic width row lines map for titles and subtext stamps */}
              <div className="flex flex-col gap-2 flex-1">
                {/* Simulated task title length segment */}
                <div 
                  className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" 
                  style={{ width: index === 1 ? '35%' : index === 2 ? '50%' : '25%' }}
                />
                {/* Simulated time marker segment */}
                <div className="w-12 h-2 bg-slate-200/60 dark:bg-slate-800/50 rounded animate-pulse" />
              </div>
            </div>

            {/* Right Hand: Priority Badge layout simulation block */}
            <div className="w-10 h-2.5 bg-slate-200 dark:bg-slate-800 rounded shrink-0 animate-pulse" />
          </div>
        ))}
      </div>

    </div>
  );
}