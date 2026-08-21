"use client";

import React from "react";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function EmptyHabitsState() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 min-h-[400px] rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] relative overflow-hidden transition-all duration-300 shadow-sm">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 w-72 h-72 bg-[#818CF8]/10 dark:bg-[#818CF8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Icon Container */}
      <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 mb-5 text-[#818CF8] shadow-inner">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>

      {/* Content Text Strings */}
      <div className="space-y-2 max-w-sm mb-6">
        <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
          No habits initiated yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          Your control grid is blank. Start tracking consistency loops to unlock insights and level up your execution metrics.
        </p>
      </div>

      {/* Call to Action Button */}
      <Link href="/habits/create" passHref>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide rounded-xl bg-[#818CF8] hover:bg-[#818CF8]/90 text-white shadow-md shadow-[#818CF8]/10 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Initialize First Habit
        </button>
      </Link>
    </div>
  );
}