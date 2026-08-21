"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, ArrowUpRight, Calendar } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { HorizonType } from "@/core/types/objective.types";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

export interface Objective {
  id: string;
  title: string;
  percentage: number;
  timeframe: HorizonType;
  startDate: string;
}

interface ObjectiveCardProps {
  objective: Objective;
  onAbandonGoal?: (id: string) => void;
}

export default function ObjectiveCard({
  objective,
  onAbandonGoal,
}: ObjectiveCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const countTarget = useRef({ value: 0 });

  useEffect(() => {
    console.log("time frame: ", objective.timeframe)
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!objective) return null;

  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedPercent = Math.min(100, Math.max(0, objective.percentage));
  const strokeDashoffset =
    circumference - (clampedPercent / 100) * circumference;

  useGSAP(
    () => {
      gsap.set(circleRef.current, { strokeDashoffset: circumference });
      countTarget.current.value = 0;

      gsap.to(circleRef.current, {
        strokeDashoffset: strokeDashoffset,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.to(countTarget.current, {
        value: clampedPercent,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.1,
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.innerText = String(
              Math.round(countTarget.current.value)
            );
          }
        },
      });
    },
    { dependencies: [clampedPercent, circumference] }
  );

  return (
    <div
      className="group relative flex min-h-80 items-center w-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#1c1924] bg-gradient-to-b from-[#15101b] via-[#0d0d10] to-[#09090b] p-4 text-slate-200 shadow-2xl transition-all duration-500 ease-out hover:scale-[1.03] hover:border-purple-500/30 lg:col-span-1"
      style={{ fontFamily: "var(--font-body, 'Inter', sans-serif)" }}
    >
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-purple-400">
              {objective.timeframe}
            </span>
          </div>

          <div ref={menuRef} className="relative flex items-center gap-0.5">
            <Link href={`objectives/${objective.id}`} className="rounded-md p-1 text-zinc-500 hover:bg-white/5 hover:text-purple-300 transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-md p-1 text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 z-40 flex w-24 flex-col rounded-xl border border-[#232328] bg-[#121215] p-1 shadow-2xl">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onAbandonGoal?.(objective.id);
                  }}
                  className="w-full text-left rounded-lg px-2 py-1 text-[11px] font-medium text-rose-400 hover:bg-rose-500/10"
                >
                  Abandon
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-left w-full">
          <h3
            className="text-lg font-semibold tracking-tight text-zinc-100 leading-tight group-hover:text-purple-300 transition-colors truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {objective.title}
          </h3>
        </div>
      </div>

      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-[#16161f]"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tighter text-white font-sans">
            <span ref={textRef}>0</span> <span className="text-lg">%</span>
          </span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">
            Progress
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1.5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono pt-2 w-full mt-1">
        <span className="flex gap-1">
          <Calendar className="h-3 w-3 text-zinc-600 shrink-0" />
          Started:
        </span>
        <span className="text-zinc-400 font-semibold">
          {objective.startDate}
        </span>
      </div>
    </div>
  );
}