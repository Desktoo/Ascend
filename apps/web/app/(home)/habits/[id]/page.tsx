"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { gsap } from "gsap";
import HeroCard from "./_components/HeroCard";
import HabitSkeleton from "./_components/HabitSkeleton";
import HabitErrorState from "./_components/ErrorCard";
import { SingleHabitHeatmap } from "./_components/HabitHeatMap";
import { useHabitDetails, useHabitlogs } from "@/core/hooks/useHabits";

export default function HabitDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { habitDetails, isError, isLoading, toggleHabitState } = useHabitDetails(id);
  const { heatmapData, isLoading: isHeatmapLoading, error: heatmapError } = useHabitlogs(id);

  const glowRef = useRef<HTMLDivElement>(null);

  // Ambient background "breathes" slowly — a quiet cue that this is a living
  // tracker, not a static report. Kept subtle: opacity only, no layout shift.
  useEffect(() => {
    if (!glowRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        opacity: 0.55,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  if (isLoading || isHeatmapLoading) return <HabitSkeleton />;
  if (isError || heatmapError || !habitDetails) {
    return <HabitErrorState message={isError || heatmapError || "Habit data not found."} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#08080A] font-sans text-slate-200">
      {/* Self-contained type tokens — no shared file touched. Space Grotesk for
          identity/display, JetBrains Mono for data readouts, Inter for body. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-mono-data: 'JetBrains Mono', monospace;
          --font-body: 'Inter', sans-serif;
        }
      `}</style>

      {/* breathing ambient glow — violet, matching the app's sidebar accent */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#8B5CF6]/[0.06] opacity-30 blur-[120px]"
      />

      <div className="relative z-10 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* NAVIGATION BAR */}
          <div className="flex select-none items-center justify-between border-b border-[#1A1A1D] pb-4">
            <Link
              href="/habits"
              className="group flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-white/[0.03]"
            >
              <ArrowLeft className="h-4 w-4 text-slate-500 transition-colors group-hover:text-[#A78BFA]" />
              <span className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-slate-300">
                Back to Dashboard
              </span>
            </Link>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700"
              style={{ fontFamily: "var(--font-mono-data)" }}
            >
              Habit Vitals
            </span>
          </div>

          <HeroCard habit={habitDetails} onToggleStatus={toggleHabitState} />

          {/* BaseHeatmap already renders its own card chrome (border, bg,
              padding) — no extra wrapper here to avoid a double border. */}
          <SingleHabitHeatmap habitColor={"#8B5CF6"} habitData={heatmapData} />
        </div>
      </div>
    </div>
  );
}