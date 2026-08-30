"use client";

import { useRef } from "react";
import { Target, CheckCircle2, Flame, Moon, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WorkflowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: "01",
      title: "Set Long-Term Summits",
      desc: "Define your major life targets and let the system map them into structured milestone trajectories.",
      icon: <Target className="w-5 h-5" />,
      tag: "Targeting",
    },
    {
      id: "02",
      title: "Execute Daily Focus Blocks",
      desc: "Lock into high-impact deep work sessions. Clear priority objectives without reactive busywork.",
      icon: <CheckCircle2 className="w-5 h-5" />,
      tag: "Execution",
    },
    {
      id: "03",
      title: "Build Habit Streaks & XP",
      desc: "Log daily micro-habits, earn gamified XP progression, and watch your consistency heatmap light up.",
      icon: <Flame className="w-5 h-5" />,
      tag: "Momentum",
    },
    {
      id: "04",
      title: "Evening Reflection & Closure",
      desc: "Conclude your day with deliberate reflection: log wins, isolate friction, and calibrate tomorrow.",
      icon: <Moon className="w-5 h-5" />,
      tag: "Mastery",
    },
  ];

  useGSAP(
    () => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      // Staggered Step Cards Animation
      if (stepsRef.current) {
        const cards = stepsRef.current.querySelectorAll(".step-card");
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stepsRef.current,
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
      id="workflow"
      ref={containerRef}
      className="relative py-14 sm:py-20 px-4 w-full max-w-4xl mx-auto overflow-hidden"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-900/20 rounded-[100%] blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-[10px] font-semibold uppercase tracking-widest mb-2.5">
            <Sparkles className="w-2.5 h-2.5 text-purple-400" />
            <span>The Daily Operating Cycle</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight mb-2.5">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200">Ascend</span> Works.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-light">
            A frictionless, 4-phase execution framework that transforms raw ambition into disciplined daily reality.
          </p>
        </div>

        {/* ── 4-Phase Pipeline ── */}
        <div ref={stepsRef} className="relative max-w-4xl mx-auto">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-6 right-6 h-[1px] bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900 -translate-y-1/2 z-0" />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className="step-card group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#090514]/90 border border-purple-800/40 hover:border-purple-600/70 hover:shadow-[0_0_25px_rgba(126,34,206,0.25)] transition-all duration-300 backdrop-blur-xl"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-900/60 group-hover:text-purple-300 transition-all shadow-[0_0_10px_rgba(126,34,206,0.2)]">
                      {step.icon}
                    </div>
                    <span className="text-[8px] font-mono font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-800/40">
                      PHASE {step.id}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-purple-900/30 flex items-center justify-between text-[8px] font-mono text-purple-400/80">
                  <span>{step.tag}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-purple-300">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
