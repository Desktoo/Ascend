"use client";

import { useEffect, useState } from "react";

interface RadialGaugeProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  title: string;
}

export default function RadialGauge({ value, size = 130, strokeWidth = 8, title }: RadialGaugeProps) {
  const [progress, setProgress] = useState(0);
  
  // Clean clamp
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    // Gentle animation timeout to trigger mount transitions nicely with GSAP or standard CSS
    const timer = setTimeout(() => setProgress(clampedValue), 150);
    return () => clearTimeout(timer);
  }, [clampedValue]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Glow Filters */}
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track Outer Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#16161a]"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Active Value Progress Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-url(#gauge-gradient) transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          filter="url(#gauge-glow)"
        />

        {/* Dynamic Color Gradient Definition */}
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
            <stop offset="100%" stopColor="#6366f1" /> {/* indigo-500 */}
          </linearGradient>
        </defs>
      </svg>

      {/* Internal Value Text Blocks */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <span 
          className="text-2xl font-bold tracking-tighter text-white" 
          style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}
        >
          {clampedValue}%
        </span>
        <span 
          className="text-[9px] font-bold uppercase tracking-widest text-zinc-500"
          style={{ fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}