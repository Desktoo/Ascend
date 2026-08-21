"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/utils/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/core/services/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginCard() {
  const [hasWarmed, setHasWarmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 1. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Watch fields to trigger silent DB warming pings on initial interaction strings
  const formValues = watch();

  const handleKeystrokeWarming = () => {
    if (!hasWarmed && (formValues.identifier.length > 0 || formValues.password.length > 0)) {
      setHasWarmed(true);
      console.log("First keystroke detected! Sending silent warming ping to DB");

      apiClient("/health/warm", { method: "GET" }).catch((err) =>
        console.log("Warming bypass:", err)
      );
    }
  };

  const triggerWarming = () => {
    if (!hasWarmed) {
      setHasWarmed(true);
      console.log("Mouse hovered over social login! Warming Neon DB in background...");

      apiClient("/health/warm", { method: "GET" }).catch((error) =>
        console.error("Silent DB warm-up failed:", error)
      );
    }
  };

  // 2. Refactored Submit Handler using React Hook Form & apiClient
  const onFormSubmit = async (data: any) => {

    console.log("Sign in payload:", data);

    try {
      const responseData = await apiClient<{ message: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log("Login verified. Session active:", responseData);
      toast.success("Welcome back to Ascend!");
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Authentication failed:", error);
      toast.error(error.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-white/30">
      {/* The Glass Canvas: A perfectly proportioned split card */}
      <div className="flex flex-col lg:flex-row w-full max-w-225 rounded-[2rem] overflow-hidden bg-white/2 border border-white/5 shadow-[0_24px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        
        {/* ── Left Side: Brand & Story (Image + Text) ── */}
        <div className="relative flex flex-col justify-between w-full lg:w-5/12 p-6 lg:p-10 overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
            }}
          />
          {/* Gradient to ensure text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-80" />

          {/* Logo Area */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50/50 dark:bg-black/20 border border-indigo-200/50 dark:border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] dark:group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] group-hover:border-indigo-300 dark:group-hover:border-[#A855F7]/40 overflow-hidden transition-all duration-300">
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

            {/* Minimalist Data Points */}
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
                Welcome back
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Sign in to your account to continue your journey.
              </p>
            </div>

            <form 
              onSubmit={handleSubmit(onFormSubmit)} 
              onChange={handleKeystrokeWarming} 
              className="space-y-4"
            >
              {/* Email/Username Input Field */}
              <div className="space-y-1.5">
                <Input
                  id="dm-email"
                  type="text"
                  className="w-full h-10 px-4 bg-white/3 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:bg-white/5 focus:border-white/30 focus:ring-4 focus:ring-white/2 transition-all outline-none"
                  placeholder="Email or Username"
                  autoComplete="username"
                  disabled={isSubmitting}
                  required
                  {...register("identifier")}
                />
              </div>

              {/* Password Input Field */}
              <div className="relative">
                <Input
                  id="dm-password"
                  type={showPassword ? "text" : "password"}
                  className="w-full h-10 px-4 pr-10 bg-white/3 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:bg-white/5 focus:border-white/30 focus:ring-4 focus:ring-white/2 transition-all outline-none"
                  placeholder="Password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  required
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Context Action Matrix Row */}
              <div className="flex items-center justify-between mt-2! px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded bg-white/3 border border-white/20 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Primary Authentication Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 mt-4 bg-white text-black hover:bg-slate-200 text-sm font-medium rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <span className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                Or continue with
              </span>
              <span className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Buttons Container */}
            <div className="flex gap-3">
              <Button
                type="button"
                onMouseEnter={triggerWarming}
                onClick={() => signIn("google")}
                variant="outline"
                className="flex-1 h-10 bg-white/2 border border-white/10 text-slate-300 hover:bg-white/6 hover:text-white rounded-xl transition-all flex items-center justify-center"
              >
                <FaGoogle className="text-[15px]" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => signIn("github")}
                onMouseEnter={triggerWarming}
                className="flex-1 h-10 bg-white/2 border border-white/10 text-slate-300 hover:bg-white/6 hover:text-white rounded-xl transition-all flex items-center justify-center"
              >
                <FaGithub className="text-[17px]" />
              </Button>
            </div>

            {/* Redirection Navigation Link */}
            <p className="text-center mt-6 text-xs text-slate-400 font-light">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-white font-medium hover:underline underline-offset-4 decoration-white/30 transition-all"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}