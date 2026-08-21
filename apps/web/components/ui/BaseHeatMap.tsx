import React, { useEffect, useState } from "react";
import { ActivityCalendar, ThemeInput } from "react-activity-calendar";

export interface HeatmapActivity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface BaseHeatmapProps {
  data: HeatmapActivity[];
  theme: ThemeInput;
  totalLabel: string;
  onSquareHover?: (date: string, count: number, event: React.MouseEvent) => void;
  onSquareClick?: (date: string, count: number) => void;
}

export default function BaseHeatmap({
  data,
  theme,
  totalLabel,
  onSquareHover,
  onSquareClick,
}: BaseHeatmapProps) {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setColorScheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const currentIsDark = document.documentElement.classList.contains("dark");
      setColorScheme(currentIsDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    // NOTE: intentionally colorless beyond neutral chrome — `theme` (passed in
    // per-instance) owns every hue here, so any caller can drop in its own
    // accent color without fighting this component. Only the neutral shell
    // moved to match the rest of the app's near-black card family; nothing
    // consumer-specific was added.
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-[#1A1A1D] dark:bg-[#101012]">
      <div
        className="flex w-full items-center justify-center overflow-x-auto pb-2 text-slate-500 dark:text-slate-500 lg:justify-start"
        style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)", fontSize: 11 }}
      >
        {data.length > 0 && (
          <ActivityCalendar
            data={data}
            colorScheme={colorScheme}
            theme={theme}
            labels={{
              legend: { less: "Less", more: "More" },
              totalCount: totalLabel,
            }}
            showWeekdayLabels={true}
            blockSize={12}
            blockMargin={5}
            blockRadius={3}
            fontSize={11}
            // FIX: Safely clone the SVG block and inject the mouse handlers directly onto it
            renderBlock={(block, activity) =>
              React.cloneElement(block, {
                onClick: () => onSquareClick?.(activity.date, activity.count),
                onMouseEnter: (e: React.MouseEvent) => onSquareHover?.(activity.date, activity.count, e),
                style: { ...block.props.style, cursor: "pointer" }, // Makes it clear cells are interactive
              })
            }
          />
        )}
      </div>
    </div>
  );
}