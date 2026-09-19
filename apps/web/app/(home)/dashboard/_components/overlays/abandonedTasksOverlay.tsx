"use client";

import React, { useState } from "react";
import { AlertCircle, ArrowRight, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AbandonedTasksOverlayProps {
  tasks: Array<{ id: string; title: string }>;
  onRescue: (taskIds: string[]) => Promise<void>;
  onPurge: (taskIds: string[]) => Promise<void>;
}

export default function AbandonedTasksOverlay({
  tasks,
  onRescue,
  onPurge,
}: AbandonedTasksOverlayProps) {
  const [isRescuing, setIsRescuing] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  if (!tasks || tasks.length === 0) return null;

  const targetIds = tasks.map((t) => t.id);

  const handleRescueClick = async () => {
    if (isRescuing || isPurging) return;
    setIsRescuing(true);
    try {
      await onRescue(targetIds);
    } catch (err) {
      console.error("Rescue mutation error:", err);
      toast.error("Failed to migrate tasks. Please try again.");
    } finally {
      setIsRescuing(false);
    }
  };

  const handlePurgeClick = async () => {
    if (isRescuing || isPurging) return;
    setIsPurging(true);
    try {
      await onPurge(targetIds);
    } catch (err) {
      console.error("Purge mutation error:", err);
      toast.error("Failed to discard tasks. Please try again.");
    } finally {
      setIsPurging(false);
    }
  };

  const isAnyLoading = isRescuing || isPurging;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* 🚀 Expanded width to max-w-lg for better readability */}
      <div className="w-full max-w-lg min-h-140 bg-[#121214] border border-slate-800/80 rounded-2xl p-7 shadow-2xl flex flex-col space-y-5 justify-between animate-in zoom-in-95 duration-500">
        <div className="flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white tracking-wide">
              Abandoned Tasks
            </h3>
          </div>
          <div className="p-3 rounded-xl items-center  flex gap-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
            <AlertCircle className="w-6 h-6" />
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You left <span className="text-amber-400 font-bold font-sans">{tasks.length} {tasks.length === 1 ? 'objective' : 'objectives'}</span> incomplete yesterday. Choose how to clear your timeline setup:
            </p>
          </div>
          
        </div>

        {/* 📋 Enhanced Tasks Box (Bigger text, cleaner list tiles) */}
        <div className="max-h-44 overflow-y-auto border border-slate-800/60 bg-zinc-950/50 rounded-xl p-2.5 space-y-2 custom-scrollbar">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="text-xs text-slate-300 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.01] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
              <span className="truncate font-medium">{task.title}</span>
            </div>
          ))}
        </div>
        </div>

        {/* Control Actions Panel */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {/* Discard List Button */}
          <Button
            type="button"
            variant="ghost"
            disabled={isAnyLoading}
            onClick={handlePurgeClick}
            className="h-10 text-xs px-4 text-rose-400 border border-rose-500/10 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-all font-medium disabled:opacity-50"
          >
            {isPurging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Discard Tasks
          </Button>

          {/* 🔥 Migrate to Today Button (Featuring animated gradient shimmer effects) */}
          <Button
            type="button"
            disabled={isAnyLoading}
            onClick={handleRescueClick}
            className="h-10 text-xs px-5 bg-purple-800 hover:scale-105 font-semibold text-white rounded-xl flex items-center gap-2 transition-all  active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden
              "
          >
            {isRescuing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Migrating...</span>
              </>
            ) : (
              <>
                <span>Migrate to Today</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>

      </div>

      {/* Global utility stylesheet injection handling keyframe anim definitions */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradientShift {
            0% { bg-position: 0% 50%; }
            50% { bg-position: 100% 50%; }
            100% { bg-position: 0% 50%; }
          }
        `
      }} />
    </div>
  );
}