"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "../page";

interface ProfileFormFieldsProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export default function ProfileFormFields({
  register,
  errors,
}: ProfileFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Username Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-400">Username</label>
          <input
            style={{ outline: "none" }}
            type="text"
            {...register("userName", {
              required: "Username is required",
              minLength: { value: 3, message: "Min 3 characters" },
            })}
            className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors"
          />
          {errors.userName && (
            <p className="text-[10px] text-rose-400 font-medium">
              {errors.userName.message}
            </p>
          )}
        </div>

        {/* Email Address Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-400">
            Email address
          </label>
          <input
            style={{ outline: "none" }}
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors"
          />
          {errors.email && (
            <p className="text-[10px] text-rose-400 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Day Start Time Baseline */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-400">
            Day Start Baseline
          </label>
          <input
            type="time"
            {...register("dayStartTime")}
            style={{ outline: "none" }}
            className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
