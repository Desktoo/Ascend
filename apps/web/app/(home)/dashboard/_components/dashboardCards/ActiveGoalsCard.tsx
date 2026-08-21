"use client";

export default function ActiveGoalsCard() {
  const goals = [
    {
      title: "Build Coding Platform",
      progress: 63,
      color: "bg-gradient-to-tr from-[#6366F1] to-[#A855F7]",
    },
    { title: "Improve DSA", progress: 40, color: "bg-[#818CF8]" },
    { title: "Learn NestJS", progress: 72, color: "bg-[#6366F1]" },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222226] rounded-2xl p-5 flex flex-col justify-between transition-colors duration-300">
      <div>
        <h2 className="text-sm font-medium text-slate-900 dark:text-white mb-5">
          Active Goals
        </h2>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.title} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {goal.title}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  {goal.progress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-[#0A0A0C] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div
                  className={`h-full ${goal.color} rounded-full transition-all duration-500`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="w-full text-center text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-6 pt-3 border-t border-slate-200 dark:border-[#222226] hover:text-slate-900 dark:hover:text-white transition-colors">
        Manage Goals
      </button>
    </div>
  );
}
