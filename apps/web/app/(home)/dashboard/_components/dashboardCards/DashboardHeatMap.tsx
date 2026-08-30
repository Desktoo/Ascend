// components/GlobalHeatmap.tsx

import BaseHeatmap from "@/components/ui/BaseHeatMap";

export default function DashboardHeatmap({ globalData }: { globalData?: any }) {
  const globalTheme = {
    light: ["#f1f5f9", "#e0e7ff", "#c7d2fe", "#818cf8", "#4f46e5"], // Blue/Indigo gradient
    dark: ["#1A1A1E", "#4f46e533", "#6366f180", "#818cf8", "#a855f7"],
  };

  const handleHover = async (date: string) => {
    // 1. Fetch exact timestamp analytics from DynamoDB endpoint for this date
    // 2. Populate your Tooltip/Popover UI state
  };

  return (
    <BaseHeatmap 
      data={globalData || []} 
      theme={globalTheme} 
      totalLabel="{{count}} habits completed overall" 
      onSquareHover={handleHover}
    />
  );
}

export { DashboardHeatmap };