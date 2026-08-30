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
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-900/20 rounded-[100%] blur-[140px] pointer-events-none" />

      {/* ── Section Header ── */}
      <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-[10px] font-semibold uppercase tracking-widest mb-2.5">
          <Sparkles className="w-2.5 h-2.5 text-purple-400" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight mb-2.5">
          Built for Uncompromising <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200">Daily Execution.</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-light">
          No generic to-do lists. Ascend provides four synchronized engines designed to turn ambitious visions into daily, frictionless progress.
        </p>
      </div>

      {/* ── Bento Grid: 4 Core Pillars ── */}
      <div ref={gridRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        
        {/* Card 1: Habit Routines & Streak Protection */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#090514]/90 border border-purple-800/40 hover:border-purple-600/70 hover:shadow-[0_0_25px_rgba(126,34,206,0.25)] transition-all duration-300 backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-900/60 group-hover:text-purple-300 transition-all shadow-[0_0_12px_rgba(126,34,206,0.2)]">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-[8px] font-mono font-bold text-purple-400/80 uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40">
                Pillar 01
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
              Habit Mastery & Streak Defense
            </h3>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-4">
              Build automatic daily rituals. The system tracks your consecutive execution streaks and calculates consistency velocity so momentum never stalls.
            </p>
          </div>

          {/* Mini Interactive Heatmap Preview */}
          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 mt-auto">
            <div className="flex justify-between items-center text-[10px] mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-purple-400" /> 28-Day Streak Active
              </span>
              <span className="font-mono text-purple-400 font-bold text-[9px]">96% Velocity</span>
            </div>
            {/* Visual Heatmap Grid */}
            <div className="grid grid-cols-14 gap-1">
              {[...Array(28)].map((_, i) => {
                const isBright = i % 4 !== 0;
                return (
                  <div
                    key={i}
                    className={`h-3 rounded-[2px] transition-all hover:scale-125 ${
                      isBright
                        ? "bg-purple-500 shadow-[0_0_4px_rgba(168,85,247,0.5)]"
                        : "bg-purple-900/40 border border-purple-800/30"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: High-Priority Focus Tasks */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#090514]/90 border border-purple-800/40 hover:border-purple-600/70 hover:shadow-[0_0_25px_rgba(126,34,206,0.25)] transition-all duration-300 backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-900/60 group-hover:text-purple-300 transition-all shadow-[0_0_12px_rgba(126,34,206,0.2)]">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[8px] font-mono font-bold text-purple-400/80 uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40">
                Pillar 02
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
              High-Impact Focus Task Ledger
            </h3>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-4">
              Differentiate real needle-movers from trivial busywork. Manage structured daily focus blocks with priority tagging and automated abandoned task cleanup.
            </p>
          </div>

          {/* Mini Task List Preview */}
          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 space-y-1 mt-auto">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-purple-900/20 border border-purple-800/30">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-purple-600 flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                <span className="text-[10px] text-slate-200 font-medium">Architect Database Schema</span>
              </div>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-purple-700/40 text-purple-300">
                Deep Work
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-purple-900/10 border border-purple-800/20">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border border-purple-500/50" />
                <span className="text-[10px] text-slate-300">Execute Sprint Review</span>
              </div>
              <span className="text-[8px] font-mono text-purple-400">+50 XP</span>
            </div>
          </div>
        </div>

        {/* Card 3: Long-Term Goal Architecture */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#090514]/90 border border-purple-800/40 hover:border-purple-600/70 hover:shadow-[0_0_25px_rgba(126,34,206,0.25)] transition-all duration-300 backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-900/60 group-hover:text-purple-300 transition-all shadow-[0_0_12px_rgba(126,34,206,0.2)]">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[8px] font-mono font-bold text-purple-400/80 uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40">
                Pillar 03
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
              Summit Goal Breakdown
            </h3>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-4">
              Stop letting major life ambitions get lost in the noise. Connect high-level annual summits directly to tangible weekly milestones and daily tasks.
            </p>
          </div>

          {/* Mini Goal Roadmap Widget */}
          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 mt-auto">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-white font-medium">Launch Software Product</span>
              <span className="font-mono text-purple-300 font-bold">75% Complete</span>
            </div>
            <div className="w-full bg-purple-950 h-1.5 rounded-full overflow-hidden border border-purple-900/40 mb-1.5">
              <div className="bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400 h-full w-3/4 rounded-full" />
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 font-mono">
              <span>3 Milestones Completed</span>
              <span className="text-purple-400">1 Milestone Left</span>
            </div>
          </div>
        </div>

        {/* Card 4: Daily Evening Reflection Ritual */}
        <div className="bento-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#090514]/90 border border-purple-800/40 hover:border-purple-600/70 hover:shadow-[0_0_25px_rgba(126,34,206,0.25)] transition-all duration-300 backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-900/60 group-hover:text-purple-300 transition-all shadow-[0_0_12px_rgba(126,34,206,0.2)]">
                <Moon className="w-4 h-4 text-purple-300" />
              </div>
              <span className="text-[8px] font-mono font-bold text-purple-400/80 uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40">
                Pillar 04
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
              Daily Evening Reflection Ritual
            </h3>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-4">
              Close each day with deliberate mindfulness. Review completed focus objectives, note key wins, identify bottlenecks, and calibrate your targets for tomorrow.
            </p>
          </div>

          {/* Mini Reflection Prompt Widget */}
          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 space-y-1 mt-auto">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-purple-300 font-medium">Evening Review Status</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-950/60 text-green-400 border border-green-800/40">
                Logged ✓
              </span>
            </div>
            <p className="text-[9px] text-slate-300 italic bg-purple-900/20 p-1.5 rounded border border-purple-800/20">
              &quot;Completed core architecture sprint ahead of schedule. Energy high for tomorrow.&quot;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
