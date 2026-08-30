"use client";

import { useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center pt-12 pb-24 px-4 overflow-hidden mt-4"
    >
      {/* ── Purple-700 Cosmic Launchpad Horizon ── */}
      <div className="absolute bottom-[-45%] left-1/2 -translate-x-1/2 w-[120%] md:w-[90%] h-[85%] bg-purple-950/80 rounded-[100%] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-55%] left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[75%] bg-purple-700/35 rounded-[100%] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-65%] left-1/2 -translate-x-1/2 w-[40%] h-[50%] bg-purple-500/20 rounded-[100%] blur-[60px] pointer-events-none" />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-700/50 text-purple-300 text-[10px] font-semibold uppercase tracking-widest mb-3 backdrop-blur-md shadow-[0_0_12px_rgba(126,34,206,0.25)]">
          <Sparkles className="w-2.5 h-2.5 text-purple-400" />
          <span>Begin Your System</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-[1.12] mb-3">
          The system is ready.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-white">
            Are you ready to ascend?
          </span>
        </h2>

        <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-light mb-6">
          Join the focused operators turning scattered ambitions into architectural momentum. Stop relying on fleeting motivation. Start building daily discipline.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/signup"
            className="group relative w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white text-xs font-semibold rounded-full shadow-[0_0_20px_rgba(126,34,206,0.4)] hover:shadow-[0_0_28px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Ascending Free</span>
            <ArrowRight className="w-3 h-3 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center bg-purple-950/40 border border-purple-700/50 text-slate-200 text-xs font-semibold rounded-full hover:bg-purple-900/40 hover:text-white hover:border-purple-500/60 backdrop-blur-md transition-all"
          >
            <span>Sign In to Workspace</span>
          </Link>
        </div>

        <p className="mt-5 text-[9px] font-mono text-purple-400/80 uppercase tracking-wider">
          No credit card required • Build your first discipline engine free
        </p>
      </div>
    </section>
  );
}