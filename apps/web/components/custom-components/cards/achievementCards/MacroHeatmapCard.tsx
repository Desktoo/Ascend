import React from "react";
import HeatmapCard from "@/app/(home)/dashboard/_components/dashboardCards/DashboardHeatMap";

export default function MacroHeatmapCard() {
  return (
    <div className="lg:col-span-2 border border-slate-900 rounded-3xl p-6 bg-[#121214] space-y-4 shadow-xl">
      <div className="select-none">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Macro-Activity Heatmap
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Aggregated check-in frequencies combining all habits, tasks, and
          matrix nodes.
        </p>
      </div>
      <HeatmapCard />
    </div>
  );
}
