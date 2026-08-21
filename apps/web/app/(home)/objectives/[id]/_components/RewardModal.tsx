"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Trophy,
  X,
  Lock,
  Gift,
  Coffee,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { GoalDetailResponse } from "@/core/types/objective.types";

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: GoalDetailResponse;
}

export default function RewardModal({ isOpen, onClose, goal }: RewardModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const rewardProgress = Math.min(
    100,
    Math.round((goal.completedDays / goal.targetDays) * 100)
  );

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Clean Dialog Container */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/20 bg-[#0D0C12] p-6 text-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <Gift className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide" style={display}>
                Milestone Incentives
              </h3>
              <p className="text-[10px] text-slate-500" style={mono}>
                Your Personal Horizon Rewards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Minimal Progress Tracker */}
        <div className="my-5 rounded-xl border border-zinc-800/80 bg-[#08080A] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium" style={mono}>
              Milestone Progress
            </span>
            <span className="font-bold text-purple-300" style={mono}>
              {rewardProgress}%
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${rewardProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500" style={mono}>
            <span>{goal.completedDays} days done</span>
            <span>{goal.targetDays - goal.completedDays} days to go</span>
          </div>
        </div>

        {/* Motivational Reward Cards */}
        <div className="space-y-3">
          {/* Milestone 1: 50% Progress Perk */}
          <div
            className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
              rewardProgress >= 50
                ? "border-emerald-500/30 bg-[#0A120E] text-slate-200"
                : "border-zinc-800/80 bg-[#0A0A0E] text-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  rewardProgress >= 50
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-purple-500/20 bg-purple-500/10 text-purple-400"
                }`}
              >
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white" style={display}>
                  Mid-Sprint Treat / Perk
                </h4>
                <p className="text-[10px] text-slate-500" style={mono}>
                  50% Milestone (Day {Math.ceil(goal.targetDays / 2)})
                </p>
              </div>
            </div>

            <span
              className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                rewardProgress >= 50
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-zinc-900 text-zinc-500 border border-zinc-800"
              }`}
              style={mono}
            >
              {rewardProgress >= 50 ? "Unlocked" : "Locked"}
            </span>
          </div>

          {/* Milestone 2: 100% Completion Grand Prize */}
          <div
            className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
              rewardProgress >= 100
                ? "border-emerald-500/30 bg-[#0A120E] text-slate-200"
                : "border-zinc-800/80 bg-[#0A0A0E] text-slate-400 opacity-75"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white" style={display}>
                  Grand Goal Reward
                </h4>
                <p className="text-[10px] text-slate-500" style={mono}>
                  100% Horizon Finish (Day {goal.targetDays})
                </p>
              </div>
            </div>

            <span
              className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                rewardProgress >= 100
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-zinc-900 text-zinc-600 border border-zinc-800"
              }`}
              style={mono}
            >
              {rewardProgress >= 100 ? "Unlocked" : "Locked"}
            </span>
          </div>
        </div>

        {/* Clean Secondary Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl border border-purple-500/20 bg-purple-500/10 py-2.5 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/20 hover:text-white"
          style={mono}
        >
          Back to Workspace
        </button>
      </div>
    </div>,
    document.body
  );
}