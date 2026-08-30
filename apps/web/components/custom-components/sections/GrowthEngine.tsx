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
      {/* Ambient Purple Lighting */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[450px] h-[450px] bg-purple-900/25 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        
        {/* ── Left Column: Compounding & Gamification Mechanics ── */}
        <div ref={leftColRef} className="space-y-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-[10px] font-semibold uppercase tracking-widest">
              <Zap className="w-2.5 h-2.5 text-purple-400" />
              <span>The Gamification Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight leading-[1.18]">
              Small Daily Wins Compound Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-white">
                Massive Change.
              </span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Ascend gamifies personal discipline through mathematical compounding. Improving by just 1% every day makes you 37.78x better over the course of a year.
            </p>
          </div>

          <div className="space-y-3">
            {/* Feature 1: XP Progression */}
            <div className="flex gap-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700/60 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(126,34,206,0.25)]">
                <Trophy className="w-3.5 h-3.5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">XP Progression & Level Ups</h3>
                <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                  Earn verifiable XP points for completing focus sessions, checking off habits, and performing evening reflections.
                </p>
              </div>
            </div>

            {/* Feature 2: Rank Theme Unlocks */}
            <div className="flex gap-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700/60 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(126,34,206,0.25)]">
                <Award className="w-3.5 h-3.5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">Rank-Gated Aesthetics</h3>
                <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                  Consistency unlocks exclusive rank badges, dynamic UI themes, and workspace achievements.
                </p>
              </div>
            </div>

            {/* Feature 3: Kinetic Momentum Retention */}
            <div className="flex gap-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700/60 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(126,34,206,0.25)]">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">Streak Defense & Momentum Multipliers</h3>
                <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                  Multi-week streaks trigger XP multipliers, turning your momentum into an addictive positive feedback loop.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Compounding Visuals & XP HUD ── */}
        <div ref={rightColRef} className="relative flex flex-col gap-3.5 items-center">
          
          {/* Main Compounding Card */}
          <div className="w-full rounded-2xl bg-[#090514]/90 border border-purple-700/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(126,34,206,0.2)] p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden">
            
            {/* Background Equation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-6xl font-serif font-black text-purple-500/[0.04] whitespace-nowrap pointer-events-none">
              (1.01)³⁶⁵
            </div>

            <div className="relative z-10 flex justify-between items-start mb-3">
              <div>
                <p className="text-[9px] text-purple-300 uppercase tracking-widest font-mono font-semibold mb-0.5">
                  The 1% Daily Law
                </p>
                <div className="text-white text-xl sm:text-2xl font-bold font-serif">
                  37.78x <span className="text-[11px] font-sans font-normal text-purple-300">Growth</span>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-600/50 text-purple-300 text-[10px] font-mono font-bold">
                1 Year Compounding
              </div>
            </div>

            {/* GSAP Animated Exponential Bar Chart */}
            <div ref={chartRef} className="relative z-10 h-24 flex items-end justify-between gap-1 sm:gap-1.5 mt-2.5">
              {growthCurve.map((h, i) => (
                <div key={i} className="relative flex-1 bg-purple-950/40 rounded-t h-full flex items-end">
                  <div
                    className={`comp-bar w-full rounded-t ${
                      i >= 9
                        ? "bg-gradient-to-t from-purple-700 via-purple-500 to-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                        : "bg-gradient-to-t from-purple-900 to-purple-600"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono text-purple-400/80 pt-2 border-t border-purple-900/40 mt-2">
              <span>Day 1 (1.00x)</span>
              <span>Day 180 (5.99x)</span>
              <span className="text-purple-300 font-bold">Day 365 (37.78x)</span>
            </div>
          </div>

          {/* Floating Sub-Widgets Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Sub-Widget 1: Streak Retention */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 backdrop-blur-md">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-300">Streak Defense</span>
              </div>
              <p className="text-base sm:text-lg font-bold font-serif text-white">98.4% <span className="text-purple-400 text-[9px]">↑</span></p>
              <span className="text-[8px] text-slate-400">Zero broken chains</span>
            </div>

            {/* Sub-Widget 2: Focus Time */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 backdrop-blur-md">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3 h-3 text-purple-400" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-300">Deep Focus</span>
              </div>
              <p className="text-base sm:text-lg font-bold font-serif text-white">18.5 hrs <span className="text-purple-400 text-[9px]">↑</span></p>
              <span className="text-[8px] text-slate-400">This week logged</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}