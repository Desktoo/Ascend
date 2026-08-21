"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Calendar, Clock, Flame, Gift } from "lucide-react";
import { GoalDetailResponse } from "@/core/types/objective.types";
import GoalSpeedometer from "./GoalSpeedoMeter";
import RewardModal from "./RewardModal";

gsap.registerPlugin(useGSAP);

const mono = {
  fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)",
};
const display = {
  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
};

export default function HeaderCard({ goal }: { goal: GoalDetailResponse }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { scope: cardRef },
  );

  const formattedStartDate = new Date(goal.startDate).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    },
  );

  const stats = [
    { icon: Calendar, label: "Commenced", value: formattedStartDate },
    {
      icon: Flame,
      label: "Active Days",
      value: `${goal.completedDays} / ${goal.targetDays} Days`,
    },
    {
      icon: Clock,
      label: "Sprint Config",
      value: `${goal.configeDaysPerWeek} Days/week`,
    },
  ];

  return (
    <>
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-[#1C1924] bg-gradient-to-b from-[#15101B] via-[#0D0D10] to-[#09090B] p-6 text-slate-200 shadow-2xl sm:p-7"
      >
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#8B5CF6]/10 blur-[100px]" />

        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex w-fit items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-purple-400"
                    style={mono}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {goal.timeFrame}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      goal.status === "ACTIVE"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-purple-500/30 bg-purple-500/10 text-purple-300"
                    }`}
                    style={mono}
                  >
                    {goal.status}
                  </span>
                </div>
              </div>

              <h1
                className="text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl"
                style={display}
              >
                {goal.title}
              </h1>

              <p className="max-w-2xl text-sm font-light leading-relaxed text-slate-400">
                {goal.description ||
                  "No description provided for this objective blueprint."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-purple-500/10 pt-5">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className="h-3 w-3 text-slate-500"
                      strokeWidth={2.5}
                    />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                      style={mono}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    className="mt-1 text-xs font-medium text-slate-300"
                    style={mono}
                  >
                    {value}
                  </span>
                </div>
              ))}
              <button
                onClick={() => setIsRewardModalOpen(true)}
                className="group flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 transition-all hover:scale-105 hover:border-purple-400 hover:bg-purple-500/20 shadow-[0_0_12px_rgba(139,92,246,0.2)] cursor-pointer"
              >
                <Gift className="h-3.5 w-3.5 text-purple-400 transition-transform group-hover:rotate-12" />
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-4">
            <GoalSpeedometer velocity={goal.currentVelocity || 0} />
          </div>
        </div>
      </div>

      {/* Render Portal Component outside Header CardDOM */}
      <RewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        goal={goal}
      />
    </>
  );
}
