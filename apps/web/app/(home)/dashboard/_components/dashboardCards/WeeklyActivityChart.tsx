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

const data = [
  { name: "Mon", tasks: 6, habits: 3 },
  { name: "Tue", tasks: 8, habits: 4 },
  { name: "Wed", tasks: 5, habits: 2 },
  { name: "Thu", tasks: 9, habits: 5 },
  { name: "Fri", tasks: 4, habits: 3 },
  { name: "Sat", tasks: 2, habits: 1 },
  { name: "Sun", tasks: 3, habits: 2 },
];

export default function WeeklyActivityChart() {
  return (
    <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 transition-colors duration-300 w-full h-[300px] flex flex-col">
      <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
        Weekly Activity
      </h2>
      <div className="flex-1 w-full h-full min-h-0 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
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
