"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowLeft, Loader2, Target } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useObjectiveDetail, useObjectiveTaskLogs } from "@/core/hooks/useObjective";
import GoalRoadmap from "../_components/GoalRoadmap";

gsap.registerPlugin(useGSAP);

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

export default function ObjectiveDetailPage() {
  const params = useParams();
  const goalId = params?.id as string;
  const { goal, isLoading, isError } = useObjectiveDetail(goalId);
  const { goalTaskLog } = useObjectiveTaskLogs(goalId)

  console.log("goalTaskLog", goalTaskLog);
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (goal) {
        gsap.from(".detail-animate", {
          opacity: 0,
          y: 12,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
        });
      }
    },
    { scope: pageRef, dependencies: [goal] }
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#08080A] text-purple-400">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <span className="text-sm font-mono uppercase tracking-widest text-zinc-400">
          Loading Blueprint Details...
        </span>
      </div>
    );
  }

  if (isError || !goal) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#08080A] text-rose-400">
        <p className="text-base font-semibold">Objective blueprint not found.</p>
        <Link href="/objectives" className="mt-4 text-xs font-mono text-purple-400 hover:underline">
          ← Return to Objectives Hub
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="relative mx-auto min-h-screen w-full max-w-7xl overflow-hidden bg-[#08080A] p-6 text-slate-200 lg:p-8"
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-96 w-150 -translate-x-1/2 rounded-full bg-[#8B5CF6]/8 blur-[120px]" />

      <div className="relative z-10 space-y-6">
        {/* Navigation Bar */}
        <div className="detail-animate flex items-center justify-between">
          <Link href={`/objectives/${goalId}`}>
            <button className="-ml-2 flex items-center gap-2 rounded-xl p-2 text-slate-400 transition-all hover:bg-white/5 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs" style={mono}>
                Back to Objective Dashboard
              </span>
            </button>
          </Link>

          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-300" style={mono}>
            Goal ID: {goal.id.slice(0, 8)}...
          </span>
        </div>

        {/* SINGLE Hero Header */}
        <div className="detail-animate border-b border-purple-500/10 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400" style={mono}>
            <Target className="h-4 w-4" />
            Execution Blueprint Details
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl" style={display}>
            {goal.title}
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-light leading-relaxed text-slate-400">
            {goal.description || "Take lectures for the AI from the 100x Devs and execute daily tasks."}
          </p>
        </div>

        {/* Master Roadmap Section */}
        <div className="detail-animate w-full">
          <GoalRoadmap goal={goal} taskLogs={goalTaskLog ?? []} />
        </div>
      </div>
    </div>
  );
}