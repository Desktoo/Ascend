"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useObjectiveDetail, useObjectiveTaskLogs } from "@/core/hooks/useObjective";
import HeaderCard from "./_components/HeaderCard";
import TimelineCard from "./_components/TimeLineCard";
import ProgressCard from "./_components/ProgressCard";
import ObjectiveDetailSkeleton from "./_components/LoadingSkeleton";
import ObjectiveDetailErrorState from "./_components/ErrorState";

gsap.registerPlugin(useGSAP);

export default function ObjectiveDetailPage() {
  const params = useParams();
  const goalId = params?.id as string;

  const { goal, isLoading, isError, mutate } = useObjectiveDetail(goalId);
  const { goalTaskLog } = useObjectiveTaskLogs(goalId);
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (goal) {
        gsap.from(".workspace-block", {
          opacity: 0,
          y: 14,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        });
      }
    },
    { scope: pageRef, dependencies: [goal] }
  );

  // 1. Loading State
  if (isLoading) {
    return <ObjectiveDetailSkeleton />;
  }

  // 2. Error / Not Found State
  if (isError || !goal) {
    return <ObjectiveDetailErrorState onRetry={() => mutate()} />;
  }

  // 3. Workspace View
  return (
    <div
      ref={pageRef}
      className="relative mx-auto min-h-screen w-full max-w-7xl overflow-hidden bg-slate-50 p-6 text-slate-900 transition-colors duration-300 dark:bg-[#08080A] dark:text-slate-200 lg:p-8"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-mono-data: 'JetBrains Mono', monospace;
          --font-body: 'Inter', sans-serif;
        }
      `}</style>

      {/* Ambient Radial Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-[#8B5CF6]/[0.08] blur-[120px]" />

      <div className="relative z-10 space-y-6">
        {/* Navigation Bar */}
        <div className="flex select-none items-center gap-2">
          <Link href="/objectives" passHref>
            <button className="-ml-2 flex items-center gap-2 rounded-xl p-2 text-slate-400 transition-all hover:bg-white/5 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span
                className="text-xs"
                style={{ fontFamily: "var(--font-mono-data)" }}
              >
                Back to Objectives
              </span>
            </button>
          </Link>
        </div>

        {/* Unified Grid Workspace */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          <div className="workspace-block lg:col-span-6">
            <HeaderCard goal={goal} />
          </div>

          <div className="workspace-block h-full lg:col-span-4">
            <TimelineCard goal={goal} taskLogs={goalTaskLog} />
          </div>

          <div className="workspace-block lg:col-span-2">
            <ProgressCard
              velocity={goal.currentVelocity}
              progressPercent={goal.currentProgress}
              completedDays={goal.completedDays}
              targetDays={goal.targetDays}
            />
          </div>
        </div>
      </div>
    </div>
  );
}