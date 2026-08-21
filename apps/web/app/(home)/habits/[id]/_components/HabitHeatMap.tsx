// components/SingleHabitHeatmap.tsx
import BaseHeatmap, { HeatmapActivity } from "@/components/ui/BaseHeatMap";

interface SingleHabitHeatmapProps {
  habitData: HeatmapActivity[];
  habitColor: string;
}

export function SingleHabitHeatmap({
  habitData,
  habitColor,
}: SingleHabitHeatmapProps) {
  const habitTheme = {
    light: [
      "#f1f5f9",
      habitColor + "22",
      habitColor + "55",
      habitColor + "AA",
      habitColor,
    ],
    dark: [
      "#1A1A1E",
      habitColor + "22",
      habitColor + "55",
      habitColor + "99",
      habitColor,
    ],
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: habitColor, boxShadow: `0 0 8px 1px ${habitColor}66` }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
          style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" }}
        >
          Yearly activity
        </span>
      </div>
      <BaseHeatmap
        data={habitData}
        theme={habitTheme}
        totalLabel="Completed {{count}} times"
      />
    </div>
  );
}