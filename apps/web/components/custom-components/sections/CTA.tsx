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
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto"
      >
        {/* Minimalist Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-[11px] font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>Start Your Daily System</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-[1.18] mb-3">
          Stop relying on fleeting motivation.
          <br />
          <span className="text-zinc-400">
            Build unshakeable daily discipline.
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed font-normal mb-6">
          Ascend turns scattered goals and habits into an executable daily queue. Join focused builders mastering their time.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-200" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto h-9 sm:h-10 px-5 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
          >
            <span>Sign In to Workspace</span>
          </Link>
        </div>

        <p className="mt-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          Free to use • No credit card required
        </p>
      </div>
    </section>
  );
}