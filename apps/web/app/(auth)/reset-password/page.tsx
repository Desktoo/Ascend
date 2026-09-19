"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/core/services/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import BgWrapper from "@/components/custom-components/backgrounds/BgWrapper";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const token = searchParams.get("token");

  // Enforce structural parameter presence on page initialization
  useEffect(() => {
    if (!token) {
      toast.error("Invalid access vector. Token parameter is missing.");
      router.replace("/login");
    }
  }, [token, router]);

  // Initialize React Hook Form tracking structure
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
    },
  });

  const onFormSubmit = async (data: { password: string }) => {
    if (!token) return;

    const payload = {
      token,
      password: data.password,
    };

    try {
      const response = await apiClient<{ message: string }>(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      toast.success(response.message || "Password updated successfully!");
      router.replace("/login");
    } catch (error) {
      console.error("Password modification failure:", error);
      toast.error("Token expired. Please request a new link.");
      router.replace("/login"); // Instantly reroute user on security verification failures
    }
  };

  // Prevent UI rendering flashes if token is unassigned
  if (!token) return null;

  return (
    <BgWrapper>
      <div className="w-full flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-white/30">
        {/* The Glass Canvas: Layout matching your core login component */}
        <div className="flex flex-col lg:flex-row w-full max-w-225 rounded-[2rem] overflow-hidden bg-white/2 border border-white/5 shadow-[0_24px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {/* ── Left Side: Brand & Story (Image + Text) ── */}
          <div className="relative flex flex-col justify-between w-full lg:w-5/12 p-6 lg:p-10 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-80" />

            {/* Logo Area */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50/50 dark:bg-black/20 border border-indigo-200/50 dark:border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.2)] overflow-hidden transition-all duration-300">
                <Image
                  src="/logo.svg"
                  alt="Ascend Logo"
                  priority
                  fill
                  className="object-contain px-2 py-0.5"
                  unoptimized
                />
              </div>
              <span className="text-slate-900 dark:text-white font-serif font-semibold text-2xl tracking-wide transition-colors duration-300 whitespace-nowrap">
                Ascend
              </span>
            </div>

            {/* Copywriting */}
            <div className="relative z-10 mt-16 lg:mt-24">
              <h1 className="text-2xl lg:text-3xl font-serif font-medium text-white leading-tight mb-4 tracking-tight">
                Design your day.
                <br />
                Master your time.
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mb-6 font-light">
                More than a to-do list. Daymark is your discipline engine. Build
                consistent habits, visualize your micro-wins, and track your
                progress with absolute clarity.
              </p>

              <div className="flex gap-4 mt-6 border-t border-white/10 pt-5">
                <div>
                  <p className="text-white font-medium text-lg tracking-tight">
                    98%
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                    Goal Retention
                  </p>
                </div>
                <div>
                  <p className="text-white font-medium text-lg tracking-tight">
                    2.4x
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                    Productivity
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Side: The Glass Form ── */}
          <div className="flex flex-col justify-center w-full lg:w-7/12 p-6 lg:p-10 bg-black/20 border-l border-white/5">
            <div className="max-w-85 w-full mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-medium text-white mb-2">
                  Update Password
                </h2>
                <p className="text-xs text-slate-400 font-light">
                  Configure your secure secondary access coordinates below.
                </p>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                {/* Password Input Field with Layout Visibility Toggle */}
                <div className="relative">
                  <Input
                    id="dm-password"
                    type={showPassword ? "text" : "password"}
                    className="w-full h-10 px-4 pr-10 bg-white/3 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:bg-white/5 focus:border-white/30 focus:ring-4 focus:ring-white/2 transition-all outline-none"
                    placeholder="New secure password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    required
                    {...register("password", { minLength: 8 })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Action Update button with Loading Spinner Animation */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 mt-4 bg-white text-black hover:bg-slate-200 text-sm font-medium rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      Applying Credentials...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BgWrapper>
  );
}
