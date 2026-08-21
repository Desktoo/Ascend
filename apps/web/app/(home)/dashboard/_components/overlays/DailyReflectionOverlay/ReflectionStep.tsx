"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ReflectionFormData } from "./Daily-Reflection.types";

export function ReflectionStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReflectionFormData>();

  return (
    <div className="space-y-4 flex-1 animate-in fade-in duration-200">
      <div>
        <label className="block text-xs font-semibold tracking-wider text-neutral-300 mb-1.5">
          How did today go?
        </label>
        <textarea
          rows={5}
          style={{ outline: "none" }}
          placeholder="Reflect on your wins, distractions, energy, or key learnings..."
          {...register("reflectionText", {
            required: "Please enter your reflection for today",
            minLength: {
              value: 3,
              message: "Reflection must be at least 3 characters",
            },
          })}
          className="w-full rounded-lg bg-neutral-800/50 border border-neutral-700/60 p-3.5 text-xs text-white placeholder-neutral-500 outline-none focus:outline-none focus:ring-0 focus:border-purple-800/80 transition-colors resize-none"
        />
        {errors.reflectionText && (
          <p className="mt-1 text-xs text-red-400">
            {errors.reflectionText.message}
          </p>
        )}
      </div>
    </div>
  );
}