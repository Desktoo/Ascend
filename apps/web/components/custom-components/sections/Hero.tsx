"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Flame, Shield, TrendingUp, Target } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  const [checkedTask, setCheckedTask] = useState(true);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Badge reveal with gentle bounce
      tl.fromTo(
        badgeRef.current,
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7 }
      );

      // 2. Headline text staggered lift
      tl.fromTo(
        headlineRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.4"
      );

      // 3. Subheadline fade-in
      tl.fromTo(
        subheadlineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      );

      // 4. CTA buttons spring in
      tl.fromTo(
        ctaRef.current,
        { y: 25, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" },
        "-=0.5"
      );

      // 5. 3D Tilt Mockup container rise and settle
      tl.fromTo(
        mockupRef.current,
        { y: 80, opacity: 0, rotateX: 20, scale: 0.92 },
        { y: 0, opacity: 1, rotateX: 10, scale: 1, duration: 1.2, ease: "power2.out" },
        "-=0.4"
      );

      // 6. Growth Chart bars rise sequentially
      if (barsRef.current) {
        const bars = barsRef.current.querySelectorAll(".chart-bar");
        tl.fromTo(
          bars,
          { scaleY: 0, transformOrigin: "bottom" },
          { scaleY: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          "-=0.6"
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-start min-h-[90vh] px-4 pt-20 sm:pt-24 pb-12 w-full max-w-4xl mx-auto overflow-hidden"
    >
      {/* Deep Space Purple Ambient Glow */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[500px] sm:w-[650px] h-[300px] bg-purple-900/30 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-purple-600/15 rounded-[100%] blur-[80px] pointer-events-none" />

      {/* ── 1. Hero Copy & Actions ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-700/50 text-purple-300 text-[10px] font-semibold uppercase tracking-widest mb-4 backdrop-blur-md shadow-[0_0_12px_rgba(126,34,206,0.3)]"
        >
          <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
          <span>The Ultimate Discipline Engine</span>
          <span className="w-1 h-1 rounded-full bg-purple-400" />
          <span className="text-purple-400 font-mono text-[9px]">v2.0</span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-[1.12] mb-4"
        >
          Master Your Daily Discipline.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-white">
            Architect Your Ambition.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-6 font-light"
        >
          Ascend unifies your daily habit streaks, high-priority focus tasks, long-term goal milestones, and gamified XP progression into an unstoppable momentum system.
        </p>

        {/* Action CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full sm:w-auto mb-10"
        >
          <Link
            href="/signup"
            className="group relative w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white text-xs font-semibold rounded-full shadow-[0_0_18px_rgba(126,34,206,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Your Ascent</span>
            <ArrowRight className="w-3 h-3 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center gap-1.5 bg-purple-950/40 border border-purple-700/50 text-slate-200 text-xs font-semibold rounded-full hover:bg-purple-900/40 hover:text-white hover:border-purple-500/60 backdrop-blur-md transition-all"
          >
            <span>Explore System</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Live Interactive HUD Preview ── */}
      <div
        ref={mockupRef}
        className="relative w-full max-w-3xl mx-auto z-10"
        style={{ perspective: "1200px" }}
      >
        <div className="relative rounded-2xl border border-purple-700/40 bg-[#090514]/90 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(126,34,206,0.2)] overflow-hidden p-3.5 sm:p-4 pb-4">
          {/* Top Window Chrome */}
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5 mb-3.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-950 border border-purple-700/60" />
              <div className="w-2 h-2 rounded-full bg-purple-950 border border-purple-700/60" />
              <div className="w-2 h-2 rounded-full bg-purple-950 border border-purple-700/60" />
              <span className="ml-2 text-[9px] font-mono text-purple-300/70 hidden sm:inline">
                ascend://dashboard/live-focus
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-700/40 text-[8px] font-mono text-purple-300">
                <span className="w-1 h-1 rounded-full bg-purple-400 animate-ping" />
                Live Execution HUD
              </span>
            </div>
          </div>

          {/* Grid Layout of Live Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Widget 1: Daily Habits & Streaks */}
            <div className="rounded-xl bg-purple-950/25 border border-purple-800/40 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>Daily Habits</span>
                  </div>
                  <span className="text-[8px] font-mono text-purple-400 font-bold">3/3 Done</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Deep Work Sprint", streak: "14d streak", progress: "w-full", color: "bg-purple-500" },
                    { name: "Algorithms & Logic", streak: "8d streak", progress: "w-4/5", color: "bg-purple-600" },
                    { name: "Evening Reflection", streak: "21d streak", progress: "w-full", color: "bg-purple-400" },
                  ].map((habit, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-300 font-medium">{habit.name}</span>
                        <span className="text-purple-400 font-mono text-[8px]">{habit.streak}</span>
                      </div>
                      <div className="h-1.5 w-full bg-purple-950/60 rounded-full overflow-hidden border border-purple-900/30">
                        <div className={`h-full ${habit.progress} ${habit.color} rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-purple-900/30 flex items-center justify-between text-[8px] text-purple-300/80">
                <span className="flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-purple-400" /> Streak Defense
                </span>
                <span className="font-mono text-purple-400">+150 XP</span>
              </div>
            </div>

            {/* Widget 2: Focus Tasks */}
            <div className="rounded-xl bg-purple-950/25 border border-purple-800/40 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white">
                    <Target className="w-3 h-3 text-purple-400" />
                    <span>Focus Tasks</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-700/30 text-purple-300 border border-purple-600/40">
                    High Priority
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div
                    onClick={() => setCheckedTask(!checkedTask)}
                    className="flex items-start gap-1.5 p-1.5 rounded-lg bg-purple-900/20 hover:bg-purple-900/30 border border-purple-800/30 cursor-pointer transition-all"
                  >
                    <CheckCircle2
                      className={`w-3 h-3 mt-0.5 transition-colors ${
                        checkedTask ? "text-purple-400 fill-purple-950" : "text-slate-600"
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`text-[10px] ${checkedTask ? "line-through text-slate-400" : "text-white font-medium"}`}>
                        Ship Core Authentication
                      </p>
                      <span className="text-[8px] font-mono text-purple-400">+50 XP • Target</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-purple-900/20 border border-purple-800/30">
                    <div className="w-3 h-3 mt-0.5 rounded-full border border-purple-500/60" />
                    <div className="flex-1">
                      <p className="text-[10px] text-white font-medium">Refactor Cache Layer</p>
                      <span className="text-[8px] font-mono text-slate-400">45m Focus Block</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-purple-900/30 flex items-center justify-between text-[8px] text-slate-400">
                <span>0 Abandoned Tasks</span>
                <span className="text-purple-300 font-mono">100% Score</span>
              </div>
            </div>

            {/* Widget 3: Gamified Momentum & Growth XP */}
            <div className="rounded-xl bg-gradient-to-br from-purple-950/40 via-[#0f0720] to-[#07040d] border border-purple-700/50 p-3 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-[8px] uppercase font-mono tracking-widest text-purple-300 font-semibold">
                      Momentum Level
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-lg font-bold font-serif text-white">2,490</span>
                      <span className="text-[10px] text-purple-400 font-mono font-bold">XP (Lvl 14)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-700/30 border border-purple-500/40 text-purple-300 text-[8px] font-bold">
                    <TrendingUp className="w-2 h-2 text-purple-400" />
                    +24.5%
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="w-full bg-purple-950/80 h-1.5 rounded-full overflow-hidden border border-purple-800/40 mt-1 mb-2.5">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[78%] rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                </div>
              </div>

              {/* Animated Growth Graph */}
              <div ref={barsRef} className="h-14 flex items-end justify-between gap-1 pt-1">
                {[
                  { h: "35%", day: "M" },
                  { h: "50%", day: "T" },
                  { h: "40%", day: "W" },
                  { h: "70%", day: "T" },
                  { h: "60%", day: "F" },
                  { h: "88%", day: "S" },
                  { h: "100%", day: "S" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full h-9 bg-purple-950/40 rounded-t flex items-end">
                      <div
                        className={`chart-bar w-full rounded-t ${
                          i === 6
                            ? "bg-gradient-to-t from-purple-600 to-purple-300 shadow-[0_0_8px_rgba(192,132,252,0.6)]"
                            : "bg-purple-700/60"
                        }`}
                        style={{ height: bar.h }}
                      />
                    </div>
                    <span className="text-[7px] font-mono text-purple-400/80">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fade Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#090514] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}