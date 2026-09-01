"use client";

import { useRef } from "react";
import { Flame, CheckCircle2, Target, Moon, Sparkles, Shield } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturePillarsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Header entrance on scroll
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      // Staggered Bento Cards Entrance
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".bento-card");
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative py-14 sm:py-20 px-4 w-full max-w-4xl mx-auto overflow-hidden"
    >
      {/* ── Section Header ── */}
      <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-[11px] font-medium mb-3">
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2.5">
          Everything You Need to <span className="text-zinc-400">Execute Daily.</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-normal">
          Designed from first principles to eliminate the friction between planning long-term ambitions and executing today&apos;s tasks.
        </p>
      </div>

      {/* ── Bento Grid: 4 Core Pillars ── */}
      <div ref={gridRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        
        {/* Card 1: Habit Engine & Streaks */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#0d0d10] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                Pillar 01
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
              Automated Habit Engine
            </h3>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-4">
              Set target days and due times once. Background workers automatically materialize habit tasks into your daily queue without manual tracking fatigue.
            </p>
          </div>

          {/* Mini Heatmap Preview */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 mt-auto">
            <div className="flex justify-between items-center text-[10px] mb-2">
              <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-purple-400" /> 28-Day Consistency Streak
              </span>
              <span className="font-mono text-zinc-400 text-[9px]">96% Velocity</span>
            </div>
            {/* Visual Heatmap Grid */}
            <div className="grid grid-cols-14 gap-1">
              {[...Array(28)].map((_, i) => {
                const isDone = i % 4 !== 0;
                return (
                  <div
                    key={i}
                    className={`h-2.5 rounded-[2px] ${
                      isDone
                        ? "bg-purple-600"
                        : "bg-zinc-800"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: High-Priority Focus Tasks */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#0d0d10] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                Pillar 02
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
              Priority Focus & Abandonment Recovery
            </h3>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-4">
              Separate high-impact focus tasks from trivial errands. Pending tasks from previous days are gracefully collected for quick rescue or purge.
            </p>
          </div>

          {/* Mini Task List Preview */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 mt-auto">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/40 border border-zinc-700/40">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-purple-700 flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                <span className="text-[11px] text-zinc-200 font-medium">Ship Core Authentication</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                Focus
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/20 border border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-zinc-600" />
                <span className="text-[11px] text-zinc-400">Refactor Cache Layer</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500">+50 XP</span>
            </div>
          </div>
        </div>

        {/* Card 3: Long-Term Goal Architecture */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#0d0d10] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                Pillar 03
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
              Goal-to-Task Decomposition
            </h3>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-4">
              Connect weekly and monthly objectives directly to executable daily tasks so major projects never get forgotten or stalled.
            </p>
          </div>

          {/* Mini Goal Roadmap Widget */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 mt-auto">
            <div className="flex justify-between items-center text-[10px] mb-1.5">
              <span className="text-zinc-200 font-medium">Launch Software Product</span>
              <span className="font-mono text-zinc-400">75% Complete</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-purple-600 h-full w-3/4 rounded-full" />
            </div>
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
              <span>3 Milestones Done</span>
              <span className="text-zinc-400">1 Milestone Left</span>
            </div>
          </div>
        </div>

        {/* Card 4: Daily Evening Reflection Ritual */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#0d0d10] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Moon className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                Pillar 04
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
              Timezone-Aware Evening Reflection
            </h3>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-4">
              Close your day with an honest log. Calculates logical dates based on your personal day start time, recording immutable history and seeding tomorrow.
            </p>
          </div>

          {/* Mini Reflection Prompt Widget */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 mt-auto">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-300 font-medium">Daily Reflection</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-zinc-800 text-zinc-300">
                Logged ✓
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 italic bg-zinc-800/40 p-2 rounded border border-zinc-800">
              &quot;Completed core architecture sprint. Energy high for tomorrow.&quot;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
