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
      <div className="relative z-10">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-[11px] font-medium mb-3">
            <span>Daily Operating Cycle</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2.5">
            How <span className="text-zinc-400">Ascend</span> Works.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-normal">
            A 4-phase execution framework designed to turn scattered ambitions into daily disciplined action.
          </p>
        </div>

        {/* ── 4-Phase Pipeline ── */}
        <div ref={stepsRef} className="relative max-w-4xl mx-auto">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className="step-card group relative flex flex-col justify-between p-4 rounded-2xl bg-[#0d0d10] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                      {step.icon}
                    </div>
                    <span className="text-[9px] font-mono font-medium text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      PHASE {step.id}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>{step.tag}</span>
                  <span className="text-zinc-400">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
