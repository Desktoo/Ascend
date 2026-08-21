"use client";

import { useState } from "react";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

export default function GrowthVelocityCard() {
  const [activeView, setActiveView] = useState<0 | 1>(0);
  const [emoji, setEmoji] = useState("");
  const [blocker, setBlocker] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="lg:col-span-1 h-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 transition-colors duration-300 flex flex-col overflow-hidden">
      {/* ── Top Header controls ── */}
      <div className="w-full flex justify-between items-center mb-4 z-10">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white transition-all">
          {activeView === 0 ? "Growth Velocity" : "Daily Pulse"}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveView(0)}
            className={`p-1 rounded-md transition-colors ${
              activeView === 0
                ? "text-slate-300 dark:text-slate-600 cursor-default"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
            disabled={activeView === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveView(1)}
            className={`p-1 rounded-md transition-colors ${
              activeView === 1
                ? "text-slate-300 dark:text-slate-600 cursor-default"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
            disabled={activeView === 1}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Carousel Track Container ── */}
      <div className="relative flex-1 w-full overflow-hidden">
        <div
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeView * 100}%)` }}
        >
          {/* ── VIEW 0: Growth Velocity Gauge ── */}
          <div className="w-full shrink-0 flex flex-col justify-between items-center h-full pb-1">
            <div className="relative flex items-center justify-center w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient
                    id="gauge-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-[#222226]"
                  strokeDasharray="169.65 226.2"
                  strokeLinecap="round"
                  transform="rotate(135 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="url(#gauge-gradient)"
                  strokeWidth="8"
                  strokeDasharray="128.93 226.2"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  transform="rotate(135 50 50)"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">
                  76
                  <span className="text-lg text-slate-500 font-medium">%</span>
                </span>
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +14%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center leading-relaxed">
              Your execution rate is higher than{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                82%
              </strong>{" "}
              of users this week.
            </p>
          </div>

          {/* ── VIEW 1: Daily Pulse Reflection ── */}
          <div className="w-full shrink-0 flex flex-col h-full text-xs">
            {/* 1. Emoji Selection */}
            <div className="mb-4">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-2 block">
                How was your day?
              </span>
              <div className="flex gap-3">
                {["🤩", "🙂", "😐", "😫"].map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-lg transition-all ${
                      emoji === e
                        ? "bg-indigo-100 dark:bg-indigo-500/20 ring-2 ring-indigo-500"
                        : "bg-slate-100 dark:bg-[#222226] hover:bg-slate-200 dark:hover:bg-[#2a2a2e] grayscale hover:grayscale-0"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Blockers */}
            <div className="mb-4 flex-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-2 block">
                Main blocker
              </span>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                {["Distraction", "Fatigue", "Overplanning", "Burnout"].map(
                  (b) => (
                    <label
                      key={b}
                      onClick={() => setBlocker(b)}
                      className="flex items-center gap-1.5 cursor-pointer group select-none"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${blocker === b ? "border-indigo-500 bg-indigo-500" : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"}`}
                      >
                        {blocker === b && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-700 dark:text-slate-300">
                        {b}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* 3. Text Area & Save Button */}
            <div className="flex flex-col gap-2.5 mt-auto">
              <textarea
                className="w-full h-10 min-h-[40px] resize-none bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-[#222226] rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-colors"
                placeholder="Add a note (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="w-full h-8 bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white rounded-xl text-[11px] font-semibold shadow-lg shadow-purple-500/10 hover:brightness-110 active:scale-[0.98] transition-all">
                Save Reflection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
