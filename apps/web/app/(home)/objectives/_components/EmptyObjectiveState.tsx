"use client";

import React from "react";
import { Target, Plus } from "lucide-react";
import Link from "next/link";

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

export default function EmptyObjectivesState() {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-[#1C1924] bg-gradient-to-b from-[#15101B] via-[#0D0D10] to-[#09090B] p-8 text-center shadow-2xl">
      {/* Target Glyph Container */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
        <Target className="h-7 w-7" />
      </div>

      {/* Main Title */}
      <h3
        className="text-lg font-semibold tracking-wide text-white"
        style={display}
      >
        No Active Objectives
      </h3>

      {/* Strategic Body Copy */}
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400">
        Your strategic roadmap is empty. Define a high-impact objective, set your sprint timeframe, and generate your daily execution blueprint.
      </p>

      {/* Action Button */}
      <Link href="/objectives/create" passHref className="mt-6 w-full max-w-xs">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-transparent shadow-[inset_0_0_40px_rgba(139,92,246,0.8)] py-2.5 text-xs font-semibold text-white transition-all hover:shadow-[inset_0_0_90px_rgba(139,92,246,0.8)] active:scale-95"
          style={mono}
        >
          <Plus className="h-4 w-4" />
          Initialize First Objective
        </button>
      </Link>
    </div>
  );
}