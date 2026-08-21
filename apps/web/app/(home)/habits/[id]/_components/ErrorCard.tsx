import React from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  message: string;
}

export default function HabitErrorState({ message }: ErrorProps) {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0C] text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#121214] border border-slate-900 rounded-2xl p-6 text-center space-y-6 shadow-2xl">
        
        <div className="flex justify-center">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Unable to Load Habit
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed wrap-break-word">
            {message}
          </p>
        </div>

        <div className="pt-2">
          <Link 
            href="/habits" 
            className="inline-flex items-center gap-2 text-sm font-semibold bg-white/5 border border-slate-800 text-slate-300 hover:text-white hover:bg-white/10 transition-all px-4 py-2.5 rounded-xl w-full justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}