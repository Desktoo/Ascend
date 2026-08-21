"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Step1IntentProps {
  onNext: () => void;
}

export default function Step1Intent({ onNext }: Step1IntentProps) {
  const { register, formState: { errors, dirtyFields } } = useFormContext();

  // Button is disabled if the field hasn't been touched yet OR if it has errors
  const isButtonDisabled = !dirtyFields.title || !!errors.title;

  return (
    <div className="w-1/3 pr-4 space-y-6">
      <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase border-b border-zinc-900/80 pb-2">
        01 / Habit Details
      </h3>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium tracking-wide text-zinc-200">
          What habit would you like to build?
        </label>
        <Input
          {...register("title", { required: true, validate: (val) => val.trim() !== "" })}
          placeholder="e.g., Read for 20 minutes, Meditate"
          className="h-11 tracking-tight font-semibold text-sm focus-visible:ring-[#818CF8]/40 focus-visible:ring-2 border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl placeholder:text-zinc-600 transition-all"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm flex flex-col gap-1 font-medium tracking-wide text-zinc-200">
          <span>Additional notes (Optional)</span>
          <span className="text-zinc-600 text-xs font-normal">
            Add any rules or details that will help you stay consistent.
          </span>
        </label>
        <Textarea
          {...register("description")}
          className="h-32 font-semibold tracking-tight focus-visible:ring-[#818CF8]/40 focus-visible:ring-2 text-sm border-zinc-800/80 bg-zinc-900/10 text-white rounded-xl placeholder:text-zinc-600 resize-none leading-relaxed p-4 transition-all"
          placeholder="e.g., Read before bed and avoid using my phone."
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={isButtonDisabled}
          className="px-5 h-11 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-[#818CF8]/60 text-zinc-200 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-2 group"
        >
          Next Parameters
          <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}