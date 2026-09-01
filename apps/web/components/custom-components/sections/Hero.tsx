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
      className="relative flex flex-col items-center justify-start min-h-[85vh] px-4 pt-20 sm:pt-24 pb-12 w-full max-w-4xl mx-auto overflow-hidden"
    >
      {/* Subtle Dark Ambient Light */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-purple-950/20 rounded-full blur-[130px] pointer-events-none" />

      {/* ── 1. Hero Copy & Actions ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Minimalist Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-[11px] font-medium mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>The Daily Execution Engine</span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.15] mb-4"
        >
          Turn Long-Term Ambitions into
          <br />
          <span className="text-zinc-400">
            Daily, Measurable Progress.
          </span>
        </h1>

        {/* Subheadline: Clear Problem & Solution */}
        <p
          ref={subheadlineRef}
          className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed mb-6 font-normal"
        >
          Most goals fail because to-do apps don&apos;t connect big milestones to today&apos;s actions. Ascend bridges your goals and recurring habits into structured daily focus tasks — compounding execution into verifiable streaks and XP.
        </p>

        {/* Action CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-10"
        >
          <Link
            href="/signup"
            className="w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-200" />
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
          >
            <span>How it Works</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Minimalist Execution HUD Preview ── */}
      <div
        ref={mockupRef}
        className="relative w-full max-w-3xl mx-auto z-10"
        style={{ perspective: "1200px" }}
      >
        <div className="relative rounded-2xl border border-zinc-800/80 bg-[#0d0d10] p-4 sm:p-5 shadow-2xl overflow-hidden">
          {/* Top Window Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              <span className="text-[11px] font-mono text-zinc-500 ml-2 hidden sm:inline">
                dashboard / daily-focus
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-[9px] font-mono text-purple-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Active HUD
              </span>
            </div>
          </div>

          {/* Grid Layout of Live Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Widget 1: Daily Habits */}
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Habits</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 font-medium">3/3 Done</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Deep Focus Session", streak: "14d streak", progress: "w-full", color: "bg-purple-600" },
                    { name: "Code Review & Logic", streak: "8d streak", progress: "w-4/5", color: "bg-purple-700" },
                    { name: "Daily Reflection", streak: "21d streak", progress: "w-full", color: "bg-purple-600" },
                  ].map((habit, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-300 font-medium">{habit.name}</span>
                        <span className="text-zinc-500 font-mono text-[9px]">{habit.streak}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${habit.progress} ${habit.color} rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[9px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-purple-400" /> Active Streak
                </span>
                <span className="font-mono text-purple-400">+150 XP</span>
              </div>
            </div>

            {/* Widget 2: Focus Tasks */}
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span>Today&apos;s Focus</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-zinc-800 text-zinc-300">
                    High Priority
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div
                    onClick={() => setCheckedTask(!checkedTask)}
                    className="flex items-start gap-2 p-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 cursor-pointer transition-all"
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 mt-0.5 transition-colors ${
                        checkedTask ? "text-purple-400" : "text-zinc-600"
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`text-[11px] ${checkedTask ? "line-through text-zinc-500" : "text-zinc-200 font-medium"}`}>
                        Ship Core Authentication
                      </p>
                      <span className="text-[8px] font-mono text-purple-400">+50 XP • Target</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-800/30 border border-zinc-800">
                    <div className="w-3.5 h-3.5 mt-0.5 rounded-full border border-zinc-600" />
                    <div className="flex-1">
                      <p className="text-[11px] text-zinc-200 font-medium">Refactor Cache Layer</p>
                      <span className="text-[8px] font-mono text-zinc-500">45m Focus Block</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[9px] text-zinc-400">
                <span>0 Abandoned Tasks</span>
                <span className="text-zinc-300 font-mono">100% Score</span>
              </div>
            </div>

            {/* Widget 3: Gamified Compounding XP */}
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase font-medium">
                      Progression
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-lg font-semibold text-white">2,490</span>
                      <span className="text-[10px] text-purple-400 font-mono font-medium">XP (Lvl 14)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300 text-[8px] font-bold">
                    <TrendingUp className="w-2.5 h-2.5 text-purple-400" />
                    +24%
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2 mb-2.5">
                  <div className="bg-purple-600 h-full w-[78%] rounded-full" />
                </div>
              </div>

              {/* Minimalist Bar Graph */}
              <div ref={barsRef} className="h-12 flex items-end justify-between gap-1 pt-1">
                {[
                  { h: "35%", day: "M" },
                  { h: "50%", day: "T" },
                  { h: "40%", day: "W" },
                  { h: "70%", day: "T" },
                  { h: "60%", day: "F" },
                  { h: "88%", day: "S" },
                  { h: "100%", day: "S" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-8 bg-zinc-800/60 rounded-t flex items-end">
                      <div
                        className={`chart-bar w-full rounded-t ${
                          i === 6 ? "bg-purple-500" : "bg-purple-800/60"
                        }`}
                        style={{ height: bar.h }}
                      />
                    </div>
                    <span className="text-[7px] font-mono text-zinc-500">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}