"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

interface RadialGaugeProps {
  value: number; // Percentage from 0 to 100
  previousValue?: number; // Optional comparison value to calculate delta automatically
  title?: string;
  size?: number; // Overall bounding width/height in px
  strokeWidth?: number; // Track ring thickness
}

export default function RadialGauge({
  value = 0,
  previousValue,
  size = 110,
  strokeWidth = 8,
}: RadialGaugeProps) {
  // Clamping value between strict 0-100 limits to safeguard mathematical calculations
  const clampedValue = Math.max(0, Math.min(value, 100));

  {/* ── Mathematical Configurations for Gauge Arc ── */}
  const radius = 50 - strokeWidth; // Base viewBox coordinate tracking ring radius
  const circumference = 2 * Math.PI * radius;
  
  // A 3/4 gauge spans 270 degrees out of a full 360-degree circle.
  // The visible arc space represents 75% (0.75) of a full circle's circumference.
  const totalArcLength = circumference * 0.75; 
  const strokeDashoffset = totalArcLength - (clampedValue / 100) * totalArcLength;

  {/* ── Calculate Percentage Delta Variance ── */}
  const hasDelta = previousValue !== undefined;
  const deltaValue = hasDelta ? value - previousValue : 0;
  const isPositive = deltaValue >= 0;

  return (
    <div 
      className="flex flex-col items-center justify-center  bg-transparent rounded-2xl transition-colors duration-300"
      style={{ width: size + 20 }}
    >
      

      {/* Main SVG Render Core */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg 
          className="w-full h-full transform" 
          viewBox="0 0 100 100"
          style={{ transform: "rotate(135deg)" }} // Rotates circle so the open mouth gap faces downwards
        >
          {/* Custom System Gradient Definition Node */}
          <defs>
            <linearGradient id="gauge-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF3" />   {/* Soft Indigo */}
              <stop offset="50%" stopColor="#A855F7" />  {/* Vibrant Violet */}
              <stop offset="100%" stopColor="#6366F1" /> {/* Deep Royal Indigo */}
            </linearGradient>
          </defs>

          {/* 1. Underlying Base Background Track Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-[#1C1C1F] transition-colors"
            strokeDasharray={`${totalArcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* 2. Active Progress Foreground Fill Overlay Arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="url(#gauge-purple-gradient)"
            strokeWidth={strokeWidth}
            // First arg maps visible line, second maps standard whitespace tracking
            strokeDasharray={`${totalArcLength} ${circumference}`}
            style={{ 
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" // Custom ease-out-back pop spring curve
            }}
            strokeLinecap="round"
          />
        </svg>

        {/* 3. Absolute Centered Content Panel Text Stacks */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-1 select-none">
          {/* Percentage Value Indicators string */}
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter transition-all duration-300 flex gap-0.5 items-center">
            {clampedValue}<span className="text-base font-medium text-slate-400 dark:text-slate-500 font-sans ml-0.5">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}