// utils/heatmapTransformer.ts
import { HeatmapActivity } from "@/components/ui/BaseHeatMap";

interface BackendLog {
  yearMonth: string; // "2026-07"
  history: string;   // "SDDDSSSS..." (31 chars)
}

export function transformLogsToHeatmapData(backendLogs: BackendLog[]): HeatmapActivity[] {
  const transformedMap = new Map<string, HeatmapActivity>();

  // 1. Generate an explicit baseline array for a full calendar year rolling backwards
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const yearString = d.getFullYear();
    const monthString = String(d.getMonth() + 1).padStart(2, "0");
    const dayString = String(d.getDate()).padStart(2, "0");
    const isoString = `${yearString}-${monthString}-${dayString}`;

    transformedMap.set(isoString, {
      date: isoString,
      count: 0,
      level: 0,
    });
  }

  // 2. Map and overlay active historical completion blocks on top of the baseline
  backendLogs.forEach((log) => {
    const [year, month] = log.yearMonth.split("-").map(Number);

    for (let i = 0; i < log.history.length; i++) {
      const char = log.history[i];
      const dayNum = i + 1;

      // Ensure we don't handle invalid out-of-bounds padding values for shorter months (e.g., Feb 30)
      const dateInstance = new Date(year, month - 1, dayNum);
      if (dateInstance.getMonth() !== month - 1) continue;

      const dateString = `${log.yearMonth}-${String(dayNum).padStart(2, "0")}`;

      if (transformedMap.has(dateString)) {
        const isDone = char === "D";
        transformedMap.set(dateString, {
          date: dateString,
          count: isDone ? 1 : 0,
          level: isDone ? 4 : 0,
        });
      }
    }
  });

  // Return a sorted array ready for rendering
  return Array.from(transformedMap.values());
}