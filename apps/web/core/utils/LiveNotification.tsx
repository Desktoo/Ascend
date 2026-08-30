// src/core/utils/triggerLiveNotification.tsx
import { toast } from "sonner";
import { Clock, Trophy, Target, Bell, X } from "lucide-react";

const getIconForType = (type: string) => {
  switch (type) {
    case "RANK_UP": return <Trophy className="w-4 h-4 text-amber-500" />;
    case "REMINDER": return <Clock className="w-4 h-4 text-blue-500" />;
    case "GOAL": return <Target className="w-4 h-4 text-emerald-500" />;
    default: return <Bell className="w-4 h-4 text-[#818CF8]" />;
  }
};

export const triggerLiveNotification = (payload: any) => {
  toast.custom((t) => (
    <div className="w-[350px] bg-[#121214] border border-slate-800 shadow-2xl rounded-xl p-4 flex gap-4 pointer-events-auto animate-in slide-in-from-right-8">
      
      {/* Icon Avatar */}
      <div className="relative flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-zinc-950/80 flex items-center justify-center border border-slate-800">
          {getIconForType(payload.type)}
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#818CF8] rounded-full border-2 border-[#121214]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm font-medium text-slate-200 truncate pr-2">
            {payload.title}
          </p>
          <span className="text-[11px] text-slate-500 whitespace-nowrap mt-0.5">
            Just now
          </span>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {payload.body}
        </p>

        {/* Optional Action Button */}
        {payload.type === "REMINDER" && (
          <button 
            onClick={() => toast.dismiss(t)}
            className="mt-3 text-xs font-medium bg-[#818CF8]/10 text-[#818CF8] hover:bg-[#818CF8]/20 px-3 py-1.5 rounded-md transition-colors"
          >
            Take Action
          </button>
        )}
      </div>

      {/* Close Button */}
      <button 
        onClick={() => toast.dismiss(t)}
        className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  ), {
    duration: 5000, // Stays on screen for 5 seconds before sliding away
  });
};