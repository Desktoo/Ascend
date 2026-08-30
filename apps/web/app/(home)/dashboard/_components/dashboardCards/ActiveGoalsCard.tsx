// src/components/dashboard/ActiveGoalsCard.tsx
"use client";

import Link from "next/link";
import { AlertCircle, Target } from "lucide-react";
import { useObjective } from "@/core/hooks/useObjective";
// Adjust this import path to match your actual hook location

export default function ActiveGoalsCard() {
  // Fetch data internally instead of relying on props
  const { objectives, isLoading, isError } = useObjective();

  // Define fallback colors to cycle through if the backend doesn't provide them
  const colors = [
    "bg-gradient-to-tr from-[#6366F1] to-[#A855F7]",
    "bg-[#818CF8]",
    "bg-[#6366F1]",
  ];

  // Map the backend data, take only the top 3-4 for the card, and assign colors
  const activeGoals = (objectives || []).slice(0, 3).map((goal, index) => ({
    id: goal.id || index,
    title: goal.title,
    progress: goal.percentage || 0,
    color: colors[index % colors.length],
  }));

  // 1. Loading State (Parent pulse, no internal skeletons)
  if (isLoading) {
    return (
      <div className="w-full min-h-65 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 flex flex-col justify-between animate-pulse">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-5">
          Active Goals
        </h2>
        <div className="flex-1" />
        <div className="w-full text-center text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-6 pt-3 border-t border-slate-200 dark:border-[#222226]">
          Manage Goals
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="w-full min-h-65 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 flex flex-col justify-between transition-colors duration-300">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-5">
          Active Goals
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-8 h-8 text-rose-500/50 mb-3" />
          <p className="text-xs text-rose-400 font-medium">Failed to load goals</p>
          <p className="text-[10px] text-slate-500 mt-1">
            {typeof isError === "string" ? isError : "An unexpected network error occurred"}
          </p>
        </div>
        <Link 
          href="/objectives"
          className="block w-full text-center text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-6 pt-3 border-t border-slate-200 dark:border-[#222226] hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Manage Goals
        </Link>
      </div>
    );
  }

  // 3. Empty State (No Active Goals)
  if (activeGoals.length === 0) {
    return (
      <div className="w-full min-h-65 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 flex flex-col justify-between transition-colors duration-300">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-5">
          Active Goals
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Target className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-3" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">No active goals</p>
          <p className="text-[10px] text-slate-500 mt-1">Start a new objective to track progress.</p>
        </div>
        <Link 
          href="/objectives"
          className="block w-full text-center text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-6 pt-3 border-t border-slate-200 dark:border-[#222226] hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Manage Goals
        </Link>
      </div>
    );
  }

  // 4. Data State
  return (
    <div className="w-full min-h-65 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 flex flex-col justify-between transition-colors duration-300">
      <div>
        <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-5">
          Active Goals
        </h2>
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <div key={goal.id} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate pr-2">
                  {goal.title}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  {goal.progress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-[#0A0A0C] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div
                  className={`h-full ${goal.color} rounded-full transition-all duration-500`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Link 
        href="/objectives"
        className="block w-full text-center text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-6 pt-3 border-t border-slate-200 dark:border-[#222226] hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        Manage Goals
      </Link>
    </div>
  );
}