"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { CreateObjectiveFormState } from "../types/create-habit.types";

interface IdentityStepProps {
  onNext: () => void;
}

export default function IdentityStep({ onNext }: IdentityStepProps) {
  const {
    register,
    formState: { errors, dirtyFields },
  } = useFormContext<CreateObjectiveFormState>();

  const isButtonDisabled = !dirtyFields.title || !!errors.title;

  return (
    <div className="w-1/3 shrink-0 px-2 sm:px-4 space-y-6 box-border">
      {/* Upper Category Label */}
      <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase border-b border-zinc-900/80 pb-2">
        01 / Identity
      </h3>

      {/* Title Field */}
      <div className="flex flex-col gap-3">
        <label htmlFor="goal-title" className="text-sm font-medium tracking-wide text-zinc-200">
          What is the objective?
        </label>
        <input
          id="goal-title"
          type="text"
          {...register("title", { required: true, validate: (val) => val.trim() !== "" })}
          placeholder="e.g., Build Coding Platform, Improve DSA Competency..."
          className="w-full h-11 px-4 tracking-tight font-semibold text-sm border border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 focus-visible:ring-purple-500/40 focus-visible:ring-2 transition-all"
        />
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-3">
        <label htmlFor="goal-notes" className="text-sm flex flex-col gap-1 font-medium tracking-wide text-zinc-200">
          <span>Scope notes (Optional)</span>
          <span className="text-zinc-600 text-xs font-normal">
            Milestones, technical direction, or design patterns worth remembering later.
          </span>
        </label>
        <textarea
          id="goal-notes"
          {...register("description")}
          rows={5}
          placeholder="e.g., Use Turborepo, configure Prisma cascades, design clean interface models."
          className="w-full min-h-[120px] font-semibold tracking-tight p-4 text-sm border border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl placeholder:text-zinc-700 resize-none leading-relaxed focus:outline-none focus:border-purple-500 focus-visible:ring-purple-500/40 focus-visible:ring-2 transition-all"
        />
      </div>

      {/* Reward Field */}
      <div className="flex flex-col gap-3">
        <label htmlFor="goal-reward" className="text-sm flex flex-col gap-1 font-medium tracking-wide text-zinc-200">
          <span>Unlock on completion (Optional)</span>
          <span className="text-zinc-600 text-xs font-normal">
            A small reward to motivate you once the objective is fully reached.
          </span>
        </label>
        <input
          id="goal-reward"
          type="text"
          {...register("rewardText")}
          placeholder="e.g., Buy that highneck sweater, watch a movie night."
          className="w-full h-11 px-4 tracking-tight font-semibold text-sm border border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 focus-visible:ring-purple-500/40 focus-visible:ring-2 transition-all"
        />
      </div>

      {/* Integrated Navigation Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={isButtonDisabled}
          className="px-5 h-11 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-purple-500/60 text-zinc-200 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-2 group"
        >
          Next Parameters
          <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}