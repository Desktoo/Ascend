"use client";

import React from "react";
import { Flame, Zap, Target, Plus } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { CreateObjectiveFormState, HorizonType } from "../types/create-habit.types";

export type PriorityType = "HIGH" | "MEDIUM" | "LOW";

interface BlueprintStepProps {
  timeframe: HorizonType;
  onBack: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export default function BlueprintStep({ timeframe, onBack, isSubmitting, isValid }: BlueprintStepProps) {
  const { register, control, formState: { errors, dirtyFields } } = useFormContext<CreateObjectiveFormState>();

  // Lock final form activation if the mandatory tracking configurations are omitted or invalid
  const isButtonDisabled = !dirtyFields.firstGoalTask || !!errors.firstGoalTask || !!errors.goalTaskPriority || !!errors.goalTaskDueTime;

  return (
    <div className="w-1/3 shrink-0 px-2 sm:px-4 space-y-6 box-border max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Upper Section Header */}
      <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase border-b border-zinc-900/80 pb-2">
        03 / Blueprint
      </h3>

      {/* Start Date Configuration */}
      <div className="flex flex-col gap-3">
        <label htmlFor="start-date" className="text-sm font-medium tracking-wide text-zinc-200">
          Target Start Date
        </label>
        <input
          id="start-date"
          type="date"
          {...register("startDate", { required: true })}
          className="w-full h-11 px-4 tracking-tight font-semibold text-sm border border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl scheme-dark focus:outline-none focus:border-purple-500 focus-visible:ring-purple-500/40 focus-visible:ring-2 transition-all"
        />
      </div>

      {/* Conditionally Render Sprint Themes ONLY if Horizon Type is Monthly */}
      {timeframe === "Monthly" && (
        <div className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 p-4">
          <div>
            <h4 className="text-xs font-semibold tracking-wide text-zinc-200">
              Give each sprint a focus
            </h4>
            <p className="text-[11px] text-zinc-600 font-normal leading-normal mt-0.5">
              One short theme per week of the rolling month.
            </p>
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-16 shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Sprint {idx + 1}
                </span>
                <input
                  type="text"
                  {...register(`monthlyWeekThemes.${idx}` as any, { required: true, validate: (val) => val.trim() !== "" })}
                  placeholder={
                    idx === 0
                      ? "Get the basics down"
                      : idx === 1
                        ? "Build momentum"
                        : idx === 2
                          ? "Push into the hard part"
                          : idx === 3 
                            ? "Bring it together"
                            : "Reach your milestone"
                  }
                  className="w-full h-9 px-3 tracking-tight font-semibold text-xs border border-zinc-800/60 bg-black text-white rounded-xl placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Goal Task Setup */}
      <div className="flex flex-col gap-3">
        <label htmlFor="first-task" className="text-sm font-medium text-zinc-200 tracking-wide">
          What is the first objective task called?
        </label>
        <input
          id="first-task"
          type="text"
          placeholder="e.g., Configure system core matrix database architecture"
          {...register("firstGoalTask", { required: true, validate: (val) => val.trim() !== "" })}
          className="w-full h-11 px-4 tracking-tight font-semibold text-sm border border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 focus-visible:ring-purple-500/40 focus-visible:ring-2 transition-all"
        />
      </div>

      {/* Target Action Timestamp */}
      <div className="flex flex-col gap-3">
        <label htmlFor="due-time" className="text-sm font-medium text-zinc-200 tracking-wide">
          Target Action Execution Time
        </label>
        <input
          id="due-time"
          type="time"
          {...register("goalTaskDueTime", { required: true })}
          className="w-full h-11 px-4 tracking-tight font-semibold text-sm border border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl scheme-dark focus:outline-none focus:border-purple-500 focus-visible:ring-purple-500/40 focus-visible:ring-2 transition-all"
        />
      </div>

      {/* Priority Configurations Matrix */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-zinc-200 tracking-wide">
          How critical is this objective baseline?
        </label>
        <Controller
          control={control}
          name="goalTaskPriority"
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
                    className={`h-12 flex items-center justify-center gap-2 border rounded-xl text-[11px] font-semibold transition-all ${
                      isSelected ? config.active : "border-zinc-800/80 bg-zinc-900/10 text-zinc-500 hover:border-zinc-700"
                    }`}
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

      {/* Form Action Back & Engine Submit Footer */}
      <div className="pt-4 flex justify-between items-center">
        <button 
          type="button" 
          onClick={onBack} 
          className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Review Step 2
        </button>
        <button
          type="submit"
          disabled={isButtonDisabled || !isValid || isSubmitting}
          className={`px-5 h-11 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] ${
            isButtonDisabled || !isValid || isSubmitting
              ? "opacity-40 cursor-not-allowed bg-zinc-900 border border-zinc-800 text-zinc-600"
              : "bg-transparent text-white border border-purple-500/30 shadow-[inset_0_0_50px_rgba(139,92,246,0.4)] hover:shadow-[inset_0_0_60px_rgba(139,92,246,0.8)] hover:border-purple-500/60"
          }`}
        >
          {isSubmitting ? (
            "Activating..."
          ) : (
            <>
              <Plus size={14} strokeWidth={2.5} />
              <span>Activate Objective</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}