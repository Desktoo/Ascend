"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Trophy, Award, ChevronsUp } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface RankUnlockAnimationProps {
  isTriggered: boolean;
  oldRank: string; 
  newRank: string;
  onAnimationComplete: () => void;
}

export default function RankUnlockAnimation({
  isTriggered,
  oldRank,
  newRank,
  onAnimationComplete,
}: RankUnlockAnimationProps) {
  const masterContainerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const iconStageRef = useRef<HTMLDivElement>(null);
  const awardIconRef = useRef<SVGSVGElement>(null);
  
  const levelUpRef = useRef<HTMLDivElement>(null);
  const chevronLeftRef = useRef<SVGSVGElement>(null);
  const chevronRightRef = useRef<SVGSVGElement>(null);
  const oldRankTextRef = useRef<HTMLSpanElement>(null);
  const newRankSubtitleRef = useRef<HTMLSpanElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const rankTextRef = useRef<HTMLHeadingElement>(null);
  
  const radialGlowRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const closeTextRef = useRef<HTMLDivElement>(null);

  // Dual-state machine to prevent visual layout popping (FOUC)
  const [isRendered, setIsRendered] = useState(false);

  const splitChars = useMemo(() => {
    return newRank.split("").map((char, index) => (
      <span
        key={index}
        className="inline-block opacity-0 translate-y-10"
        style={{ display: char === " " ? "inline" : "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [newRank]);

  useEffect(() => {
    if (isTriggered) {
      setIsRendered(true);
    } else {
      setIsRendered(false);
    }
  }, [isTriggered]);

  useGSAP(
    () => {
      if (!isRendered) return;

      const charsQuery = gsap.utils.selector(rankTextRef)("span");

      // Secure Layout Snaps: Hide everything cleanly BEFORE browser paint
      gsap.set(masterContainerRef.current, { opacity: 0, display: "flex" });
      gsap.set(radialGlowRef.current, { scale: 0, opacity: 0 });
      gsap.set(closeTextRef.current, { opacity: 0, y: 10 });
      gsap.set(levelUpRef.current, { opacity: 0, y: -20 });
      gsap.set(oldRankTextRef.current, { opacity: 0, y: 0 });
      gsap.set(newRankSubtitleRef.current, { opacity: 0, y: 50 });
      gsap.set(titleTextRef.current, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        onComplete: onAnimationComplete,
        delay: 0.1,
      });

      // ─ Step 1: Cinematic Reveal
      tl.to(masterContainerRef.current, { opacity: 1, duration: 0.3 });
      tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 0.95, backdropFilter: "blur(25px)", duration: 0.6 }, "<");

      // ─ Step 2: Lighting & Ambient Atmos
      tl.to(radialGlowRef.current, { scale: 1.6, opacity: 0.35, duration: 1.4, ease: "power2.out" }, "-=0.2");
      tl.fromTo(beamRef.current, { y: "-100%", opacity: 0 }, { y: "100%", opacity: 0.2, duration: 2, ease: "power2.inOut" }, "-=1.2");

      // ─ Step 3: Icon Impact Burst
      tl.fromTo(iconStageRef.current,
        { scale: 0, opacity: 0, y: 60, rotation: -45 },
        { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 0.85, ease: "back.out(1.7)" },
        "-=1.5"
      );

      tl.to(awardIconRef.current, { rotationY: 360, duration: 1.6, ease: "power2.inOut" }, "-=0.4");

      // ─ Step 4: Pure Overlapping Text Swap
      tl.to(oldRankTextRef.current, { opacity: 0.9, duration: 0.5 }, "-=0.4");
      tl.to(oldRankTextRef.current, { y: -50, opacity: 0, duration: 0.6, ease: "power2.in" }, "-=0.05");
      
      tl.to(newRankSubtitleRef.current, { 
        opacity: 1, 
        y: 0, 
        className: "+=text-purple-400 font-bold", 
        duration: 0.5, 
        ease: "back.out(1.4)" 
      }, "-=0.35");

      // ─ Step 5: Level Up Alert & Blinking Chevrons
      tl.to(levelUpRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }, "-=0.2");
      
      // Infinite standalone Chevron Blinking Loop bound to timeline context scope
      tl.add(
        gsap.fromTo([chevronLeftRef.current, chevronRightRef.current], 
          { opacity: 0.3, scale: 0.9 },
          { opacity: 1, scale: 1.1, duration: 0.4, yoyo: true, repeat: -1, ease: "power1.inOut" }
        ),
        "-=0.2"
      );

      // ─ Step 6: Master Kinetic Typography
      tl.to(titleTextRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.15");

      tl.to(charsQuery, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "back.out(2.2)",
        stagger: { each: 0.04, from: "center" }
      }, "-=0.25");

      // ─ Step 7: Presentation Hold & Closing Instructions
      tl.to(closeTextRef.current, { opacity: 0.5, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
      
      tl.to(masterContainerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        delay: 1.5 
      }, "+=0.5");
    },
    { dependencies: [isRendered, newRank, oldRank], scope: masterContainerRef }
  );

  if (!isRendered) return null;

  return (
    <div
      ref={masterContainerRef}
      className="fixed inset-0 z-[200] opacity-0 flex flex-col items-center justify-center p-6 select-none cursor-pointer"
      onClick={onAnimationComplete}
    >
      <div ref={backdropRef} className="absolute inset-0 bg-black/90" />

      {/* Lighting components arrays */}
      <div ref={radialGlowRef} className="absolute w-[55vh] h-[55vh] bg-purple-950/80 rounded-full blur-[140px] pointer-events-none" />
      <div ref={beamRef} className="absolute top-0 h-[70vh] w-0.5 bg-gradient-to-b from-transparent via-purple-400 to-transparent pointer-events-none" />

      <div className="relative z-[210] flex flex-col items-center gap-8 max-w-2xl w-full">
        
        {/* 🏆 ACHIEVEMENT SHIELD BLOCK */}
        <div ref={iconStageRef} className="relative flex items-center justify-center h-44 w-44 opacity-0">
          <div className="absolute inset-0 rounded-full bg-purple-950/50 border-2 border-purple-500/30 scale-110 shadow-[0_0_100px_rgba(168,85,247,0.25)]" />
          
          <Award
            ref={awardIconRef}
            className="h-28 w-28 will-change-transform"
            style={{ stroke: "url(#rank_unlock_grad)" }}
          />
          
          <svg width="0" height="0">
            <linearGradient id="rank_unlock_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
          </svg>
        </div>

        {/* 📝 PERFORMANCE TEXT PANEL OBJECTS */}
        <div className="flex flex-col items-center text-center gap-4 w-full">
          
          {/* 🚀 OVERLAPPING SWAP CONTAINER */}
          <div className="relative w-full h-24 flex items-center justify-center text-4xl sm:text-6xl font-black tracking-tight text-slate-400 font-sans overflow-hidden">
            <span 
              ref={oldRankTextRef} 
              className="absolute text-slate-500 line-through decoration-slate-500/40 will-change-transform whitespace-nowrap"
            >
              {oldRank}
            </span>
            <span 
              ref={newRankSubtitleRef} 
              className="absolute will-change-transform whitespace-nowrap"
            >
              {newRank}
            </span>
          </div>

          {/* ⚡ LEVELLED UP INDICATOR DECK */}
          <div 
            ref={levelUpRef} 
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-widest text-purple-400 uppercase bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)] opacity-0"
          >
            <ChevronsUp ref={chevronLeftRef} className="h-4 w-4 text-purple-400 will-change-transform" />
            <span>Levelled Up</span>
            <ChevronsUp ref={chevronRightRef} className="h-4 w-4 text-purple-400 will-change-transform" />
          </div>

          <h1
            ref={titleTextRef}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight opacity-0 flex items-center gap-2"
          >
            <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
            <span>Congratulations!</span>
            <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
          </h1>

          {/* KINETIC CHARACTER PATH VECTOR ENTRY */}
          <h2
            ref={rankTextRef}
            className="text-5xl sm:text-7xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-200 via-white to-pink-200 bg-clip-text text-transparent drop-shadow-xl select-none"
          >
            {splitChars}
          </h2>
        </div>

        <div ref={closeTextRef} className="text-xs font-semibold tracking-wider uppercase text-slate-500 animate-pulse mt-10 opacity-0">
          Click anywhere to close interface milestone...
        </div>
      </div>
    </div>
  );
}