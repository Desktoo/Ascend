"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import HeaderCard from "@/app/(home)/dashboard/_components/dashboardCards/HeaderCard";
import TaskTableCard from "@/app/(home)/dashboard/_components/dashboardCards/TaskTableCard";
import ActiveGoalsCard from "@/app/(home)/dashboard/_components/dashboardCards/ActiveGoalsCard";
import HabitsTableCard from "@/app/(home)/dashboard/_components/dashboardCards/HabitsTableCard";
import GrowthVelocityCard from "@/app/(home)/dashboard/_components/dashboardCards/GrowthVelocityCard";
import WeeklyActivityChart from "@/app/(home)/dashboard/_components/dashboardCards/WeeklyActivityChart";
import DashboardOverlays, {
  ActiveModalType,
} from "./_components/DashboardOverlays";

import { useHabits } from "@/core/hooks/useHabits";
import HabitsTableSkeleton from "./_components/skeletons/HabitsTableSkeleton";
import { DashboardHeatmap } from "./_components/dashboardCards/DashboardHeatMap";
import useDashboardTasks from "@/core/hooks/useDashboardTasks";
import useReflectionTrigger from "@/core/hooks/useReflectionTrigger";
import RedesignedWeeklyCalendar from "@/components/custom-components/core/Calender";

export default function DashboardView() {
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

  const { isLoading: isHabitsLoading } = useHabits();
  const { isLoading: isTaskLoading } = useDashboardTasks()
   useReflectionTrigger({
    onTriggerReflection: () => setActiveModal("REFLECTION"),
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0A0A0C] text-slate-900 dark:text-slate-200 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto transition-colors duration-300">
      {/* ── Stable Dashboard Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-140 min-h-0">
        {/* Column 1: Today's Focus Objectives */}
        <div className="lg:h-full min-h-0 flex flex-col">
          {isTaskLoading ? (
            <div className="w-full h-full min-h-100 lg:h-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl animate-pulse p-5" />
          ) : (
            <TaskTableCard />
          )}
        </div>

        {/* Column 2: Header Management and Realtime Core Metrics */}
        <div className="gap-6 flex flex-col min-h-0">
          <HeaderCard
            onAddTask={() => setActiveModal("TASK")}
            onAddGoal={() => setActiveModal("GOAL")}
            onAddHabit={() => setActiveModal("HABIT")}
          />

          {isTaskLoading ? (
            <div className="w-full h-full min-h-50 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl animate-pulse" />
          ) : (
            <GrowthVelocityCard />
          )}
        </div>

        {/* Column 3: Secondary Timeline Operational Ledgers */}
        <div className="gap-6 flex flex-col min-h-0 flex-1">
          <ActiveGoalsCard />
          {isHabitsLoading ? (
            <>
              <div className="w-full flex-1 h-55 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl animate-pulse" />
            </>
          ) : (
            <>
              <HabitsTableCard />
            </>
          )}
        </div>
      </div>

      {/* ── Analytical Tracking Section ── */}
      {/* {isLoading ? (
        <div className="w-full h-[180px] bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl animate-pulse" />
      ) : (
        <DashboardHeatmap />
      )} */}

      {/* Summary Charts & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isTaskLoading ? (
          <div className="w-full h-70 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl animate-pulse" />
        ) : (
          <WeeklyActivityChart />
        )}

        <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 transition-colors duration-300">
          <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
            Insights
          </h2>
          <div className="space-y-3 text-xs text-slate-400 font-light leading-relaxed">
            <p>
              • You focus better between{" "}
              <span className="text-indigo-600 dark:text-[#818CF8] font-medium">
                10am–1pm
              </span>
              .
            </p>
            <p>• Habit consistency dropped slightly during weekends.</p>
          </div>
        </div>
      </div>

      {/* Feed Footer */}
      <div className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 transition-colors duration-300">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500" />
          Recent Activity
        </h2>
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <p className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-[#818CF8]">✓</span>{" "}
            Completed: Backend Authentication
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-[#818CF8]">✓</span>{" "}
            Completed: 2h Focus Session
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-[#818CF8]">✓</span> Added
            New Goal: Build Portfolio
          </p>
        </div>
      </div>
      <RedesignedWeeklyCalendar />

      {/* Decentralized Overlay Interface Layer */}
      <DashboardOverlays
        activeModal={activeModal}
        onCloseModal={() => setActiveModal(null)}
      />
    </div>
  );
}
