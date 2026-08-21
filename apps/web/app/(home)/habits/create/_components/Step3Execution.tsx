"use client";

import React from "react";
import { Flame, Zap, Target, Plus } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

export type PriorityType = "HIGH" | "MEDIUM" | "LOW";

interface Step3ExecutionProps {
  onBack: () => void;
  isMutating: boolean;
}

export default function Step3Execution({ onBack, isMutating }: Step3ExecutionProps) {
  const { register, control, formState: { errors, dirtyFields } } = useFormContext();

  // Lock submission if task title hasn't been written yet or if there are errors on Step 3
  const isButtonDisabled = !dirtyFields.taskTitle || !!errors.taskTitle || !!errors.priority || !!errors.dueTime;

  return (
    <div className="w-1/3 pl-4 space-y-6">
      <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase border-b border-zinc-900/80 pb-2">
        03 / Tracking Setup
      </h3>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-zinc-200 tracking-wide">
          What should this habit be called on your dashboard?
        </label>
        <input
          type="text"
          placeholder="e.g., Read for 20 minutes"
          {...register("taskTitle", { required: true, validate: (val) => val.trim() !== "" })}
          className="w-full h-11 px-4 bg-zinc-900/20 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#818CF8]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-zinc-200 tracking-wide">Target time</label>
        <div className="relative group">
          <input
            type="time"
            {...register("dueTime", { required: true })}
            className="w-full h-11 px-4 bg-zinc-900/20 border border-zinc-800 rounded-xl text-white text-sm scheme-dark"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-zinc-200 tracking-wide">How important is this habit?</label>
        <Controller
          control={control}
          name="priority"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <div className="grid grid-cols-3 gap-3">
              {(["HIGH", "MEDIUM", "LOW"] as PriorityType[]).map((p) => {
                const isSelected = value === p;
                const config = {
                  HIGH: { text: "High", icon: <Flame size={14} />, active: "border-red-500/30 bg-red-950/10 text-red-400" },
                  MEDIUM: { text: "Medium", icon: <Zap size={14} />, active: "border-amber-500/30 bg-amber-950/10 text-amber-400" },
                  LOW: { text: "Low", icon: <Target size={14} />, active: "border-green-500/30 bg-green-950/10 text-green-400" },
                }[p];

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    className={`h-12 flex items-center justify-center gap-2 border rounded-xl text-[11px] font-semibold transition-all ${isSelected ? config.active : "border-zinc-800/80 bg-zinc-900/10 text-zinc-500"}`}
                  >
                    {config.icon}
                    <span>{config.text}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div className="pt-4 flex justify-between items-center">
        <button type="button" onClick={onBack} className="text-xs font-medium text-zinc-500 hover:text-zinc-300">
          Review Step 2
        </button>
        <button
          type="submit"
          disabled={isButtonDisabled || isMutating}
          className="px-5 h-11 text-xs font-semibold bg-[#818CF8] hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#818CF8]/20"
        >
          {isMutating ? "Creating..." : <><Plus size={14} strokeWidth={2.5} /> Create habit</>}
        </button>
      </div>
    </div>
  );
}