"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BgWrapper({ children }: { children: React.ReactNode }) {
  const core1Ref = useRef<HTMLDivElement>(null);
  const core2Ref = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we have our elements before animating
    if (!core1Ref.current || !core2Ref.current || !centerRef.current || !contentRef.current) return;

    // ── 1. Fluid Aurora 1 (Top Left) ──
    // Infinite rotation
    gsap.to(core1Ref.current, {
      rotation: 360,
      duration: 25,
      repeat: -1,
      ease: "none",
    });
    // Shape shifting and pulsing
    gsap.to(core1Ref.current, {
      scale: 1.15,
      borderRadius: "70% 30% 50% 50% / 30% 30% 70% 70%",
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // ── 2. Fluid Aurora 2 (Bottom Right) ──
    gsap.to(core2Ref.current, {
      rotation: -360,
      duration: 30,
      repeat: -1,
      ease: "none",
    });
    gsap.to(core2Ref.current, {
      scale: 1.2,
      borderRadius: "100% 60% 60% 100% / 100% 100% 60% 60%",
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // ── 3. Center Highlight Float ──
    gsap.to(centerRef.current, {
      y: -30,
      scale: 1.05,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // ── 4. Cinematic Entrance for the Glass Card ──
    gsap.fromTo(
      contentRef.current,
      { y: 50, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.1 }
    );

  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#02040A] flex items-center justify-center overflow-hidden selection:bg-[#3399FF]/30">
      
      {/* ── Layer 1: The Deep Void (Base) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#051024_0%,_#02040A_100%)] z-0" />

      {/* ── Layer 2: Topographical Mapping (Texture) ── */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.002' numOctaves='3' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 -1' in='noise' result='coloredNoise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
        }}
      />

      {/* ── Layer 3: Fluid "Flow State" Aurora Gradients (GSAP Targets) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen opacity-60">
        
        {/* Main glowing core (Neon Blue) */}
        <div 
          ref={core1Ref}
          className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-[#004F98] blur-[120px] opacity-40 origin-center" 
          style={{ borderRadius: "40% 60% 70% 30% / 40% 40% 60% 50%" }}
        />
        
        {/* Accent secondary core (Deep Indigo/Teal) */}
        <div 
          ref={core2Ref}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[#007BFF] blur-[140px] opacity-30 origin-center" 
          style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
        />

        {/* Center highlight for the glass card to refract */}
        <div 
          ref={centerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#3399FF] rounded-[100%] blur-[160px] opacity-20" 
        />
      </div>

      {/* ── Layer 4: Vignette & Scanlines (Cinematic Polish) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_20%,_#02040A_100%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(transparent 50%, #000 50%)', backgroundSize: '100% 4px' }} 
      />

      {/* ── Layer 5: The Payload (Your UI) ── */}
      {/* We removed the Tailwind animate-in classes and are letting GSAP handle the mounting entrance */}
      <div ref={contentRef} className="relative z-10 w-full opacity-0">
        {children}
      </div>

    </div>
  );
}