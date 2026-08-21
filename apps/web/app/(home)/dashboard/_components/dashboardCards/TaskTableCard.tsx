"use client";

import React, { useState, useRef } from "react";
import { useSWRConfig } from "swr";
import {
  Circle,
  CheckCircle2,
  ArrowUpDown,
  Flame,
  Clock,
  ChevronDown,
} from "lucide-react";
import { apiClient } from "@/core/services/client";
import TaskTableSkeleton from "../skeletons/tasktable.skeleton";
import useDashboardTasks, {
  DashboardResponse,
  Task,
} from "@/core/hooks/useDashboardTasks";
import useUserProfile from "@/core/hooks/useUserProfile";
import {
  getTaskXp,
  getXpRequiredForNextLevel,
  TASK_XP,
} from "@/core/utils/xp-rules";

type SortOption =
  | "PRIORITY_DESC"
  | "PRIORITY_ASC"
  | "TIME_ASC"
  | "TIME_DESC"
  | "DEFAULT";

export default function TaskTableCard() {
  const { mutate } = useSWRConfig();
  const [currentSort, setCurrentSort] = useState<SortOption>("DEFAULT");
  const [sortOpen, setSortOpen] = useState(false);

  // ⚡ CHANGE 1: Create an in-flight task queue reference.
  // Using a useRef Set ensures task IDs in flight persist across re-renders without triggering unnecessary renders.
  const activeTaskQueue = useRef<Set<string>>(new Set());

  const { user } = useUserProfile();
  const {
    todayTasks,
    abandonedTasks,
    isLoading,
    dashboardUrl,
    globalInvalidate,
  } = useDashboardTasks();

  const handleTaskToggle = async (taskId: string) => {
    // ⚡ CHANGE 2: Queue Guard — If this specific taskId is currently being processed by the network, block execution immediately.
    if (activeTaskQueue.current.has(taskId)) return;

    const targetTask = todayTasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    // Add taskId to the in-flight processing queue
    activeTaskQueue.current.add(taskId);

    // Optimistically update today's task state
    const optimisticTasks = todayTasks.map((t) =>
      t.id === taskId ? { ...t, status: "DONE" as const } : t,
    );

    const optimizedData: DashboardResponse = {
      todaysTasks: optimisticTasks,
      abandonedTasks,
    };

    // ⚡ CHANGE 3: Apply instant optimistic cache mutation to SWR without retriggering immediate server revalidation (pass false)
    mutate(dashboardUrl, optimizedData, false);

    if (user) {
      const baseWeight = TASK_XP[targetTask.priority] || TASK_XP.MEDIUM;
      const pointsGained = getTaskXp(user.level, baseWeight);

      let nextXp = user.xp + pointsGained;
      let nextLevel = user.level;
      let targetThreshold = getXpRequiredForNextLevel(nextLevel);

      while (nextXp >= targetThreshold) {
        nextXp -= targetThreshold;
        nextLevel += 1;
        targetThreshold = getXpRequiredForNextLevel(nextLevel);
      }

      mutate("/user/profile", { ...user, xp: nextXp, level: nextLevel }, false);
    }

    try {
      // ⚡ CHANGE 4: Await single task completion patch operation
      await apiClient(`/tasks/${taskId}/complete`, { method: "PATCH" });

      console.time("🚀 Cache Mutation Core");
      
      // ⚡ CHANGE 5: Run SWR revalidations concurrently using Promise.all to prevent sequential network request flooding
      await Promise.all([
        globalInvalidate(),
        mutate("/tasks"),
        mutate("/user/profile"),
      ]);

      console.timeEnd("🚀 Cache Mutation Core");
    } catch (err) {
      console.error("Task completion toggle execution failure:", err);
      // Revert optimistic cache states on error
      mutate(dashboardUrl);
      mutate("/user/profile");
    } finally {
      // ⚡ CHANGE 6: Always dequeue task from active queue so user can interact again if necessary
      activeTaskQueue.current.delete(taskId);
    }
  };

  const getSortedTasks = (): Task[] => {
    const tasksCopy = [...todayTasks];
    const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    tasksCopy.sort((a, b) => {
      if (a.status === "PENDING" && b.status === "DONE") return -1;
      if (a.status === "DONE" && b.status === "PENDING") return 1;

      switch (currentSort) {
        case "PRIORITY_DESC":
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        case "PRIORITY_ASC":
          return priorityWeight[a.priority] - priorityWeight[b.priority];
        case "TIME_ASC":
          return new Date(a.dueTime).getTime() - new Date(b.dueTime).getTime();
        case "TIME_DESC":
          return new Date(b.dueTime).getTime() - new Date(a.dueTime).getTime();
        default:
          return 0;
      }
    });

    return tasksCopy;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "HIGH") return "text-rose-500";
    if (priority === "MEDIUM") return "text-amber-500";
    return "text-emerald-500";
  };

  if (isLoading) return <TaskTableSkeleton />;

  const sortedTasks = getSortedTasks();

  return (
    /* 1. Main Card Bounding Box: Added 'min-h-0' to clamp its dimension layout */
    <div className="h-full w-full lg:col-span-1 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 flex flex-col min-h-0 overflow-hidden transition-colors duration-300">
      
      {/* ── Header Section ── */}
      <div className="flex items-center justify-between mb-4 select-none shrink-0">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-[#A855F7]" />
          Today&apos;s Priorities
        </h2>

        {/* Sorting Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium tracking-wide border transition-all focus:outline-none select-none
              ${
                sortOpen
                  ? "bg-indigo-600/10 dark:bg-[#A855F7]/10 border-indigo-500/40 dark:border-[#A855F7]/40 text-indigo-600 dark:text-[#A855F7]"
                  : "bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
              }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>Sort Tasks</span>
            <ChevronDown
              className={`w-3 h-3 text-slate-500 transition-transform duration-200 ease-in-out ${sortOpen ? "rotate-180 text-indigo-500 dark:text-[#A855F7]" : ""}`}
            />
          </button>

          {sortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#161619] border border-slate-800 rounded-xl p-1 shadow-xl z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => {
                    setCurrentSort("PRIORITY_DESC");
                    setSortOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] rounded-lg transition-colors ${currentSort === "PRIORITY_DESC" ? "bg-purple-500/10 text-purple-400" : "text-slate-400 hover:bg-white/5"}`}
                >
                  <Flame className="w-3 h-3" /> Priority: High → Low
                </button>
                <button
                  onClick={() => {
                    setCurrentSort("PRIORITY_ASC");
                    setSortOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] rounded-lg transition-colors ${currentSort === "PRIORITY_ASC" ? "bg-purple-500/10 text-purple-400" : "text-slate-400 hover:bg-white/5"}`}
                >
                  <Flame className="w-3 h-3" /> Priority: Low → High
                </button>
                <button
                  onClick={() => {
                    setCurrentSort("TIME_ASC");
                    setSortOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] rounded-lg transition-colors ${currentSort === "TIME_ASC" ? "bg-purple-500/10 text-purple-400" : "text-slate-400 hover:bg-white/5"}`}
                >
                  <Clock className="w-3 h-3" /> Time: Earliest First
                </button>
                <button
                  onClick={() => {
                    setCurrentSort("TIME_DESC");
                    setSortOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11px] rounded-lg transition-colors ${currentSort === "TIME_DESC" ? "bg-purple-500/10 text-purple-400" : "text-slate-400 hover:bg-white/5"}`}
                >
                  <Clock className="w-3 h-3" /> Time: Latest First
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 2. Scrollable Tasks Listing Viewport ── */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {sortedTasks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No active objectives listed for today.
          </div>
        ) : (
          sortedTasks.map((task) => {
            const isDone = task.status === "DONE";

            return (
              <div
                key={task.id}
                onClick={() => !isDone && handleTaskToggle(task.id)}
                className={`flex items-center justify-between px-3 py-2 border rounded-lg transition-all duration-300 group ${
                  isDone
                    ? "bg-slate-50 dark:bg-white/1 border-transparent opacity-45 select-none"
                    : "bg-slate-50 dark:bg-[#0A0A0C] border-slate-200 dark:border-[#222226] hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-[#A855F7]" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-[#A855F7] transition-colors" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-xs font-medium truncate ${isDone ? "text-slate-500 line-through decoration-slate-500/50" : "text-slate-700 dark:text-slate-300"}`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans tracking-wide">
                      {formatDueTime(task.dueTime)}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase tracking-wide font-mono shrink-0 ${isDone ? "text-slate-500" : getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatDueTime(isoString: string) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Today";
  }
}