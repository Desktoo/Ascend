"use client";

import Link from "next/link";
import { FaPlay } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-start min-h-screen px-4 pt-24 sm:pt-32 w-full max-w-6xl mx-auto overflow-hidden">
      
      {/* Deep Navy Ambient Glow behind the text */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0B213B] rounded-[100%] blur-[120px] opacity-50 pointer-events-none" />

      {/* SEO H1: Hidden visually, critical for screen readers and SEO */}
      <h1 className="sr-only">Ascend: Build Momentum and Design Your Future with AI Scheduling.</h1>
      
      {/* ── 1. Copy & CTA Section ── */}
      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B213B]/40 border border-[#0B213B] text-[#66B2FF] text-[10px] uppercase tracking-widest font-semibold mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(11,33,59,0.5)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3399FF] animate-pulse" />
          Ascend Engine v2.0
        </div>
        
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
          Build Momentum.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3399FF] via-[#99CCFF] to-white">
            Design Your Future.
          </span>
        </h2>
        
        {/* Subheadline */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Ascend turns your daily habits, long-term goals, and AI-driven scheduling into a unified system for unstoppable, consistent growth.
        </p>

        {/* Call To Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto h-12 px-8 flex items-center justify-center bg-white text-[#0B213B] text-sm font-semibold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] transition-all"
          >
            Start Your Ascent
          </Link>
          <button 
            type="button"
            className="w-full sm:w-auto h-12 px-8 flex items-center justify-center gap-3 bg-[#0B213B]/20 border border-[#0B213B] text-slate-300 text-sm font-semibold rounded-full hover:bg-[#0B213B]/60 hover:text-white backdrop-blur-sm transition-all group"
          >
            <FaPlay className="text-[10px] text-[#3399FF] group-hover:text-white transition-colors" />
            Watch the System
          </button>
        </div>
      </div>

      {/* ── 2. Dashboard Preview & Growth Visualization ── */}
      <div className="relative mt-20 w-full max-w-5xl mx-auto perspective-1000 z-10 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-300 ease-out fill-mode-both">
        
        {/* Custom style for the 3D tilt effect */}
        <style>{`
          .perspective-1000 { perspective: 1200px; }
          .dashboard-tilt { 
            transform: rotateX(12deg) scale(0.95); 
            transform-origin: top center; 
            box-shadow: 0 50px 100px -20px rgba(0,0,0,0.8), 0 0 40px rgba(0, 79, 152, 0.3);
          }
          @keyframes grow { from { height: 10%; } }
        `}</style>

        {/* Dashboard Container */}
        <div className="dashboard-tilt relative rounded-t-2xl border border-white/10 bg-[#050B14]/80 backdrop-blur-2xl overflow-hidden p-4 sm:p-6 pb-0">
          
          {/* Dashboard Header Bar */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
          </div>

          {/* Grid Layout for Mock UI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            
            {/* Widget 1: Habit & Goal Tracking */}
            <div className="col-span-1 rounded-xl bg-white/[0.02] border border-white/5 p-5">
              <h3 className="text-[11px] uppercase tracking-widest text-slate-500 mb-4 font-semibold">Active Habits</h3>
              <div className="space-y-3">
                {[
                  { name: "Deep Work Block", progress: "w-full", bg: "bg-[#3399FF]" },
                  { name: "Algorithm Practice", progress: "w-3/4", bg: "bg-[#004F98]" },
                  { name: "System Review", progress: "w-1/2", bg: "bg-slate-600" }
                ].map((habit, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <span className="text-xs text-slate-300">{habit.name}</span>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className={`h-full ${habit.progress} ${habit.bg} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Animated Growth Visualization */}
            <div className="col-span-1 md:col-span-2 rounded-xl bg-gradient-to-br from-[#0B213B]/40 to-transparent border border-[#0B213B] p-5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest text-[#66B2FF] mb-1 font-semibold">Momentum Score</h3>
                  <div className="text-3xl font-serif text-white font-bold">2,491 <span className="text-sm text-[#3399FF] font-sans">XP</span></div>
                </div>
                <div className="px-2 py-1 rounded bg-[#3399FF]/10 text-[#3399FF] text-[10px] font-bold border border-[#3399FF]/20">
                  +18.4% This Week
                </div>
              </div>

              {/* The Animated Chart */}
              <div className="absolute bottom-0 left-5 right-5 h-28 flex items-end justify-between gap-1 sm:gap-2">
                {[
                  { h: "30%", d: "0ms" },
                  { h: "45%", d: "100ms" },
                  { h: "35%", d: "200ms" },
                  { h: "60%", d: "300ms" },
                  { h: "55%", d: "400ms" },
                  { h: "80%", d: "500ms" },
                  { h: "100%", d: "600ms" }
                ].map((bar, i) => (
                  <div key={i} className="relative flex-1 bg-[#004F98]/20 rounded-t-md group">
                    {/* The growing bar */}
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[#004F98] to-[#3399FF] rounded-t-md group-hover:opacity-80 transition-opacity"
                      style={{ 
                        height: bar.h, 
                        animation: `grow 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                        animationDelay: bar.d 
                      }}
                    />
                    {/* Glowing dot on top of the last bar */}
                    {i === 6 && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#3399FF]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          {/* Base gradient overlay to fade out the bottom of the dashboard */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#02050A] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}