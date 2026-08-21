"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { GoalDetailResponse, TaskLog } from "@/core/types/objective.types";

gsap.registerPlugin(useGSAP);

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

interface TimelineCardProps {
  goal: GoalDetailResponse;
  taskLogs?: TaskLog[];
}

export default function TimelineCard({ goal, taskLogs = [] }: TimelineCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Map task logs by day number or array index for fast lookup
  const taskLogMap = new Map<number, TaskLog>(
    taskLogs.map((log, index) => [log.dayNumber ?? index + 1, log])
  );

  // Active day index matches the length of current logs or completed days
  const activeDayNumber = Math.max(1, Math.min(taskLogs.length, goal.targetDays));

  // Auto-scroll to current active day node
  useEffect(() => {
    if (activeNodeRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const node = activeNodeRef.current;
      const scrollLeft =
        node.offsetLeft - container.offsetWidth / 2 + node.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeDayNumber]);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  useGSAP(
    () => {
      gsap.from(".stepper-node", {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [taskLogs.length] }
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#1C1924] bg-linear-to-b from-[#15101B] via-[#0D0D10] to-[#09090B] p-6 text-slate-200 shadow-2xl"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-600/10 blur-[90px]" />

      {/* Header Area */}
      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <div>
            <span
              className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300"
              style={mono}
            >
              Day {goal.completedDays} / {goal.targetDays} Complete
            </span>
          </div>

          <h2 className="text-sm font-semibold tracking-wide text-white" style={display}>
            Progress Horizon Timeline
          </h2>
        </div>

        <Link href={`/objectives/${goal.id}/details`}>
          <button className="flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/20 hover:text-white cursor-pointer">
            <span style={mono}>View Details</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>

      {/* Horizontal Stepper Engine */}
      <div className="relative z-10 flex flex-1 items-center py-6">
        {/* Scroll Controls */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/30 bg-[#0E0C15]/90 text-purple-300 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-purple-600 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/30 bg-[#0E0C15]/90 text-purple-300 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-purple-600 hover:text-white cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Scrollable Track Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="scrollbar-none relative flex w-full  px-30 pt-20 items-center overflow-x-auto py-10"
        >
          {Array.from({ length: goal.targetDays }).map((_, index) => {
            const dayNum = index + 1;
            const log = taskLogMap.get(dayNum);

            const isDone =
              log?.completionStatus === "ON_TIME" ||
              log?.completionStatus === "LATE" ||
              dayNum <= goal.completedDays;

            // Day is unlocked only if a log exists for it or it is <= taskLogs.length
            const isUnlocked = dayNum <= Math.max(taskLogs.length, 1);
            const isCurrentActive = dayNum === activeDayNumber && !isDone;
            const isHovered = hoveredIndex === index;

            return (
              <React.Fragment key={dayNum}>
                {/* Connector Line Segment */}
                {index > 0 && (
                  <div
                    className={`h-0.5 min-w-12.5 flex-1 transition-colors duration-300 ${
                      dayNum <= goal.completedDays
                        ? "bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : isUnlocked
                        ? "bg-purple-500/50"
                        : "bg-zinc-800"
                    }`}
                  />
                )}

                {/* Stepper Dot Node */}
                <div
                  ref={isCurrentActive ? activeNodeRef : null}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="stepper-node relative flex flex-col items-center shrink-0 cursor-pointer"
                >
                  {/* Vertical Hover Line & Title Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 z-40 flex flex-col items-center animate-in fade-in zoom-in-95">
                      <div
                        className="rounded-lg border border-purple-500/30 bg-[#0E0B12] px-3 py-1.5 text-center shadow-xl backdrop-blur-md min-w-[120px]"
                        style={mono}
                      >
                        <div className="text-[10px] font-bold text-purple-300">
                          Day {dayNum}
                        </div>
                        <div className="max-w-40 truncate text-[11px] font-medium text-white">
                          {log?.taskTitle || (isUnlocked ? "Pending Execution" : "Locked")}
                        </div>
                      </div>
                      {/* Vertical Indicator Line */}
                      <div className="h-4 w-0.5 bg-purple-500/60" />
                    </div>
                  )}

                  {/* Circle Dot Badge */}
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isDone
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                        : isCurrentActive
                        ? "border-purple-400 bg-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.6)] animate-pulse"
                        : isUnlocked
                        ? "border-purple-500/40 bg-purple-950/30 text-purple-300"
                        : "border-zinc-800 bg-zinc-950 text-zinc-600"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold" style={mono}>
                        {dayNum}
                      </span>
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                  </div>

                  {/* Sub-label Under Dot */}
                  <div className="absolute top-10  flex flex-col items-center whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold ${
                        isDone
                          ? "text-emerald-400"
                          : isCurrentActive
                          ? "text-purple-300 font-bold"
                          : "text-zinc-500"
                      }`}
                      style={display}
                    >
                      {log?.taskTitle ? (
                        <span className="max-w-22.5 truncate block">
                          {log.taskTitle}
                        </span>
                      ) : (
                        `Day ${dayNum}`
                      )}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}