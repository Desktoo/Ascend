"use client";

import { useState } from "react";
import { X, Flame, Zap, Target, Plus } from "lucide-react";

interface CreateGoalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: {
    title: string;
    description: string;
    category: string;
    priority: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export default function CreateGoalOverlay({
  isOpen,
  onClose,
  onSave,
}: CreateGoalOverlayProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Dev",
    priority: "STANDARD", // CRITICAL, STANDARD, LOW
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate || !form.endDate) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#A855F7]/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden animate-in zoom-in-95 duration-300 ease-out transition-colors">
        {/* Decorative Top Radial Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#A855F7]/10 rounded-full blur-[50px] pointer-events-none" />

        {/* Header Section */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 dark:border-white/5 relative z-10">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">
            Initialize Objective
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium tracking-wide">
              Goal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Master Advanced NestJS"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full h-10 px-4 bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#A855F7]/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium tracking-wide">
              Scope Description
            </label>
            <textarea
              rows={2}
              placeholder="Outline core execution targets and system deliverables..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#A855F7]/50 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Node */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium tracking-wide block">
                Category Node
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-purple-500/50"
              >
                <option value="Dev">Dev (Engineering)</option>
                <option value="Skill">Skill (Algorithms)</option>
                <option value="Health">Health (Athletics)</option>
                <option value="Mind">Mind (Productivity)</option>
              </select>
            </div>
            
            {/* Priority Level */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium tracking-wide block">
                Priority Level
              </label>
              <div className="flex items-center h-10 bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/5 rounded-xl p-1 gap-1">
                {["LOW", "STANDARD", "CRITICAL"].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setForm({ ...form, priority: lvl })}
                    className={`flex-1 flex items-center justify-center text-[10px] font-bold tracking-wider rounded-lg transition-colors h-full ${
                      form.priority === lvl
                        ? lvl === "CRITICAL" ? "bg-red-500/20 text-red-500" : lvl === "STANDARD" ? "bg-purple-500/20 text-purple-500" : "bg-blue-500/20 text-blue-500"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                  >
                    {lvl === "CRITICAL" && <Flame className="w-3 h-3 mr-1" />}
                    {lvl === "STANDARD" && <Zap className="w-3 h-3 mr-1" />}
                    {lvl === "LOW" && <Target className="w-3 h-3 mr-1" />}
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date Tracking */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium tracking-wide">
                Start Date
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium tracking-wide">
                Target Deadline
              </label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Action Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 h-9 bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-500/10 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Deploy Objective
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}