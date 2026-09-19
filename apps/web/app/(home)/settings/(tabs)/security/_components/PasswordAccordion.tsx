"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { Lock, ChevronDown, Loader2 } from "lucide-react";
import PasswordFields from "./PasswordFields";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { ChangePasswordValues } from "@/core/types/user.types";
import { securityService } from "@/core/services/user/change-password";
import useUserProfile from "@/core/hooks/useUserProfile";
import OAuthWarningBanner from "./OAuthWarningBanner";
import { toast } from "sonner";

export default function PasswordAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangePasswordValues>({
    mode: "onChange",
  });

  const { user } = useUserProfile();

  const { trigger: changePassword, isMutating } = useSWRMutation(
    "/user/change-password",
    securityService.changePassword,
  );

  const newPassword = watch("newPassword") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const currentPassword = watch("currentPassword") || "";

  // Password rules validation
  const rules = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword),
    /[a-z]/.test(newPassword),
    /[0-9]/.test(newPassword),
    /[^A-Za-z0-9]/.test(newPassword),
  ];
  const passedRulesCount = rules.filter(Boolean).length;
  const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  // Form submit button enabled condition
  const isReady =
    Boolean(currentPassword) &&
    Boolean(newPassword) &&
    Boolean(confirmPassword) &&
    passedRulesCount >= 4 &&
    isMatch &&
    isValid;

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      await changePassword(data);
      reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
      console.error("Failed to change password:", error);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0C0C0E] border border-zinc-800/80 overflow-hidden transition-all duration-300">
      {/* Accordion Trigger Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Manage Passwords</h3>
            <p className="text-[11px] text-zinc-400">
              Update your account password and security rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={` text-zinc-400 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-white" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Accordion Animated Collapsible Body */}
      {isOpen &&
        (user?.hasPassword === false ? (
          <OAuthWarningBanner />
        ) : (
          <div className="p-4 pt-2 border-t border-zinc-800/60 space-y-4 animate-in fade-in duration-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                {/* Left Column: Password Inputs (7 cols) */}
                <div className="md:col-span-7">
                  <PasswordFields
                    register={register}
                    errors={errors}
                    newPassword={newPassword}
                    confirmPassword={confirmPassword}
                    isMatch={isMatch}
                  />
                </div>

                {/* Right Column: Password Strength Check (5 cols) */}
                <div className="md:col-span-5">
                  <PasswordStrengthMeter newPassword={newPassword} />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isReady || isMutating}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                    isReady && !isMutating
                      ? "bg-purple-800 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 cursor-pointer"
                      : "bg-zinc-800 text-zinc-500 border border-zinc-700/40 cursor-not-allowed opacity-60"
                  }`}
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ))}
    </div>
  );
}
