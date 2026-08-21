import React from "react";

export default function HabitSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0C] p-4 lg:p-8 space-y-6 animate-pulse">
      {/* Top Navbar Skeleton */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-slate-900 pb-4">
        <div className="h-8 w-36 bg-slate-800 rounded-lg" />
        <div className="h-8 w-8 bg-slate-800 rounded-xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Card Skeleton */}
        <div className="w-full h-48 bg-[#121214] border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="h-6 w-1/4 bg-slate-800 rounded" />
          <div className="h-4 w-1/3 bg-slate-800 rounded" />
          <div className="flex gap-2 pt-2">
            <div className="h-8 w-20 bg-slate-800 rounded-full" />
            <div className="h-8 w-20 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Heatmap Section Skeleton */}
        <div className="w-full h-64 border border-slate-900 rounded-2xl bg-[#121214] p-4" />
      </div>
    </div>
  );
}