import React from "react";
import { Milestone } from "lucide-react";

export default function GoalVelocityCard() {
  return (
    <div className="border border-slate-900 rounded-3xl p-5 bg-[#121214] space-y-4 shadow-xl lg:col-span-1">
      <h3 className="text-xs font-bold uppercase font-mono text-slate-400 tracking-widest flex items-center gap-2 select-none">
        <Milestone className="w-3.5 h-3.5 text-[#818CF8]" /> Goal Velocity
      </h3>
      <div className="space-y-4 pt-1">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-300 font-medium">
              Build Coding Platform
            </span>
            <span className="text-[#818CF8] font-bold">76%</span>
          </div>
          <div className="w-full bg-zinc-950 border border-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-[#818CF8] h-full w-[76%] rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-300 font-medium">
              System Core Infrastructure
            </span>
            <span className="text-emerald-400 font-bold">92%</span>
          </div>
          <div className="w-full bg-zinc-950 border border-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[92%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}