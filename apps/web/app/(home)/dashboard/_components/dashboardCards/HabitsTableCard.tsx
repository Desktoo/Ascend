"use client";

import { useHabits } from "@/core/hooks/useHabits";
import { CheckCircle2, Circle, Flame } from "lucide-react";
import HabitsTableSkeleton from "../skeletons/HabitsTableSkeleton";
import HabitsTableFallback from "../fallbacks/HabitsCardFallback";

export default function HabitsTableCard() {
  const { habits, isLoading, isError } = useHabits();

  return (
    <div className="bg-white h-full dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 transition-colors duration-300">
      <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
        Today&apos;s Habits
      </h2>

      {isLoading && <HabitsTableSkeleton />}

      {!isLoading && (isError || habits.length === 0) && (
        <HabitsTableFallback isError={!!isError} />
      )}

      {!isLoading && !isError && habits.length > 0 && (
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id || habit.title}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                habit.isActive
                  ? "bg-slate-100 dark:bg-white/1 border-transparent opacity-60 dark:opacity-40"
                  : "bg-slate-50 dark:bg-[#0A0A0C] border-slate-200 dark:border-[#222226]"
              }`}
            >
              <div className="flex items-center gap-3">
                {habit.isActive ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-[#A855F7] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                )}
                <span className={`text-xs font-medium ${habit.isActive ? "line-through text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
                  {habit.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border tracking-wider uppercase select-none ${
                    habit.tag?.toLowerCase() === "health"
                      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 dark:text-emerald-400"
                      : habit.tag?.toLowerCase() === "mindset & mental" || habit.tag?.toLowerCase() === "mind"
                        ? "text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 dark:text-purple-400"
                        : "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 dark:text-blue-400"
                  }`}
                >
                  {habit.tag}
                </span>
                <div className="flex items-center justify-end gap-1 w-10 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 select-none">
                  {habit.currentStreak}{" "}
                  <Flame className={`w-3 h-3 ${habit.currentStreak > 0 ? "text-orange-500" : "text-slate-300 dark:text-slate-600"}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}