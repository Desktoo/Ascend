"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

export default function ObjectiveDetailSkeleton() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl space-y-6 p-6 lg:p-8">
      {/* Navigation Header Placeholder */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl p-2 text-zinc-600">
          <ArrowLeft className="h-4 w-4" />
          <span className="h-3 w-28 rounded bg-zinc-800/80 animate-pulse" />
        </div>
      </div>

      {/* Grid Layout Skeleton matching the /id workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        {/* Top Banner (HeaderCard) */}
        <div className="h-65 w-full animate-pulse rounded-2xl border border-zinc-800/60 bg-zinc-900/60 lg:col-span-6" />

        {/* Timeline (TimelineCard - 4 cols) */}
        <div className="h-80 w-full animate-pulse rounded-2xl border border-zinc-800/60 bg-zinc-900/60 lg:col-span-4" />

        {/* Progress Velocity (ProgressCard - 2 cols) */}
        <div className="h-80 w-full animate-pulse rounded-2xl border border-zinc-800/60 bg-zinc-900/60 lg:col-span-2" />
      </div>
    </div>
  );
}