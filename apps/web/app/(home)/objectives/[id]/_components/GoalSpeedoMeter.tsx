// app/(home)/objectives/[id]/_components/GoalSpeedoMeter.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Activity } from "lucide-react";

gsap.registerPlugin(useGSAP);

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

interface GoalSpeedometerProps {
  velocity: number; // 0 to 100
}

const CENTER = 100;
const RADIUS = 68;
const STROKE = 14;
const START_ANGLE = 150;
const SWEEP = 240;
const SVG_ORIGIN = `${CENTER} ${CENTER}`; // rotation pivot, in the SVG's own coordinate system

const angleForValue = (v: number) => START_ANGLE + (v / 100) * SWEEP;

const pointOnArc = (angleDeg: number, r: number = RADIUS) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
};

const ARC_LENGTH = (2 * Math.PI * RADIUS * SWEEP) / 360;

const startPoint = pointOnArc(START_ANGLE);
const endPoint = pointOnArc(START_ANGLE + SWEEP);
const trackPath = `M ${startPoint.x} ${startPoint.y} A ${RADIUS} ${RADIUS} 0 1 1 ${endPoint.x} ${endPoint.y}`;

const TICKS = [0, 25, 50, 75, 100];

const needleTip = pointOnArc(START_ANGLE, RADIUS - 10);
const needleBase = pointOnArc(START_ANGLE, 14);
const perpRad = ((START_ANGLE + 90) * Math.PI) / 180;
const HALF_WIDTH = 3;
const needleP1 = { x: needleBase.x + HALF_WIDTH * Math.cos(perpRad), y: needleBase.y + HALF_WIDTH * Math.sin(perpRad) };
const needleP2 = { x: needleBase.x - HALF_WIDTH * Math.cos(perpRad), y: needleBase.y - HALF_WIDTH * Math.sin(perpRad) };
const needlePoints = `${needleP1.x},${needleP1.y} ${needleP2.x},${needleP2.y} ${needleTip.x},${needleTip.y}`;

export default function GoalSpeedometer({ velocity }: GoalSpeedometerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const activeArcRef = useRef<SVGPathElement>(null);
  const textValRef = useRef<HTMLSpanElement>(null);

  const targetVal = Math.min(100, Math.max(0, velocity));

  useGSAP(
    () => {
      // svgOrigin (not transformOrigin) — pins rotation to (100,100) in the
      // gauge's own coordinate space, regardless of the needle group's bbox.
      gsap.set(needleRef.current, { rotation: 0, svgOrigin: SVG_ORIGIN });
      gsap.set(activeArcRef.current, { strokeDashoffset: ARC_LENGTH });

      gsap.to(activeArcRef.current, {
        strokeDashoffset: ARC_LENGTH - (ARC_LENGTH * targetVal) / 100,
        duration: 1.6,
        ease: "power3.out",
      });

      gsap.to(needleRef.current, {
        rotation: (targetVal / 100) * SWEEP,
        duration: 1.6,
        ease: "back.out(1.4)",
        svgOrigin: SVG_ORIGIN,
      });

      const counter = { val: 0 };
      gsap.to(counter, {
        val: targetVal,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          if (textValRef.current) textValRef.current.innerText = `${Math.round(counter.val)}%`;
        },
      });
    },
    { scope: containerRef, dependencies: [targetVal] }
  );

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <div className="relative aspect-square w-full max-w-[13rem]">
        <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="ooklaPurpleGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient id="needleBeamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </linearGradient>
            <filter id="purpleGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path d={trackPath} fill="none" stroke="#181524" strokeWidth={STROKE} strokeLinecap="round" />

          <path
            ref={activeArcRef}
            d={trackPath}
            fill="none"
            stroke="url(#ooklaPurpleGradient)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            filter="url(#purpleGlow)"
          />

          {TICKS.map((t) => {
            const { x, y } = pointOnArc(angleForValue(t), RADIUS + 20);
            return (
              <text
                key={t}
                x={x}
                y={y}
                fill="#64748B"
                fontSize="9"
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="middle"
                style={mono}
              >
                {t}
              </text>
            );
          })}

          <g ref={needleRef}>
            <polygon points={needlePoints} fill="url(#needleBeamGradient)" filter="url(#purpleGlow)" />
            <circle cx={CENTER} cy={CENTER} r={5} fill="#FFFFFF" />
            <circle cx={CENTER} cy={CENTER} r={8} fill="none" stroke="#C084FC" strokeWidth={1.5} />
          </g>
        </svg>

        <div className="absolute inset-0 flex items-end justify-center pb-3">
          <span
            ref={textValRef}
            className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(192,132,252,0.4)]"
            style={display}
          >
            0%
          </span>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-slate-400">
        <Activity className="h-3.5 w-3.5 animate-pulse text-purple-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400" style={mono}>
          Execution Velocity
        </span>
      </div>
    </div>
  );
}