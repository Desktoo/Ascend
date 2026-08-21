"use client";

import React from "react";
import { Check } from "lucide-react";

interface TimelineStepperProps {
  currentStep: 1 | 2 | 3;
  isSection1Confirmed: boolean;
  isSection2Confirmed: boolean;
  isStep3Valid: boolean;
}

export default function TimelineStepper({
  currentStep,
  isSection1Confirmed,
  isSection2Confirmed,
  isStep3Valid,
}: TimelineStepperProps) {
  return (
    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10 w-full select-none">
      {/* Title Segment Header Block */}
      <div className="space-y-3">
        <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-[1.15]">
          Start a <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-violet-200 to-indigo-300">
            new objective
          </span>
        </h1>
        <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
          Turn a long-term goal into a clear execution plan with weekly progress
          and daily actions.
        </p>
      </div>

      {/* PROGRESS ROADMAP TIMELINE */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-px before:bg-zinc-900">
        
        {/* Step 1: Identity */}
        <div className="relative flex items-start gap-4 group">
          <div
            className={`absolute -left-4.5 w-2.75 h-2.75 rounded-full flex items-center justify-center border transition-all duration-300 ${
              isSection1Confirmed
                ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20 scale-110"
                : currentStep === 1
                  ? "bg-[#818CF8] border-[#818CF8]"
                  : "bg-black border-zinc-700"
            }`}
          >
            {isSection1Confirmed && (
              <Check size={7} strokeWidth={4} className="text-black" />
            )}
          </div>
          <div className="flex flex-col font-mono">
            <span
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                isSection1Confirmed
                  ? "text-emerald-400"
                  : currentStep === 1
                    ? "text-[#818CF8]"
                    : "text-zinc-600"
              }`}
            >
              01 / Identity
            </span>
            <span
              className={`text-xs font-sans leading-relaxed ${
                currentStep === 1 ? "text-zinc-200 font-medium" : "text-zinc-500"
              } transition-colors`}
            >
              Define core target scope
            </span>
          </div>
        </div>

        {/* Step 2: Horizon */}
        <div className="relative flex items-start gap-4 group">
          <div
            className={`absolute -left-4.5 w-2.75 h-2.75 rounded-full flex items-center justify-center border transition-all duration-300 ${
              isSection2Confirmed
                ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20 scale-110"
                : currentStep === 2
                  ? "bg-[#818CF8] border-[#818CF8]"
                  : "bg-black border-zinc-700"
            }`}
          >
            {isSection2Confirmed && (
              <Check size={7} strokeWidth={4} className="text-black" />
            )}
          </div>
          <div className="flex flex-col font-mono">
            <span
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                isSection2Confirmed
                  ? "text-emerald-400"
                  : currentStep === 2
                    ? "text-[#818CF8]"
                    : "text-zinc-600"
              }`}
            >
              02 / Horizon
            </span>
            <span
              className={`text-xs font-sans leading-relaxed ${
                currentStep === 2 ? "text-zinc-200 font-medium" : "text-zinc-500"
              } transition-colors`}
            >
              Set schedule metrics
            </span>
          </div>
        </div>

        {/* Step 3: Blueprint */}
        <div className="relative flex items-start gap-4 group">
          <div
            className={`absolute -left-4.5 w-2.75 h-2.75 rounded-full flex items-center justify-center border transition-all duration-300 ${
              currentStep === 3
                ? "bg-[#818CF8] border-[#818CF8]"
                : "bg-black border-zinc-700"
            }`}
          >
            {currentStep === 3 && isStep3Valid && (
              <div className="w-0.75 h-0.75 bg-white rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex flex-col font-mono">
            <span
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                currentStep === 3 ? "text-[#818CF8]" : "text-zinc-600"
              }`}
            >
              03 / Blueprint
            </span>
            <span
              className={`text-xs font-sans leading-relaxed ${
                currentStep === 3 ? "text-zinc-200 font-medium" : "text-zinc-500"
              } transition-colors`}
            >
              Initialize rolling loops
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}