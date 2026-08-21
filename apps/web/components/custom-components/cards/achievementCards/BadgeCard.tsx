import React from "react";
import { Sparkles, Trophy, ShieldAlert, Flame } from "lucide-react";

export interface Badge {
  id: string;
  title: string;
  description: string;
  tier: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  isLocked?: boolean; // Added gamified locking parameter inspired by image_5b8447.png
  dateEarned?: string; // Added timestamp display inspired by image_5b8425.png
}

interface BadgeCardProps {
  badge: Badge;
  onClick: (badge: Badge) => void;
}

export default function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const IconComponent = badge.icon;
  const isLocked = badge.isLocked ?? false;

  // Premium tier styling matrix inspired by the bold 3D material variations in image_5b83ea.png
  const getPremiumTierSpecs = (tier: string) => {
    if (isLocked) {
      return {
        cardBg: "from-[#111113] to-[#141416]",
        borderStyle: "border-slate-900/80 group-hover:border-slate-800",
        textGradient: "from-slate-400 to-slate-500",
        tagStyle: "text-slate-500 bg-zinc-900/80 border-slate-800/60",
        auraGlow: "group-hover:shadow-none",
        discMesh: "border-slate-800/40 bg-zinc-950/40 text-slate-600 shadow-inner",
      };
    }

    switch (tier.toLowerCase()) {
      case "legendary":
        return {
          // Dynamic dual-tone fluid background mimicking image_5b83ea.png textures
          cardBg: "from-[#1d1410] via-[#121214] to-[#221610]",
          borderStyle: "border-orange-500/20 group-hover:border-orange-400/50",
          textGradient: "from-amber-200 via-orange-300 to-amber-100",
          tagStyle: "text-orange-400 bg-gradient-to-r from-orange-500/20 to-amber-500/10 border-orange-500/40",
          // Light-catching glass aura inspired by image_5b8425.png
          auraGlow: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.18)] shadow-[0_0_20px_rgba(249,115,22,0.03)]",
          discMesh: "border-orange-500/30 bg-gradient-to-b from-orange-500/20 to-amber-600/5 text-orange-400 shadow-[inset_0_2px_8px_rgba(249,115,22,0.3)]",
        };
      case "epic":
        return {
          cardBg: "from-[#18121e] via-[#121214] to-[#1d1026]",
          borderStyle: "border-purple-500/20 group-hover:border-purple-400/50",
          textGradient: "from-fuchsia-200 via-purple-300 to-indigo-200",
          tagStyle: "text-purple-400 bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border-purple-500/40",
          auraGlow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.18)] shadow-[0_0_20px_rgba(168,85,247,0.03)]",
          discMesh: "border-purple-500/30 bg-gradient-to-b from-purple-500/20 to-pink-600/5 text-purple-400 shadow-[inset_0_2px_8px_rgba(168,85,247,0.3)]",
        };
      case "rare":
        return {
          cardBg: "from-[#0e1714] via-[#121214] to-[#0a1c13]",
          borderStyle: "border-emerald-500/20 group-hover:border-emerald-400/50",
          textGradient: "from-teal-200 via-emerald-300 to-green-200",
          tagStyle: "text-emerald-400 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500/40",
          auraGlow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.18)] shadow-[0_0_20px_rgba(16,185,129,0.03)]",
          discMesh: "border-emerald-500/30 bg-gradient-to-b from-emerald-500/20 to-teal-600/5 text-emerald-400 shadow-[inset_0_2px_8px_rgba(16,185,129,0.3)]",
        };
      default:
        return {
          cardBg: "from-[#121215] to-[#15151a]",
          borderStyle: "border-slate-800 group-hover:border-[#818CF8]/40",
          textGradient: "from-slate-100 to-slate-300",
          tagStyle: "text-slate-300 bg-slate-900 border-slate-700",
          auraGlow: "group-hover:shadow-[0_0_30px_rgba(129,140,248,0.12)]",
          discMesh: "border-[#818CF8]/20 bg-zinc-950 text-slate-300 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]",
        };
    }
  };

  const ui = getPremiumTierSpecs(badge.tier);

  return (
    <div
      onClick={() => !isLocked && onClick(badge)}
      className={`relative overflow-hidden border rounded-3xl p-6 bg-gradient-to-br ${ui.cardBg} ${ui.borderStyle} ${ui.auraGlow} flex flex-col justify-between min-h-[175px] transition-all duration-500 ease-out group ${isLocked ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:-translate-y-1 active:scale-[0.98]"}`}
    >
      {/* Light Reflection Ribbon across the card surface */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* CARD TOPPER: Rarity Tag & Activation Indicators */}
      <div className="flex items-center justify-between gap-4 z-10 select-none">
        <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${ui.tagStyle}`}>
          {badge.tier}
        </span>
        
        {/* Dynamic metadata or locking badge matching the status architecture of image_5b8447.png */}
        {isLocked ? (
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider flex items-center gap-1">
            Locked
          </span>
        ) : badge.dateEarned ? (
          <span className="text-[9px] font-mono text-slate-500 tracking-tight uppercase">
            {badge.dateEarned}
          </span>
        ) : (
          <Trophy className="w-3.5 h-3.5 text-slate-700 group-hover:text-amber-400 transition-colors duration-300" />
        )}
      </div>

      {/* CARD CENTER: The Heavy 3D Medal Disc Element */}
      <div className="flex items-center gap-4 my-3 z-10">
        <div className={`relative h-16 w-16 flex items-center justify-center rounded-full border transition-transform duration-500 group-hover:scale-105 ${ui.discMesh}`}>
          {/* Light reflection outer rings adapted from the Apple design in image_5b8425.png */}
          <div className="absolute inset-[1px] rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-[3px] rounded-full border border-t-white/10 border-b-transparent border-l-transparent border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <IconComponent className="w-7 h-7 relative z-10 transition-transform duration-500 group-hover:rotate-6" />
          
          {/* Subtle spinning accent elements for active legendary badges */}
          {!isLocked && badge.tier === "legendary" && (
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/10 animate-[spin_20s_linear_infinite] group-hover:border-orange-500/30" />
          )}
        </div>

        {/* TYPOGRAPHY BLOCKS: Glossy headings reminiscent of high-tier game items */}
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {!isLocked && badge.tier === "legendary" && (
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse flex-shrink-0" />
            )}
            <h3 className={`text-base font-black tracking-wide font-mono uppercase truncate bg-gradient-to-r bg-clip-text text-transparent ${ui.textGradient}`}>
              {badge.title}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug font-medium line-clamp-2 group-hover:text-slate-300 transition-colors duration-300">
            {badge.description}
          </p>
        </div>
      </div>

      {/* CARD FOOTER: Subtle UI Framing Lines inspired by the leaderboard container borders in image_5b8466.png */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800/60 to-transparent relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-[2px] h-1 w-8 rounded-full bg-slate-900 group-hover:bg-[#818CF8]/30 transition-colors duration-500" />
      </div>
    </div>
  );
}