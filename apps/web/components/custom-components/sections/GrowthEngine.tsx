"use client";

import { useRef } from "react";
import { Zap, Award, Flame, TrendingUp, Trophy } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GrowthEngineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Exponential compounding curve data
  const growthCurve = [3, 5, 8, 12, 18, 26, 36, 49, 64, 82, 95, 100];

  useGSAP(
    () => {
      // Left Column Fade-in
      gsap.fromTo(
        leftColRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );

      // Right Column Fade-in
      gsap.fromTo(
        rightColRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );

      // Exponential bars rise
      if (chartRef.current) {
        const bars = chartRef.current.querySelectorAll(".comp-bar");
        gsap.fromTo(
          bars,
          { scaleY: 0, transformOrigin: "bottom" },
          {
            scaleY: 1,
            duration: 1,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chartRef.current,
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
      id="growth-engine"
      ref={containerRef}
      className="relative py-14 sm:py-20 px-4 w-full max-w-4xl mx-auto overflow-hidden"
    >
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        
        {/* ── Left Column: Compounding & Gamification Mechanics ── */}
        <div ref={leftColRef} className="space-y-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-[11px] font-medium">
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Compounding Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-[1.2]">
              Small Daily Wins Compound Into{" "}
              <span className="text-zinc-400">
                Massive Long-Term Growth.
              </span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Consistency is hard when progress feels invisible. Ascend translates every completed habit, focus block, and reflection into real XP progression and streak defense.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Feature 1: XP Progression */}
            <div className="flex gap-3 p-3 rounded-xl bg-[#0d0d10] border border-zinc-800/80">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Trophy className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">Verifiable XP & Level Progression</h3>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  Earn points for every executed task, habit completion, and evening reflection.
                </p>
              </div>
            </div>

            {/* Feature 2: Rank Theme Unlocks */}
            <div className="flex gap-3 p-3 rounded-xl bg-[#0d0d10] border border-zinc-800/80">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">Rank Milestones & Tiers</h3>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  Long-term execution unlocks higher rank tiers and visual recognition of your discipline.
                </p>
              </div>
            </div>

            {/* Feature 3: Kinetic Momentum Retention */}
            <div className="flex gap-3 p-3 rounded-xl bg-[#0d0d10] border border-zinc-800/80">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">Streak Defense & Momentum</h3>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  Protect consecutive daily executions and build an unbroken chain of consistency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Compounding Visuals & XP HUD ── */}
        <div ref={rightColRef} className="relative flex flex-col gap-3 items-center">
          
          {/* Main Compounding Card */}
          <div className="w-full rounded-2xl bg-[#0d0d10] border border-zinc-800/80 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            
            <div className="relative z-10 flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-0.5">
                  The 1% Daily Law
                </p>
                <div className="text-white text-xl sm:text-2xl font-semibold">
                  37.78x <span className="text-xs font-normal text-zinc-400">Compounded</span>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono font-medium">
                1 Year Trajectory
              </div>
            </div>

            {/* GSAP Animated Exponential Bar Chart */}
            <div ref={chartRef} className="relative z-10 h-24 flex items-end justify-between gap-1 sm:gap-1.5 mt-2.5">
              {growthCurve.map((h, i) => (
                <div key={i} className="relative flex-1 bg-zinc-800/40 rounded-t h-full flex items-end">
                  <div
                    className={`comp-bar w-full rounded-t ${
                      i >= 9
                        ? "bg-purple-600"
                        : "bg-zinc-700"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 pt-2.5 border-t border-zinc-800/80 mt-3">
              <span>Day 1 (1.00x)</span>
              <span>Day 180 (5.99x)</span>
              <span className="text-zinc-300">Day 365 (37.78x)</span>
            </div>
          </div>

          {/* Floating Sub-Widgets Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Sub-Widget 1: Streak Retention */}
            <div className="p-3.5 rounded-xl bg-[#0d0d10] border border-zinc-800/80">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Streak Defense</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-white">98.4% <span className="text-purple-400 text-xs">↑</span></p>
              <span className="text-[10px] text-zinc-500">Unbroken chains</span>
            </div>

            {/* Sub-Widget 2: Focus Time */}
            <div className="p-3.5 rounded-xl bg-[#0d0d10] border border-zinc-800/80">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Deep Focus</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-white">18.5 hrs <span className="text-purple-400 text-xs">↑</span></p>
              <span className="text-[10px] text-zinc-500">This week logged</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}