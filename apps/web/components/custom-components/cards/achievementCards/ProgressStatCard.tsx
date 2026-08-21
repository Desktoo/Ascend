import React from "react";

interface ProgressStatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  iconColorClass: string;
}

export default function ProgressStatCard({
  title,
  value,
  icon: Icon,
  iconColorClass,
}: ProgressStatCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-900 bg-[#121214] flex items-center gap-4">
      <div className={`p-3 rounded-xl ${iconColorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
          {title}
        </span>
        <span className="text-xl font-black text-white font-mono">
          {value}
        </span>
      </div>
    </div>
  );
}