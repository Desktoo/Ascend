"use client";

import React from "react";
import { Plus } from "lucide-react";
import ObjectiveCard from "./_components/ObjectiveCard";
import Link from "next/link";
import { useObjective } from "@/core/hooks/useObjective";
import { apiClient } from "@/core/services/client";
import EmptyObjectivesState from "./_components/EmptyObjectiveState";
import ObjectiveSkeletonGrid from "./_components/ObjectiveSkeletonGrid";
import ObjectivesErrorState from "./_components/ObjectiveErrorState";
import { toast } from "sonner";

export default function ObjectivesView() {
  const { objectives = [], isLoading, isError, mutate } = useObjective();

  const handleAbandonGoal = async (id: string) => {
    try {
      await apiClient(`/goals/${id}`, { method: "DELETE" });
      mutate(); // Re-validate SWR cache after abandonment
    } catch (error) {
      console.error("Failed to abandon objective", error);
      toast.error("Failed to abandon objective. Please try again.");
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 p-6 text-slate-900 transition-colors duration-300 dark:bg-[#08080A] dark:text-zinc-300 lg:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-mono-data: 'JetBrains Mono', monospace;
          --font-body: 'Inter', sans-serif;
        }
      `}</style>

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex select-none flex-col items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800 sm:flex-row">
          <div className="space-y-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600"
              style={{ fontFamily: "var(--font-mono-data)" }}
            >
              Strategic Focus Hub
            </span>
            <h1
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Active Objectives
            </h1>
          </div>

          <Link href={"/objectives/create"} passHref>
            <button className=" flex py-2 items-center justify-center gap-1.5 rounded-full bg-transparent shadow-[inset_0_0_40px_rgba(139,92,246,0.8)] px-3 text-xs font-semibold tracking-wide text-white transition-all hover:shadow-[inset_0_0_60px_rgba(139,92,246,1)] active:scale-95">
              <Plus className="h-4 w-4" /> Create Objective
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <ObjectiveSkeletonGrid />
        )}

        {/* Error State */}
        {isError && (
          <ObjectivesErrorState />
        )}

        {/* Content View Area */}
        {!isLoading && !isError && (
          <>
            {objectives.length > 0 ? (
              /* Grid Layout when items exist */
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
                {objectives.map((obj) => (
                  <div key={obj.id} className="w-full flex justify-center">
                    <ObjectiveCard
                      objective={obj}
                      onAbandonGoal={handleAbandonGoal}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Full-Width Centered Container when no objectives exist */
              <div className="flex w-full min-h-[60vh] items-center justify-center py-8">
                <div className="w-full max-w-lg">
                  <EmptyObjectivesState />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
