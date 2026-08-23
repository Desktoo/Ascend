"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react"; // Smooth rotation spinner token
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/utils/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/core/services/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpCard() {
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
      userName: "",
      email: "",
      password: "",
    },
  });

  // Watch inputs to safely trigger cold-start DB pre-warming on first keystroke
  const formValues = watch();

  const handleKeystrokeWarming = () => {
    if (
      !hasWarmed &&
      (formValues.userName.length > 0 ||
        formValues.email.length > 0 ||
        formValues.password.length > 0)
    ) {
      setHasWarmed(true);
      console.log(
        "First keystroke detected! Sending silent warming ping to DB",
      );

      apiClient("/health/warm", { method: "GET" }).catch((err) =>
        console.log("Warming bypass:", err),
      );
    }
  };

  const triggerWarming = () => {
    if (!hasWarmed) {
      setHasWarmed(true);
      console.log(
        "Mouse hovered over social login! Warming Neon DB in background...",
      );

      apiClient("/health/warm", { method: "GET" }).catch((error) =>
        console.error("Silent DB warm-up failed:", error),
      );
    }
  };

  // 2. Refactored Submit Handler using React Hook Form & apiClient
  const onFormSubmit = async (data: any) => {
    const currentDeviceTimeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      ...data,
      timeZone: currentDeviceTimeZone,
    };

    console.log("Submitting sign up payload:", payload);

    try {
      const responseData = await apiClient<{ message: string }>(
        "/auth/signup",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      console.log(
        "Registration complete. Grid synced successfully:",
        responseData,
      );
      toast.success("Account created successfully!");

      router.push("/onboarding");
    } catch (error: any) {
      console.error("Sign up execution failed:", error);
      toast.error("Failed to create the user");
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
                Begin your journey
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Create an account to start syncing your workspace.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              onChange={handleKeystrokeWarming}
              className="space-y-4"
            >
              {/* Username Input Field */}
              <div className="space-y-1.5">
                <Input
                  id="dm-userName"
                  type="text"
                  style={{ outline: "none" }}
                  className="w-full h-10 px-4 bg-white/3 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:bg-white/5 focus:border-white/30 focus:ring-4 focus:ring-white/2 transition-all outline-none"
                  placeholder="Username"
                  autoComplete="userName"
                  disabled={isSubmitting}
                  required
                  {...register("userName")}
                />
              </div>

              {/* Email Address Input Field */}
              <div className="space-y-1.5">
                <Input
                  id="dm-email"
                  type="email"
                  style={{ outline: "none" }}
                  className="w-full h-10 px-4 bg-white/3 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:bg-white/5 focus:border-white/30 focus:ring-4 focus:ring-white/2 transition-all outline-none"
                  placeholder="Email address"
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                  {...register("email")}
                />
              </div>

              {/* Password Input Field with Visibility Toggle */}
              <div className="relative">
                <Input
                  id="dm-password"
                  type={showPassword ? "text" : "password"}
                  style={{ outline: "none" }}
                  className="w-full h-10 px-4 pr-10 bg-white/3 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:bg-white/5 focus:border-white/30 focus:ring-4 focus:ring-white/2 transition-all outline-none"
                  placeholder="Password"
                  autoComplete="new-password"
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

              {/* Primary Action Button with Dynamic Loading State */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 mt-4 bg-white text-black hover:bg-slate-200 text-sm font-medium rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
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

            {/* Social Authentication Triggers */}
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
                onMouseEnter={triggerWarming}
                onClick={() => signIn("github")}
                variant="outline"
                className="flex-1 h-10 bg-white/2 border border-white/10 text-slate-300 hover:bg-white/6 hover:text-white rounded-xl transition-all flex items-center justify-center"
              >
                <FaGithub className="text-[17px]" />
              </Button>
            </div>

            {/* Navigation Footer */}
            <p className="text-center mt-6 text-xs text-slate-400 font-light">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white font-medium hover:underline underline-offset-4 decoration-white/30 transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
