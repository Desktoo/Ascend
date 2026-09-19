"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Trash2,
  Pause,
  Play,
  ArrowUpRight,
} from "lucide-react";
import { gsap } from "gsap";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useHabitDetails } from "@/core/hooks/useHabits";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HabitsCardProps {
  id: string;
  title: string;
  currentStreak: number;
  bestStreak: number;
  consistency: number;
  initialIsActive: boolean;
  onNavigateDetail?: (id: string) => void;
}


export default function HabitsCard({
  id,
  title,
  currentStreak,
  bestStreak,
  consistency,
  initialIsActive,
}: HabitsCardProps) {
  const [isActiveState, setIsActiveState] = useState(initialIsActive);
  const [showMenu, setShowMenu] = useState(false);

  const router = useRouter()

  const streakTextRef = useRef<HTMLSpanElement>(null);
  const consistencyTextRef = useRef<HTMLSpanElement>(null);
  const countTargets = useRef({ streak: 0, consistency: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { toggleHabitState, deleteHabit } = useHabitDetails(id);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isActiveState) return;

    const ctx = gsap.context(() => {
      gsap.to(countTargets.current, {
        streak: currentStreak,
        consistency: consistency,
        duration: 1.2,
        ease: "power3.out",
        onUpdate: () => {
          if (streakTextRef.current) {
            streakTextRef.current.innerText = String(Math.round(countTargets.current.streak));
          }
          if (consistencyTextRef.current) {
            consistencyTextRef.current.innerText = `${Math.round(countTargets.current.consistency)}%`;
          }
        },
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.45,
          scale: 1.05,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      gsap.fromTo(
        ".momentum-pip",
        { scaleY: 0.3, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out", delay: 0.3 }
      );
    }, menuRef);

    return () => ctx.revert();
  }, [currentStreak, consistency, isActiveState]);

  const handleToggleActiveState = async () => {
    try {
      const nextState = !isActiveState;
      setIsActiveState(nextState);
      setShowMenu(false);
      await toggleHabitState();
    } catch (err) {
      toast.error("Failed to update habit state. Please try again.");
      console.error("Failed to mutate active tracking state status metric updates:", err);
    }
  };

  const handleHabitDelete = async () => {
    await deleteHabit();
  };


  return (
    <AlertDialog>
      <div
        className={`group relative flex min-h-80 w-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#1c1924] bg-gradient-to-b from-[#15101b] via-[#0d0d10] to-[#09090b] p-4 text-slate-200 shadow-2xl transition-all duration-500 ease-out hover:scale-[1.03] hover:border-purple-500/30 lg:col-span-1 ${
          !isActiveState ? "select-none opacity-30" : ""
        }`}
        style={{ fontFamily: "var(--font-body, 'Inter', sans-serif)" }}
      >
        {/* GLOBAL AMBIENT BACKDROP HARDWARE GLOW */}
        {isActiveState && (
          <div
            ref={glowRef}
            className="pointer-events-none absolute -inset-4 z-0 rounded-[28px] bg-linear-to-tr from-purple-500/5 to-indigo-500/5 opacity-30 blur-2xl mix-blend-screen shadow-[inset_0_0_40px_rgba(139,92,246,0.08)]"
          />
        )}

        {/* HEADER SECTION */}
        <div className="relative z-10 flex select-none items-start justify-between ">
          <div className="max-w-[70%] space-y-1">
            <span
              className={`flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider ${
                isActiveState ? "text-purple-400" : "text-zinc-600"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActiveState ? "bg-purple-400" : "bg-zinc-400"}`} /> 
              {isActiveState ? "Active Habit" : "Paused Habit"}
            </span>
            <h3 className="line-clamp-1 text-xl font-medium tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-purple-300">
              {title}
            </h3>
          </div>

          {/* ACTIONS INTERACTION BUTTON HUB */}
          <div className="flex select-none items-center gap-1.5">
            <Link
              href={`/habits/${id}`}
              prefetch={false}
              onClick={() => router.prefetch(`/habits/${id}`)}
              className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-white/5 hover:text-purple-300"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-white/5 hover:text-zinc-300"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-50 flex w-32 flex-col gap-1 rounded-xl border border-[#232328] bg-[#121215] p-1.5 shadow-xl">
                  <button
                    type="button"
                    onClick={handleToggleActiveState}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                  >
                    {isActiveState ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {isActiveState ? "Pause" : "Resume"}
                  </button>

                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-rose-400 transition-all hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </AlertDialogTrigger>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTRAL METRIC AREA */}
        <div className="relative  my-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
            Day Streak
          </span>
          <span
            ref={streakTextRef}
            className={`text-8xl font-semibold tracking-tighter drop-shadow-md select-none leading-none my-1 ${
              !isActiveState
                ? "text-zinc-700"
                : "bg-linear-to-b from-white via-zinc-200 to-zinc-500/80 bg-clip-text text-transparent font-sans"
            }`}
            style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}
          >
            {!isActiveState ? currentStreak : 0}
          </span>

         
        </div>

        {/* FOOTER DATA LAYOUT PANEL */}
        <div className="relative z-10 grid grid-cols-2 gap-4 pt-2 text-xs">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="flex flex-col">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                Best
              </span>
              <span
                className="text-xs font-semibold text-zinc-300"
                style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" }}
              >
                {bestStreak} days
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-1 py-1 justify-end">
            <div className="min-w-0">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                Stability
              </span>
              <span
                ref={consistencyTextRef}
                className="text-xs font-semibold text-purple-400"
                style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" }}
              >
                {!isActiveState ? `${consistency}%` : "0%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION OVERLAY BOUNDS */}
      <AlertDialogContent className="rounded-2xl border-0 bg-[#0c0c0e] p-6 text-slate-200 shadow-2xl focus:outline-none">
        <AlertDialogHeader className="flex flex-col items-center space-y-1 text-center">
          <AlertDialogTitle className="text-xl font-medium tracking-tight text-white/80 line-clamp-1">
            Don&apos;t break your momentum!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-zinc-400/60 font-semibold">
            You&apos;ve maintained a steady{" "}
            <strong className="text-orange-500 font-bold text-sm">{currentStreak}-day streak</strong> for{" "}
            <span className="font-medium text-zinc-200 text-sm">&quot;{title}&quot;</span>. Are you sure you want to
            delete this habit track?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex items-center gap-3 bg-transparent">
          <AlertDialogCancel className="mt-0 w-full flex-1 cursor-pointer border-none shadow-[inset_0_0_35px_rgba(100,100,100,0.4)] rounded-full bg-transparent px-4 py-2 text-xs font-semibold text-zinc-300 transition-all hover:bg-[#2e2e36] hover:text-white">
            Keep going
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleHabitDelete}
            className="w-full flex-1 cursor-pointer rounded-full border-none shadow-[inset_0_0_35px_rgba(255,0,0,0.4)] bg-transparent px-4 py-2 text-xs font-semibold text-white   transition-all hover:bg-rose-600/40"
          >
            Delete Habit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}