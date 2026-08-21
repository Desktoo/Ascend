"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Gauge, Sparkles, TrendingUp } from "lucide-react";
import RadialGauge from "@/components/custom-components/common/GuageChart";

gsap.registerPlugin(useGSAP);

interface ProgressCardProps {
  velocity: number;
  progressPercent: number;
  completedDays: number;
  targetDays: number;
}

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

export default function ProgressCard({
  velocity,
  progressPercent,
  completedDays,
  targetDays,
}: ProgressCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#1C1924] bg-gradient-to-b from-[#15101B] via-[#0D0D10] to-[#09090B] p-6 text-slate-200 shadow-2xl"
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-600/10 blur-[70px]" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-900/10 blur-[70px]" />

      {/* Header Area */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
            <Gauge className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-white" style={display}>
            Progress
          </h2>
        </div>

        {/* Speed Badge Tag */}
        <span
          className="flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[9px] font-bold text-purple-300"
          style={mono}
        >
          <TrendingUp className="h-3 w-3 text-purple-400" />
          {velocity}% PACE
        </span>
      </div>

      {/* Center: Radial Gauge Indicator */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <RadialGauge value={progressPercent} size={150} strokeWidth={9} />
        </div>
      </div>

      {/* Bottom Area: Linear Progress Meter & Counter */}
      <div className="relative z-10 space-y-2 border-t border-purple-500/10 pt-4">
        <div className="flex items-center justify-between text-[10px]" style={mono}>
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="h-3 w-3 text-purple-400" />
            Execution Completion
          </span>
          <span className="font-bold text-purple-300">
            {completedDays} / {targetDays} Days
          </span>
        </div>

        {/* Secondary Linear Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900 border border-purple-500/15">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-indigo-400 transition-all duration-500 shadow-[0_0_10px_#A855F7]"
            style={{ width: `${Math.min(100, Math.max(0, (completedDays / targetDays) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}