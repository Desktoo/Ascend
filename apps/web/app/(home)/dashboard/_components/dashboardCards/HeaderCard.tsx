"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Target,
  CheckCircle2,
  Flame,
  Shield,
  Sparkles,
  Zap,
  Plus,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useUserProfile from "@/core/hooks/useUserProfile";
import { getXpRequiredForNextLevel } from "@/core/utils/xp-rules";
import { getDisplayTitle } from "@/core/constant/themes/rank-titles";
import StaticLoadingZap from "../animations/StaticLoadingZap";
import Link from "next/link";

interface HeaderCardProps {
  onAddTask: () => void;
  onAddGoal: () => void;
  onAddHabit: () => void;
}

export default function HeaderCard({
  onAddTask,
  onAddGoal,
  onAddHabit,
}: HeaderCardProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const { user, isLoading, isValidating } = useUserProfile();

  // ── 🧠 LOCAL ANIMATION MIRROR REGISTERS (Prevents SWR Flapping) ──
  const [renderLevel, setRenderLevel] = useState(1);
  const [renderXp, setRenderXp] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const xpObj = useRef({ value: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Anchor nodes for the cinematic transition
  const mainContentRef = useRef<HTMLDivElement>(null);
  const levelOverlayRef = useRef<HTMLDivElement>(null);
  const oldNumRef = useRef<HTMLDivElement>(null);
  const newNumRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  // Track previous levels to catch changes across rendering lifecycle sweeps
  const prevLevelRef = useRef<number | null>(null);

  // Derive mathematical metrics off our local mirrored state registers instead of live raw queries
  const levelMaxTargetXp = getXpRequiredForNextLevel(renderLevel);
  const completionPercentage = Math.min(
    Math.floor((renderXp / levelMaxTargetXp) * 100),
    100,
  );

  const displayTitle = user ? getDisplayTitle(user.rank) : "Loading...";

  // 🛡️ Data Synchronization Layer
  useEffect(() => {
    if (!user) return;

    // Cold Start Initialization
    if (prevLevelRef.current === null) {
      prevLevelRef.current = user.level;
      setRenderLevel(user.level);
      setRenderXp(user.xp);
      return;
    }

    // SCENARIO 1: Standard XP Gains (Same Level)
    if (user.level === prevLevelRef.current) {
      if (!isLevelingUp) {
        setRenderXp(user.xp);
      }
      return;
    }

    // SCENARIO 2: Level Up Intercept Detected!
    if (user.level > prevLevelRef.current && !isLevelingUp) {
      setIsLevelingUp(true);
      // We explicitly DO NOT update prevLevelRef.current or local hooks yet.
      // We let the useGSAP master timeline orchestrate the sequence frames sequentially.
    }
  }, [user?.xp, user?.level, isLevelingUp]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    }
    if (isAddMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddMenuOpen]);

  // 🎬 Master Animation Orchestrator
  useGSAP(
    () => {
      if (isLoading || !user) return;

      // ── PIPELINE A: STANDARD RE-RENDERS ──
      if (!isLevelingUp) {
        if (!barRef.current) return;

        gsap.to(barRef.current, {
          width: `${completionPercentage}%`,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(xpObj.current, {
          value: completionPercentage,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: () => {
            if (textRef.current) {
              textRef.current.innerText = `${Math.round(xpObj.current.value)}%`;
            }
          },
        });
        return;
      }

      // ── PIPELINE B: CINEMATIC LEVEL UP SEQUENCER ──
      if (isLevelingUp && prevLevelRef.current !== null) {
        const oldLevel = prevLevelRef.current;
        const newLevel = user.level;
        const freshTargetXp = user.xp;

        const tl = gsap.timeline({
          onComplete: () => {
            // Step 6: Unlock layout boundaries and normalize registers
            prevLevelRef.current = newLevel;
            setRenderLevel(newLevel);
            setRenderXp(freshTargetXp);
            setIsLevelingUp(false);

            // Re-seed content layer visibility defaults
            gsap.set(mainContentRef.current, { opacity: 1, scale: 1 });
          },
        });

        // Step 1: Force progress bar to fill to 100% cleanly
        tl.to(barRef.current, {
          width: "100%",
          duration: 0.3,
          ease: "power1.out",
        });
        tl.to(
          xpObj.current,
          {
            value: 100,
            duration: 0.3,
            ease: "power1.out",
            onUpdate: () => {
              if (textRef.current) textRef.current.innerText = "100%";
            },
          },
          "<",
        );

        // Step 2: Clear dashboard panels completely down out of view
        tl.to(
          mainContentRef.current,
          {
            opacity: 0,
            scale: 0.95,
            duration: 0.25,
            ease: "power2.inOut",
          },
          "+=0.1",
        );

        // Step 3: Reveal overlay layout mask and execute cosmic gradient/glow boundaries
        tl.to(
          levelOverlayRef.current,
          {
            opacity: 1,
            display: "flex",
            duration: 0.15,
          },
          "-=0.1",
        );

        tl.to(
          containerRef.current,
          {
            boxShadow: "0 0 50px 15px rgba(168, 85, 247, 0.35)",
            background:
              "linear-gradient(135deg, #12101c 0%, #290d38 50%, #0d0d10 100%)",
            borderColor: "#A855F7",
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.2",
        );

        // Step 4: Kinetic Split Text Slice Transition Loop
        tl.to(
          oldNumRef.current,
          {
            y: "-130%",
            opacity: 0,
            duration: 0.45,
            ease: "back.in(1.5)",
          },
          "-=0.1",
        );

        tl.fromTo(
          newNumRef.current,
          { y: "130%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.55, ease: "back.out(1.6)" },
          "-=0.35",
        );

        // Impact flash glow execution
        tl.fromTo(
          flashOverlayRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 0.35, scale: 1.4, duration: 0.15, ease: "power1.out" },
          "-=0.4",
        );
        tl.to(flashOverlayRef.current, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        });

        // Step 5: Hold presentation frame space, then dissolve the mask overlay view down
        tl.to(
          levelOverlayRef.current,
          {
            opacity: 0,
            duration: 0.35,
            ease: "power2.inOut",
          },
          "+=1.3",
        );

        tl.to(
          containerRef.current,
          {
            boxShadow: "none",
            background: "",
            borderColor: "",
            duration: 0.25,
          },
          "-=0.1",
        );
      }
    },
    {
      dependencies: [completionPercentage, isLoading, isLevelingUp],
      scope: containerRef,
    },
  );

  if (isLoading || !user) {
    return (
      <div className="w-full col-span-1 min-h-62.5 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-6 animate-pulse" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full col-span-1 min-h-62.5 bg-white select-none dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-6 relative flex flex-col justify-between transition-colors duration-300 overflow-hidden"
    >
      {/* Background layer for ambient purple glow */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/10 rounded-full blur-[80px]" />
      </div>

      {/* 🌟 CINEMATIC LEVEL UP OVERLAY MASK */}
      <div
        ref={levelOverlayRef}
        style={{ display: "none" }}
        className="absolute inset-0 z-30 opacity-0 flex flex-col items-center justify-center pointer-events-none select-none p-6"
      >
        <div
          ref={flashOverlayRef}
          className="absolute inset-0 bg-white dark:bg-purple-500 rounded-2xl opacity-0 mix-blend-overlay pointer-events-none"
        />
        <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[10px] tracking-widest mb-1.5 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Stage Ascended</span>
        </div>

        {/* Counter Number Clipping Frame */}
        <div className="relative h-24 w-full flex items-center justify-center overflow-hidden">
          <div
            ref={oldNumRef}
            className="absolute text-7xl sm:text-8xl font-black font-mono text-slate-400 dark:text-zinc-600"
          >
            {renderLevel}
          </div>
          <div
            ref={newNumRef}
            className="absolute text-7xl sm:text-8xl font-black font-mono bg-linear-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg opacity-0"
          >
            {user.level}
          </div>
        </div>
      </div>

      {/* Primary Content Base View Layer */}
      <div
        ref={mainContentRef}
        className="relative z-10 flex flex-col h-full gap-6"
      >
        <div className="flex justify-between items-center w-full">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1e] dark:hover:bg-[#222226] border border-slate-200 dark:border-[#222226] text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors focus:outline-none"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add</span>
            </button>

            {isAddMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-xl shadow-lg p-1.5 flex flex-col gap-1 z-20 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    onAddGoal();
                    setIsAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-[#818CF8] rounded-lg text-xs font-medium transition-colors text-left"
                >
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span>Add Goal</span>
                </button>
                <button
                  onClick={() => {
                    onAddTask();
                    setIsAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-2 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-purple-600 dark:text-[#A855F7] rounded-lg text-xs font-medium transition-colors text-left"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Add Task</span>
                </button>
                <Link href={"/habits/create"}>
                <button
                  onClick={() => {
                    onAddHabit();
                    setIsAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-[#34D399] rounded-lg text-xs font-medium transition-colors text-left"
                >
                  <Flame className="w-3.5 h-3.5 shrink-0" />
                  <span>Add Habit</span>
                </button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Stage
            </span>
            <span className="text-sm text-slate-900 dark:text-white font-bold font-mono">
              {renderLevel}
            </span>
          </div>
        </div>

        <div className="flex flex-col mt-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-[#818CF8]" />
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              Phase
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {displayTitle}
          </h2>
        </div>

        <div className="w-full mt-auto">
          <div className="flex items-center justify-between mb-1.5 select-none">
            <div className="flex items-center gap-1.5">
              {isValidating ? (
                <StaticLoadingZap />
              ) : (
                <Zap className="w-3.5 h-3.5 text-purple-500 dark:text-[#A855F7]" />
              )}{" "}
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                XP Progress
              </span>
            </div>

            <span
              ref={textRef}
              className="text-xs text-indigo-500 dark:text-[#818CF8] font-mono font-bold tracking-wider"
            >
              0%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-[#141416] border border-slate-200/60 dark:border-[#222226] rounded-full overflow-hidden relative">
            <div
              ref={barRef}
              className="h-full bg-linear-to-r from-[#6366F1] to-[#A855F7] rounded-full relative w-0 will-change-[width]"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
            </div>
          </div>

          <div className="flex justify-between text-xs mt-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">
              {Math.round(renderXp)} XP
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">
              {levelMaxTargetXp} XP
            </span>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `,
        }}
      />
    </div>
  );
}
