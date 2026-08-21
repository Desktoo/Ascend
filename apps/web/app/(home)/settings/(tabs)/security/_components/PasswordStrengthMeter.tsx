"use client";

import React from "react";
import { Check, Shield } from "lucide-react";

interface PasswordStrengthMeterProps {
  newPassword?: string;
}

export default function PasswordStrengthMeter({
  newPassword = "",
}: PasswordStrengthMeterProps) {
  const rules = [
    { label: "At least 8 characters", valid: newPassword.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { label: "One lowercase letter", valid: /[a-z]/.test(newPassword) },
    { label: "One number", valid: /[0-9]/.test(newPassword) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const passedRulesCount = rules.filter((r) => r.valid).length;

  return (
    <div className="p-3.5 rounded-xl mt-4 space-y-3 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white  flex items-center gap-1.5">
            Password Strength
          </span>
          
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx < passedRulesCount
                  ? passedRulesCount >= 4
                    ? "bg-emerald-500"
                    : "bg-amber-400"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Rule Checklist */}
        <div className="space-y-1.5 pt-1">
          {rules.map((rule, index) => (
            <div
              key={index}
              className={`text-[11px] flex items-center gap-2 transition-colors ${
                rule.valid ? "text-emerald-400 font-medium" : "text-zinc-500"
              }`}
            >
              <div
                className={`p-0.5 rounded-full ${
                  rule.valid
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-zinc-800 text-zinc-600"
                }`}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}