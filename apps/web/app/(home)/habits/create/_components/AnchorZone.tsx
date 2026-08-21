import React from "react";
import { Check } from "lucide-react";

interface AnchorZoneProps {
  currentStep: 1 | 2 | 3;
  isSection1Confirmed: boolean;
  isSection2Confirmed: boolean;
  isStep3Valid: boolean;
}

export default function AnchorZone({
  currentStep,
  isSection1Confirmed,
  isSection2Confirmed,
  isStep3Valid,
}: AnchorZoneProps) {

  return (
    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-[1.15]">
          Create a <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#818CF8] to-indigo-200">
            new habit
          </span>
        </h1>
        <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
          Set up a habit, choose when you&apos;ll do it, and track your progress
          automatically.
        </p>
      </div>

      {/* PROGRESS ROADMAP TIMELINE */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-px before:bg-zinc-900">
        {/* Step 1 Roadmap Marker */}
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
          <div className="flex flex-col">
            <span
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                isSection1Confirmed
                  ? "text-emerald-400"
                  : currentStep === 1
                    ? "text-[#818CF8]"
                    : "text-zinc-600"
              }`}
            >
              01 / Habit Details
            </span>
            <span
              className={`text-xs leading-relaxed ${currentStep === 1 ? "text-zinc-200" : "text-zinc-500"} transition-colors`}
            >
              Define your habit
            </span>
          </div>
        </div>

        {/* Step 2 Roadmap Marker */}
        <div className="relative flex items-start gap-4 group">
          <div
            className={`absolute -left-4.5 w-[11px] h-[11px] rounded-full flex items-center justify-center border transition-all duration-300 ${
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
          <div className="flex flex-col">
            <span
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                isSection2Confirmed
                  ? "text-emerald-400"
                  : currentStep === 2
                    ? "text-[#818CF8]"
                    : "text-zinc-600"
              }`}
            >
              02 / Schedule and Category
            </span>
            <span
              className={`text-xs ${currentStep === 2 ? "text-zinc-200 font-medium" : "text-zinc-500"} transition-colors`}
            >
              Set your routine
            </span>
          </div>
        </div>

        {/* Step 3 Roadmap Marker */}
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
          <div className="flex flex-col">
            <span
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                currentStep === 3 ? "text-[#818CF8]" : "text-zinc-600"
              }`}
            >
              03 / Tracking Setup
            </span>
            <span
              className={`text-xs ${currentStep === 3 ? "text-zinc-200 font-medium" : "text-zinc-500"} transition-colors`}
            >
              Dashboard tracking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
