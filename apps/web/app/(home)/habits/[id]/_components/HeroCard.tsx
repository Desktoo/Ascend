"use client";

import React, { useEffect, useRef, useState } from "react";
import { Flame, Sparkles, Activity, Clock, Pause, Play, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import { HabitDetailsPageResponse } from "@/core/types/habits.types";

interface HeroCardProps {
  habit: HabitDetailsPageResponse;
  onToggleStatus: () => Promise<void>;
}

const ALL_DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const TODAY_LABEL = ALL_DAYS[(new Date().getDay() + 6) % 7]; // Mon-indexed

// Static class maps — Tailwind can't see runtime-built class strings like
// `bg-${var}`, so priority styling resolves to fixed literal classes.
const PRIORITY_STYLES: Record<string, { text: string; dot: string; border: string; wash: string }> = {
  HIGH: { text: "text-rose-400", dot: "bg-rose-400", border: "border-rose-400/40", wash: "bg-rose-400/10" },
  MEDIUM: { text: "text-amber-400", dot: "bg-amber-400", border: "border-amber-400/40", wash: "bg-amber-400/10" },
  LOW: { text: "text-emerald-400", dot: "bg-emerald-400", border: "border-emerald-400/40", wash: "bg-emerald-400/10" },
};

export default function HeroCard({ habit, onToggleStatus }: HeroCardProps) {
  const [isPending, setIsPending] = useState(false);
  const isActive = habit.isActive;
  const priorityStyle = PRIORITY_STYLES[habit.taskPriority] ?? PRIORITY_STYLES.MEDIUM;

  const cardRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<SVGSVGElement>(null);

  const handleToggle = async () => {
    try {
      setIsPending(true);
      await onToggleStatus();
    } catch (err) {
      console.error("Failed to sync status update:", err);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.from(cardRef.current, { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" });
      }

      // Punch the holes in, one by one, like a card feeding through a machine.
      gsap.fromTo(
        ".day-hole",
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, stagger: 0.06, ease: "back.out(2.2)", delay: 0.1 }
      );

      // Today gets stamped: a sharp pop-in, then a slow glow that never fully rests.
      if (isActive) {
        gsap.fromTo(
          ".day-hole-today .hole-stamp",
          { scale: 0, opacity: 0, rotate: -18 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1, 0.55)", delay: 0.55 }
        );
        gsap.to(".day-hole-today .hole-ring", {
          boxShadow: "0 0 0 6px rgba(139,92,246,0.18), 0 0 18px 2px rgba(168,85,247,0.4)",
          duration: 1.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.9,
        });
      }

      if (isActive && flameRef.current) {
        gsap.to(flameRef.current, {
          scale: 1.08,
          rotate: -3,
          transformOrigin: "50% 90%",
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [isActive, habit.id]);

  return (
    <div
      ref={cardRef}
      className={`relative w-full overflow-hidden rounded-[20px] border transition-opacity duration-300 ${
        isActive ? "border-[#232328] bg-[#101012]" : "border-[#1A1A1D] bg-[#0D0D0F] opacity-70"
      }`}
      style={{ fontFamily: "var(--font-body, 'Inter', sans-serif)" }}
    >
      {isActive && (
        <>
          <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-[#8B5CF6]/8 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#FB523C]/6 blur-[90px]" />
        </>
      )}


      <div className="relative z-10">
        {/* status row */}
        <div className="flex items-center justify-between px-6 pt-5">
          <span
            className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${
              isActive ? "text-[#A78BFA]" : "text-slate-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-[#A78BFA] shadow-[0_0_8px_2px_rgba(167,139,250,0.5)]" : "bg-slate-700"
              }`}
            />
            {isActive ? "Vitals steady" : "Paused"}
          </span>
          <span className="rounded-lg border border-[#232328] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {habit.tag}
          </span>
        </div>

        {/* identity + readouts */}
        <div className="flex flex-wrap items-start justify-between gap-6 px-6 pt-4">
          <div className="min-w-0 space-y-1.5">
            <h1
              className="truncate text-[32px] font-medium leading-tight tracking-tight text-white"
              style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}
            >
              {habit.title}
            </h1>
            <p className="line-clamp-1 max-w-md text-[13px] leading-relaxed text-slate-500">
              {habit.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-5 pt-1">
            <Readout
              icon={<Flame ref={flameRef} className="h-3.5 w-3.5 text-[#FB923C]" strokeWidth={2.5} />}
              value={habit.currentStreak}
              label="Streak"
            />
            <div className="h-8 w-px bg-[#232328]" />
            <Readout
              icon={<Sparkles className="h-3.5 w-3.5 text-[#C4B5FD]" strokeWidth={2.5} />}
              value={habit.longestStreak}
              label="Best"
            />
            <div className="h-8 w-px bg-[#232328]" />
            <Readout
              icon={<Activity className="h-3.5 w-3.5 text-[#A78BFA]" strokeWidth={2.5} />}
              value={`${habit.stabilityScore}%`}
              label="Stable"
            />
          </div>
        </div>

        {/* SIGNATURE: the week as a punch card — holes for scheduled days,
            today stamped in the same violet-to-purple gradient as the active
            sidebar tab, tying the card back to the app's own chrome. */}
        <div className="relative mt-6 px-6">
          <div className="pointer-events-none absolute left-6 right-6 top-1/3 h-px -translate-y-1/2 border-t border-dashed border-[#232328]" />
          <div className="relative flex items-center justify-between">
            {ALL_DAYS.map((day) => {
              const isScheduled = habit.daysOfWeek.includes(day);
              const isToday = day === TODAY_LABEL;
              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div
                    className={`day-hole ${isToday ? "day-hole-today" : ""} relative flex h-10 w-10 items-center justify-center rounded-full bg-[#101012]`}
                  >
                    <div
                      className={`hole-ring absolute inset-0 rounded-full border-2 transition-colors ${
                        isScheduled
                          ? isToday
                            ? "border-[#A855F7]"
                            : "border-[#8B5CF6]/60"
                          : "border-dashed border-[#26262B]"
                      }`}
                    />
                    <div
                      className={`h-6 w-6 rounded-full ${
                        isScheduled
                          ? "bg-[#08080A] shadow-[inset_0_2px_5px_rgba(0,0,0,0.85)]"
                          : "bg-transparent"
                      }`}
                    />
                    {isToday && (
                      <span className="hole-stamp absolute h-2.5 w-2.5 rounded-full bg-linear-to-br from-violet-400 to-purple-500 shadow-[0_0_10px_2px_rgba(168,85,247,0.6)]" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold tracking-wide ${
                      isToday ? "text-[#C4B5FD]" : isScheduled ? "text-slate-400" : "text-slate-700"
                    }`}
                    style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" }}
                  >
                    {day[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-6 mt-6 h-px bg-[#1C1C20]" />

        {/* task focus + action */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 ${priorityStyle.border} ${priorityStyle.wash}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wide ${priorityStyle.text}`}>
                {habit.taskPriority}
              </span>
            </span>
            <span className="truncate text-sm font-medium text-white/90">{habit.taskTitle}</span>
            <span className="shrink-0 text-slate-700">·</span>
            <span
              className="flex shrink-0 items-center gap-1 text-[12px] text-slate-500"
              style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" }}
            >
              <Clock className="h-3 w-3" /> {habit.taskDueTime}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`inline-flex min-w-[92px] shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
              isActive
                ? "text-slate-400 hover:bg-[#A855F7]/10 hover:text-[#C4B5FD]"
                : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_8px_24px_-8px_rgba(139,92,246,0.6)] hover:from-violet-500 hover:to-purple-500"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating
              </>
            ) : isActive ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Readout({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="text-right">
      <div className="flex items-center justify-end gap-1.5 text-white">
        {icon}
        <span
          className="text-xl font-semibold tabular-nums"
          style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" }}
        >
          {value}
        </span>
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}