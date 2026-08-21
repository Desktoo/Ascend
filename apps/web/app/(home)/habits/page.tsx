"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import HabitsCard from "@/app/(home)/habits/_components/HabitCard";
import { useHabits } from "@/core/hooks/useHabits";
import EmptyHabitsState from "./_components/EmptyHabitState";
import ErrorHabitsState from "./_components/ErrorHabitState";

export default function Page() {
  const { habits, isLoading, isError } = useHabits();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#08080A] dark:text-slate-200 lg:p-8">
      {/* Self-contained type tokens, matching the habit detail page. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-mono-data: 'JetBrains Mono', monospace;
          --font-body: 'Inter', sans-serif;
        }
      `}</style>

      <div className="space-y-6">
        {/* HEADER NAVIGATION ROW */}
        <div className="flex select-none flex-col justify-between gap-4 sm:flex-row items-center border-b pb-4 ">
          <div className="space-y-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600"
              style={{ fontFamily: "var(--font-mono-data)" }}
            >
              Control Room
            </span>
            <h1
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Habit Trackers
            </h1>
          </div>

          <Link href={"/habits/create"} passHref>
            <button className=" flex py-2 items-center justify-center gap-1.5 rounded-full bg-transparent shadow-[inset_0_0_40px_rgba(139,92,246,0.8)] px-3 text-xs font-semibold tracking-wide text-white transition-all hover:shadow-[inset_0_0_60px_rgba(139,92,246,1)] active:scale-95">
              <Plus className="h-4 w-4" /> Create Habit
            </button>
          </Link>
        </div>

        {/* LOADING AND ERROR STATE LAYOUTS */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 w-full animate-pulse rounded-2xl border border-[#1A1A1D] bg-[#101012]"
              />
            ))}
          </div>
        )}

        {/* DYNAMIC HABITS GRID CANVAS */}
        {!isLoading && !isError && (
          <>
            {habits && habits.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-4">
                {habits.map((habit) => (
                  <HabitsCard
                    key={habit.id}
                    id={habit.id}
                    title={habit.title}
                    currentStreak={habit.currentStreak}
                    bestStreak={habit.longestStreak}
                    consistency={habit.stabilityScore}
                    initialIsActive={habit.isActive}
                  />
                ))}
              </div>
            ) : (
              <EmptyHabitsState />
            )}
          </>
        )}
        {isError && <ErrorHabitsState onRetry={() => window.location.reload()} />}
      </div>
    </div>
  );
}