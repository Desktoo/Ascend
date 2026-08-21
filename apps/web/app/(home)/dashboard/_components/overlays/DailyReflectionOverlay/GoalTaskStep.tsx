"use client";

import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ReflectionFormData } from "./Daily-Reflection.types";

interface GoalTaskStepProps {
  goalId: string;
  goalTitle?: string;
  completedDays?: number;
  targetDays?: number;
}

export function GoalTaskStep({
  goalId,
  goalTitle,
  completedDays,
  targetDays,
}: GoalTaskStepProps) {
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<ReflectionFormData>();

  // Watch selected priority for this goal step
  const currentPriority = useWatch({
    control,
    name: `tomorrowTasks.${goalId}.priority`,
  });

  // 🎯 FIX: Automatically register and initialize priority to "MEDIUM" on mount
  useEffect(() => {
    const existingPriority = getValues(`tomorrowTasks.${goalId}.priority`);
    if (!existingPriority) {
      setValue(`tomorrowTasks.${goalId}.priority`, "MEDIUM", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [goalId, setValue, getValues]);

  const activePriority = currentPriority || "MEDIUM";

  return (
    <div key={goalId} className="space-y-4 flex-1 animate-in slide-in-from-right-4 duration-200">
      {/* Hidden goalId field to ensure full payload binding */}
      <input
        type="hidden"
        value={goalId}
        {...register(`tomorrowTasks.${goalId}.goalId`)}
      />

      {/* Goal Context Banner */}
      <div className="p-3 rounded-2xl flex justify-between items-center bg-indigo-950/30 border border-neutral-800/40">
        <p className="text-lg font-semibold text-indigo-300">{goalTitle}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5 px-2 py-0.5 rounded-lg bg-neutral-800/40 border border-neutral-700/60">
          {completedDays} / {targetDays} Days
        </p>
      </div>

      {/* Task Title Input */}
      <div>
        <label className="block text-xs font-semibold tracking-wider text-neutral-300 mb-1.5">
          Tomorrow&apos;s Task for this Goal
        </label>
        <input
          type="text"
          style={{ outline: "none" }}
          placeholder="e.g., Run 1 mile, Write 500 words, Code auth API..."
          {...register(`tomorrowTasks.${goalId}.taskTitle`, {
            required: "Task title is required",
          })}
          className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700/60 p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:border-indigo-500 transition-colors"
        />
        {errors.tomorrowTasks?.[goalId]?.taskTitle && (
          <p className="mt-1 text-xs text-red-400">
            {errors.tomorrowTasks[goalId]?.taskTitle?.message}
          </p>
        )}
      </div>

      {/* Target Due Time & Priority Row */}
      <div className="flex justify-between">
        <div className="flex-1">
          <label className="block text-xs font-semibold tracking-wider text-neutral-300 mb-1.5">
            Target Due Time
          </label>
          <input
            type="time"
            defaultValue="09:00"
            style={{ outline: "none" }}
            {...register(`tomorrowTasks.${goalId}.taskDueTime`)}
            className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700/60 p-3 text-xs text-white scheme-dark placeholder-neutral-500 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Priority Level Selector */}
        <div className="flex-1 ml-4">
          <label className="block text-xs font-semibold tracking-wider text-neutral-300 mb-1.5">
            Priority Level
          </label>
          <div className="flex w-full justify-between mt-3">
            {(["Low", "Medium", "High"] as const).map((p) => {
              const isSelected = activePriority.toLowerCase() === p.toLowerCase();
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    setValue(
                      `tomorrowTasks.${goalId}.priority`,
                      p.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
                      { shouldValidate: true, shouldDirty: true }
                    )
                  }
                  className={`py-1.5 px-5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? p === "Low"
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-[inset_0_0_20px_rgba(16,185,129,0.35)]"
                        : p === "Medium"
                        ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.35)]"
                        : "bg-red-600/20 border-red-500 text-red-300 shadow-[inset_0_0_20px_rgba(239,68,68,0.35)]"
                      : "bg-neutral-800/40 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}