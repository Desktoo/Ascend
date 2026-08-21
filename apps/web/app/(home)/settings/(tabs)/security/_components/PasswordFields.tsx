"use client";

import { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { ChangePasswordValues } from "@/core/types/user.types";

interface PasswordFieldsProps {
  register: UseFormRegister<ChangePasswordValues>;
  errors: FieldErrors<ChangePasswordValues>;
  newPassword?: string;
  confirmPassword?: string;
  isMatch: boolean;
}

export default function PasswordFields({
  register,
  errors,
  newPassword = "",
  confirmPassword = "",
  isMatch,
}: PasswordFieldsProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-3.5">
      {/* 1. Current Password */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-zinc-300">
          Current Password
        </label>
        <div className="relative">
          <input
            style={{ outline: "none" }}
            type={showCurrent ? "text" : "password"}
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            placeholder="••••••••••••"
            className="w-full px-3 py-1.5 rounded-lg border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-[10px] text-rose-400 font-medium">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* 2. New Password */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-zinc-300">
          New Password
        </label>
        <div className="relative">
          <input
            style={{ outline: "none" }}
            type={showNew ? "text" : "password"}
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
            placeholder="••••••••••••"
            className="w-full px-3 py-1.5 rounded-lg border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-[10px] text-rose-400 font-medium">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* 3. Confirm Password */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-zinc-300">
            Confirm New Password
          </label>
          {confirmPassword && (
            <span
              className={`text-[10px] font-medium flex items-center gap-1 ${
                isMatch ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isMatch ? (
                <>
                  <Check className="w-3 h-3" /> Passwords match
                </>
              ) : (
                <>
                  <X className="w-3 h-3" /> Passwords do not match
                </>
              )}
            </span>
          )}
        </div>
        <div className="relative">
          <input
            style={{ outline: "none" }}
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === newPassword || "Passwords do not match",
            })}
            placeholder="••••••••••••"
            className={`w-full px-3 py-1.5 rounded-lg bg-zinc-950 border text-sm text-white focus:outline-none transition-colors ${
              confirmPassword
                ? isMatch
                  ? "border-emerald-500/60 focus:border-emerald-500"
                  : "border-rose-500/60 focus:border-rose-500"
                : "border-zinc-800 focus:border-purple-500/60"
            }`}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {confirmPassword && isMatch && (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        {errors.confirmPassword && (
          <p className="text-[10px] text-rose-400 font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </div>
  );
}