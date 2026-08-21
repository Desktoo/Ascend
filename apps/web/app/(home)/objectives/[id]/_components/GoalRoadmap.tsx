"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  Check,
  Clock,
  ChevronRight,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { GoalDetailResponse, TaskLog } from "@/core/types/objective.types";

gsap.registerPlugin(useGSAP);

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

interface GoalRoadmapProps {
  goal: GoalDetailResponse;
  taskLogs: TaskLog[];
}

export default function GoalRoadmap({ goal, taskLogs = [] }: GoalRoadmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const daysPerWeek = goal.configeDaysPerWeek || 6;
  const totalWeeks = Math.ceil(goal.targetDays / daysPerWeek);

  // Safely map task logs by dayNumber. Fall back to matching index if dayNumber is undefined.
  const taskLogMap = new Map<number, TaskLog>(
    taskLogs.map((log, index) => [log.dayNumber ?? index + 1, log])
  );

  const currentActiveWeek = Math.ceil((goal.completedDays + 1) / daysPerWeek);

  const [expandedWeek, setExpandedWeek] = useState<number | null>(currentActiveWeek);
  const [selectedTask, setSelectedTask] = useState<TaskLog | null>(() => {
    return taskLogMap.get(goal.completedDays + 1) || taskLogs[0] || null;
  });

  useGSAP(
    () => {
      gsap.from(".tree-week-card", {
        opacity: 0,
        y: 10,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  // Helper to format ISO UTC strings into local time (e.g., "08:00 PM")
  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // Fallback if already formatted string
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div ref={containerRef} className="w-full space-y-4">
      {/* Sleek Minimal Sub-Header Strip */}
      <div className="flex items-center justify-between rounded-xl border border-[#1C1924] bg-[#0C0B0F]/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300" style={display}>
          <span>Sprint & Task Architecture</span>
          <span className="text-slate-600">•</span>
          <span className="text-[10px] text-purple-400" style={mono}>
            {totalWeeks} Weeks Total
          </span>
        </div>

        <span
          className="flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-0.5 text-[10px] font-bold text-purple-300"
          style={mono}
        >
          <Sparkles className="h-3 w-3 text-purple-400" />
          {goal.completedDays} / {goal.targetDays} Days Complete
        </span>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Sprint Tree Nodes (7 cols) */}
        <div className="space-y-3 lg:col-span-7" data-lenis-prevent>
          {Array.from({ length: totalWeeks }).map((_, weekIdx) => {
            const weekNumber = weekIdx + 1;
            const isWeekExpanded = expandedWeek === weekNumber;

            const startDayNum = weekIdx * daysPerWeek + 1;
            const endDayNum = Math.min(startDayNum + daysPerWeek - 1, goal.targetDays);

            const isWeekActive = currentActiveWeek === weekNumber;

            return (
              <div
                key={weekNumber}
                className="tree-week-card overflow-hidden rounded-xl border border-[#1C1924] bg-[#0C0B0F]"
              >
                {/* Week Trigger */}
                <button
                  onClick={() => setExpandedWeek(isWeekExpanded ? null : weekNumber)}
                  className={`flex w-full items-center justify-between p-3.5 transition-colors ${
                    isWeekActive ? "bg-purple-950/20" : "hover:bg-purple-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ChevronRight
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        isWeekExpanded ? "rotate-90 text-purple-400" : ""
                      }`}
                    />
                    <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-300" style={mono}>
                      W{weekNumber}
                    </span>
                    <span className="text-xs font-semibold text-white" style={display}>
                      {goal.monthlyWeekSprints?.[weekIdx] || "Sprint Overview"}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500" style={mono}>
                    D{startDayNum} - D{endDayNum}
                  </span>
                </button>

                {/* Day Nodes */}
                {isWeekExpanded && (
                  <div className="space-y-2 border-t border-purple-500/10 bg-[#08080A] p-3">
                    {Array.from({ length: daysPerWeek }).map((_, dayIdx) => {
                      const dayNum = startDayNum + dayIdx;
                      if (dayNum > goal.targetDays) return null;

                      const task = taskLogMap.get(dayNum);
                      const isSelected = selectedTask?.dayNumber === dayNum;
                      const isDayDone =
                        task?.completionStatus === "ON_TIME" ||
                        task?.completionStatus === "LATE" ||
                        task?.status === "DONE" ||
                        dayNum <= goal.completedDays;

                      return (
                        <button
                          key={dayNum}
                          onClick={() => setSelectedTask(task || null)}
                          className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
                            isSelected
                              ? "border-purple-500/60 bg-purple-950/40 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                              : isDayDone
                              ? "border-emerald-500/20 bg-[#0B0E0C]/70 text-slate-300 hover:border-emerald-500/40"
                              : "border-zinc-800/80 bg-[#0C0C0F] text-slate-400 hover:border-purple-500/30"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-5 items-center justify-center rounded px-1.5 text-[10px] font-bold ${
                                isDayDone
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : isSelected
                                  ? "bg-purple-500 text-white"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                              style={mono}
                            >
                              D{dayNum}
                            </span>
                            <span className="max-w-45 truncate text-xs font-medium sm:max-w-xs">
                              {task?.taskTitle || "Task to be assigned"}
                            </span>
                          </div>

                          <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Task Detail Inspector Panel (5 cols) */}
        <div className="sticky top-6 rounded-2xl border border-[#1C1924] bg-[#0C0B0F] p-5 shadow-2xl lg:col-span-5">
          {selectedTask ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider" style={mono}>
                  DAY {goal.completedDays ?? "N/A"} DETAILS
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                    selectedTask.completionStatus === "ON_TIME" || selectedTask.completionStatus === "LATE" || selectedTask.status === "DONE"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border border-purple-500/30 bg-purple-500/10 text-purple-300"
                  }`}
                  style={mono}
                >
                  {selectedTask.completionStatus || selectedTask.status || "SCHEDULED"}
                </span>
              </div>

              <h3 className="text-base font-semibold leading-snug text-white" style={display}>
                {selectedTask.taskTitle}
              </h3>

              <div className="space-y-2.5 border-t border-purple-500/10 pt-3 text-xs text-slate-300" style={mono}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-slate-500">Scheduled:</span>
                  <span className="text-slate-200">{selectedTask.scheduledDate || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-slate-500">Due Time:</span>
                  <span className="text-slate-200">{formatTime(selectedTask.dueTime)}</span>
                </div>

                {selectedTask.completedAt && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    <span>Completed At: {formatTime(selectedTask.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500" style={mono}>
              Select a day node to inspect execution details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}