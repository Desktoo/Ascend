"use client";

import React, { useState } from "react";
import { X, Flame, Zap, Target, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { TaskDTO, Priority } from "@/core/types/tasks.types";
import useSWRMutation from "swr/mutation";
import { taskService } from "@/core/services/tasks/tasks.service";
import { useSWRConfig } from "swr";
import { Task } from "@/core/hooks/useDashboardTasks";

interface TaskFormInputs {
  title: string;
  priority: Priority;
  dueTime: string;
}

interface CreateTaskOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  todaysTasks: Task[];
  abandonedTasks: Task[];
  dashboardUrl: string;
}

export default function CreateTaskOverlay({
  isOpen,
  onClose,
  todaysTasks,
  abandonedTasks,
  dashboardUrl,
}: CreateTaskOverlayProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  const { register, handleSubmit, control, reset } = useForm<TaskFormInputs>({
    values: {
      title: "",
      priority: Priority.MEDIUM,
      dueTime: "00:00",
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    "/tasks/create",
    taskService.createTask,
  );

  if (!isOpen) return null;

  const onSubmit = async (data: TaskFormInputs) => {
    console.log("this is data before processing: ", data);

    setSubmitError(null);
    try {
      const now = new Date();

      const [hours, minutes] = data.dueTime.split(":").map(Number);

      const localTaskDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0,
        0,
      );

      let mappedPriority: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
      if (data.priority === Priority.HIGH) mappedPriority = "HIGH";
      if (data.priority === Priority.LOW) mappedPriority = "LOW";

      const backendPayload = {
        title: data.title,
        priority: mappedPriority,
        dueTime: localTaskDate.toISOString(),
      };

      const serverResponseTask = await trigger(
        backendPayload as unknown as TaskDTO,
      );

      if (dashboardUrl) {
        const updatedDashboardCache = {
          todaysTasks: [...todaysTasks, serverResponseTask],
          abandonedTasks,
        };

        mutate(dashboardUrl, updatedDashboardCache, false);
      }
      reset();
      onClose();
      mutate((key) => typeof key === "string" && key.startsWith("/tasks"));
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Submission failed";
      setSubmitError(msg);
    }
  };

  // Minimal active state background styling helper (Yellow & Green variant)
  const getPriorityStyle = (current: Priority, activeValue: Priority) => {
    if (activeValue !== current) {
      return "bg-transparent border-slate-800 text-slate-400 hover:bg-white/5";
    }
    switch (current) {
      case Priority.HIGH:
        return "bg-rose-500/10 border-rose-500/40 text-rose-400";
      case Priority.LOW:
        return "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
      default:
        return "bg-amber-500/10 border-amber-500/40 text-amber-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      {/* ── Main Modal Container ── */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#121214] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header Section */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800/60 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              New Task
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add an objective to your roadmap queue
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Form Content Area */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
        >
          {/* Content Row 1: Task Title Input */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs ml-1 font-medium text-slate-400">
              Task Identifier
            </label>
            <Input
              type="text"
              required
              style={{ outline: "none" }}
              placeholder="e.g., Finish Project report"
              {...register("title", { required: true })}
              className="w-full h-10 bg-zinc-950/40 border-slate-800 rounded-md text-sm text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-[#818CF8]/40 focus-visible:border-[#818CF8]/40 transition-all font-sans"
            />
          </div>

          {/* Content Row 3: Target Due Time Component Row */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs ml-1 font-medium text-slate-400 flex items-center gap-1.5">
              Target Daily Due Time
            </label>
            <div className="relative">
              <input
                type="time"
                style={{ outline: "none" }}
                required
                {...register("dueTime", { required: true })}
                className="w-full h-10 px-4 bg-zinc-950/40 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#818CF8]/40 focus:border-[#818CF8]/40 transition-all scheme-dark font-sans"
              />
            </div>
            <span className="text-[10px] text-slate-500 ml-1">
              Example: complete before 12:00 noon to maximize core morning
              momentum scores.
            </span>
          </div>

          {/* Content Row 4: Priority Selection Segment Tiles */}
          <div className="space-y-2 flex flex-col pt-1">
            <label className="text-xs font-medium ml-1 text-slate-400">
              Priority Level
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {/* High Priority */}
                  <button
                    type="button"
                    onClick={() => field.onChange(Priority.HIGH)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border text-xs font-medium tracking-wide transition-all ${getPriorityStyle(Priority.HIGH, field.value)}`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    High
                  </button>

                  {/* Medium Priority */}
                  <button
                    type="button"
                    onClick={() => field.onChange(Priority.MEDIUM)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border text-xs font-medium tracking-wide transition-all ${getPriorityStyle(Priority.MEDIUM, field.value)}`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Medium
                  </button>

                  {/* Low Priority */}
                  <button
                    type="button"
                    onClick={() => field.onChange(Priority.LOW)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border text-xs font-medium transition-all ${getPriorityStyle(Priority.LOW, field.value)}`}
                  >
                    <Target className="w-3.5 h-3.5" /> Low
                  </button>
                </div>
              )}
            />

            {submitError && (
              <p className="text-xs text-rose-400 font-medium ml-1 bg-rose-500/5 p-2 rounded border border-rose-500/10">
                {submitError}
              </p>
            )}
          </div>

          {/* Modal Footer Controls / Button Tray */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-4 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isMutating}
              className="h-9 px-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-md text-xs font-medium transition-colors"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isMutating}
              className="h-9 px-4 bg-[#818CF8] hover:bg-indigo-500 text-white rounded-md text-xs font-medium tracking-wide shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {isMutating ? "Saving Objective..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
