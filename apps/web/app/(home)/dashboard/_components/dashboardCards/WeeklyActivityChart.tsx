"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useWeeklyActivity } from "@/core/hooks/useWeeklyActivity";

export default function WeeklyActivityChart() {
  const { weeklyData, isLoading } = useWeeklyActivity();

  return (
    <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 transition-colors duration-300 w-full h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-slate-900 dark:text-white">
          Weekly Activity
        </h2>
        {isLoading && (
          <span className="text-[10px] text-slate-400 animate-pulse font-mono">
            Updating...
          </span>
        )}
      </div>
      <div className="flex-1 w-full h-full min-h-0 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weeklyData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-200 dark:stroke-white/5"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b" }} // slate-500
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b" }}
            />
            <RechartsTooltip
              cursor={{ fill: "rgba(168, 85, 247, 0.05)" }}
              contentStyle={{
                backgroundColor: "#0A0A0C",
                borderColor: "#222226",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="tasks"
              name="Tasks"
              stroke="#6366F1"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="habits"
              name="Habits"
              stroke="#A855F7"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
