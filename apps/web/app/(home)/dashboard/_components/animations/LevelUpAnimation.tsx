// src/components/dashboard/LevelUpDisplayEngine.tsx
"use client";

import React, { useRef } from "react";
import { Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react"; // 🚀 Native hook replacement

interface LevelUpAnimationProps {
  isTriggered: boolean;
  oldLevel: number;
  newLevel: number;
  onAnimationComplete: () => void;
}

export default function LevelUpAnimation({
  isTriggered,
  oldLevel,
  newLevel,
  onAnimationComplete,
}: LevelUpAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const oldNumRef = useRef<HTMLDivElement>(null);
  const newNumRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // 🎬 Native useGSAP lifecycle intercept execution loop
  useGSAP(
    () => {
      if (!isTriggered) return;

      // 🚀 THE SENIOR FIX: Instantly snap positions in the pre-render layout phase
      gsap.set(newNumRef.current, { y: "120%", opacity: 0 });
      gsap.set(oldNumRef.current, { y: "0%", opacity: 1 });

      const tl = gsap.timeline({
        onComplete: onAnimationComplete,
      });

      // 1. Reveal overlay frame smoothly
      tl.to(overlayRef.current, { opacity: 1, display: "flex", duration: 0.2 });

      // 2. Flash impact bloom
      tl.fromTo(
        flashRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.4, scale: 1.4, duration: 0.15 },
      );
      tl.to(flashRef.current, { opacity: 0, duration: 0.3 });

      // 3. Kinetic Split Text Slice Transition Loop
      tl.to(
        oldNumRef.current,
        { y: "-120%", opacity: 0, duration: 0.4, ease: "back.in(1.5)" },
        "-=0.2",
      );
      tl.to(
        newNumRef.current,
        { y: "0%", opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
        "-=0.3",
      );

      // 4. Hold presentation view layout, then dissolve mask down
      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.3, ease: "power2.inOut" },
        "+=1.2",
      );
    },
    {
      dependencies: [isTriggered],
      scope: overlayRef, // 🛡️ Safely bounds all internal operations to this node context tree
    },
  );

  if (!isTriggered) return null;

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-50 bg-[#0C0A12] flex flex-col items-center justify-center rounded-2xl p-6 border border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)] opacity-0"
    >
      <div
        ref={flashRef}
        className="absolute inset-0 bg-purple-400 rounded-2xl opacity-0 mix-blend-overlay"
      />

      <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[10px] tracking-widest mb-2 animate-pulse">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Stage Ascended</span>
      </div>

      <div className="relative h-20 w-full flex items-center justify-center overflow-hidden">
        {/* Old Level */}
        <div
          ref={oldNumRef}
          className="absolute text-7xl font-black font-mono text-zinc-700 select-none"
        >
          {oldLevel}
        </div>
        {/* New Level */}
        <div
          ref={newNumRef}
          className="absolute text-7xl font-black font-mono bg-linear-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-0 translate-y-[120%] select-none"
        >
          {newLevel}
        </div>
      </div>
    </div>
  );
}