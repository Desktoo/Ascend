"use client";

import useSWR from "swr";
import { apiClient } from "@/core/services/client"; // Path to your apiClient
import { GoalDetailResponse, GoalPageResponse, GoalPlanningResponse, Objective, TaskLog } from "../types/objective.types";

const fetcher = (url: string) => apiClient<GoalPageResponse[]>(url);
const singleFetcher = (url: string) => apiClient<GoalDetailResponse>(url);
const logFetcher = (url: string) => apiClient<TaskLog[]>(url);
const planningFetcher = (url: string) => apiClient<GoalPlanningResponse[]>(url);

export function useObjective() {
  const { data, error, isLoading, mutate } = useSWR<GoalPageResponse[]>(
    "/goals/all",
    fetcher
  );

  // Map backend response directly to the Objective UI structure
  const objectives: Objective[] =
    data?.map((goal) => ({
      id: goal.id,
      title: goal.title,
      percentage: goal.currentProgress ?? 0,
      timeframe: goal.timeFrame,
      startDate: new Date(goal.startDate).toISOString().split("T")[0],
    })) || [];

  return {
    objectives,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useObjectiveDetail(goalId: string) {
  const { data, error, isLoading, mutate } = useSWR<GoalDetailResponse>(
    goalId ? `/goals/${goalId}` : null,
    singleFetcher
  );

  return {
    goal: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useObjectiveTaskLogs(goalId: string) {
  const { data, error, isLoading, mutate } = useSWR<TaskLog[]>(
    goalId ? `/goals/${goalId}/task-logs` : null,
    logFetcher
  )

  return {
    goalTaskLog: data,
    isError: error,
    isLoading,
    mutate
  }
}

export function useObjectiveNewTasks() {
  const { data, error, isLoading, mutate } = useSWR<GoalPlanningResponse[]>(
    "/goals/planning",
    planningFetcher
  );

  return {
    objectives: data || [],
    isLoading,
    isError: error,
    mutate
  };
}