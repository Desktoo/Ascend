"use client";

import React, { useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { HorizonType, CreateObjectiveFormState } from "../types/create-habit.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CADENCE_COPY: Record<HorizonType, string> = {
  Weekly: "Tracked as a weekly sprint, just like your calendar view.",
  Monthly: "Broken into four rolling weekly sprints.",
};

interface HorizonStepProps {
  onBack: () => void;
  onNext: () => void;
}

export default function HorizonStep({ onBack, onNext }: HorizonStepProps) {
  const { watch, setValue, control } = useFormContext<CreateObjectiveFormState>();
  
  const timeframeValue = watch("timeframe");
  const workDaysValue = watch("configuredWorkDaysPerWeek");

  const isSevenDays = Number(workDaysValue) === 7;

  // Auto-reset weekendsExcluded to false whenever 7 days is selected
  useEffect(() => {
    if (isSevenDays) {
      setValue("weekendsExcluded", false);
    }
  }, [isSevenDays, setValue]);

  return (
    <div className="w-1/3 shrink-0 px-2 sm:px-4 space-y-6 box-border">
      {/* Upper Section Header */}
      <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase border-b border-zinc-900/80 pb-2">
        02 / Horizon
      </h3>

      {/* Schedule / Timeframe Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium tracking-wide text-zinc-200">
          Objective Cadence
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          {(["Weekly", "Monthly"] as HorizonType[]).map((item) => {
            const active = timeframeValue === item;

            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setValue("timeframe", item)}
                className={`h-11 rounded-xl border font-semibold text-xs tracking-wide transition-all ${
                  active
                    ? "border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.05)]"
                    : "border-zinc-800/80 bg-zinc-900/10 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        
        <p className="text-xs font-normal text-zinc-500 mt-0.5 leading-relaxed">
          {CADENCE_COPY[timeframeValue]}
        </p>
      </div>

      {/* Work Week Target Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium tracking-wide text-zinc-200">
          Target Work Week
        </label>
        
        <Select
          value={String(workDaysValue)}
          onValueChange={(value) => setValue("configuredWorkDaysPerWeek", Number(value))}
        >
          <SelectTrigger className="w-full h-11 px-4 text-sm font-semibold border border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 data-[placeholder]:text-zinc-600 transition-all">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="rounded-xl text-sm border border-zinc-800 bg-black text-zinc-300 p-1.5 shadow-2xl">
            <SelectItem value="5" className="rounded-lg focus:bg-zinc-900 focus:text-white my-1 cursor-pointer font-medium text-xs">
              5 days — Structured week
            </SelectItem>
            <SelectItem value="6" className="rounded-lg focus:bg-zinc-900 focus:text-white my-1 cursor-pointer font-medium text-xs">
              6 days — One day off
            </SelectItem>
            <SelectItem value="7" className="rounded-lg focus:bg-zinc-900 focus:text-white my-1 cursor-pointer font-medium text-xs">
              7 days — Every day
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Premium Weekends Excluded Checkbox Row */}
      <div className="flex flex-col gap-2">
        <Controller
          control={control}
          name="weekendsExcluded"
          render={({ field: { value = false, onChange } }) => (
            <button
              type="button"
              disabled={isSevenDays}
              onClick={() => onChange(!value)}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl border text-left transition-all group ${
                isSevenDays
                  ? "border-zinc-900 bg-zinc-950/40 opacity-40 cursor-not-allowed"
                  : "border-zinc-800/80 bg-zinc-900/10 hover:bg-zinc-900/20"
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                  value && !isSevenDays
                    ? "bg-purple-500 border-purple-500 shadow-md shadow-purple-500/20 scale-102" 
                    : "border-zinc-700 bg-black group-hover:border-zinc-500"
                }`}
              >
                {value && !isSevenDays && <Check size={12} strokeWidth={3} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold tracking-wide ${isSevenDays ? "text-zinc-500" : "text-zinc-200"}`}>
                  Exclude Weekends from tracking
                </span>
                <span className="text-[11px] text-zinc-600 font-normal leading-normal mt-0.5">
                  {isSevenDays
                    ? "Disabled when tracking every day (7 days)."
                    : "Automatically freeze target schedules on Saturdays and Sundays."}
                </span>
              </div>
            </button>
          )}
        />
      </div>

      {/* Lower Navigation Button Footprint */}
      <div className="pt-4 flex justify-between items-center">
        <button 
          type="button" 
          onClick={onBack} 
          className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Review Step 1
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-5 h-11 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-purple-500/60 text-zinc-200 rounded-xl transition-all flex items-center gap-2 group"
        >
          Next Execution Details
          <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}