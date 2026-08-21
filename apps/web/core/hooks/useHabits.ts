import useSWR, { useSWRConfig } from "swr";
import { apiClient } from "../services/client";
import { HabitBackendLog, HabitDetailsPageResponse, HabitsPageResponse } from "../types/habits.types";
import { HeatmapActivity } from "@/components/ui/BaseHeatMap";
import { transformLogsToHeatmapData } from "@/app/(home)/habits/[id]/_utils/heatmapTransformer";


export function useHabits() {
  const { data, error, isLoading, mutate } = useSWR<HabitsPageResponse[]>(
    "/habits/all",
    () => apiClient<HabitsPageResponse[]>("/habits/all"),
  );

  console.log("this is data from the hook", data)

  return {
    habits: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useHabitDetails(id: string) {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<HabitDetailsPageResponse>(
    id ? `/habits/${id}` : null,
    () => apiClient<HabitDetailsPageResponse>(`/habits/${id}`)
  );

  const toggleHabitState = async () => {
    if(!data) return;

    const currentHabitState = data;

    const updatedhabit = {...data, isActive : !data.isActive}

    try {
      mutate(updatedhabit, false)

      globalMutate("/habits/all",
        (currentList: HabitsPageResponse[] | undefined) => {
          if(!currentList) return [];
          return currentList.map((h) => (h.id === id ? updatedhabit : h))
        },
        false
      );

      await apiClient(`/habits/${id}/toggle`, { method: "PATCH" });

      mutate();
      globalMutate("/habits/all");
    } catch (error) {
      console.error("Failed to toggle habit:", error);
      mutate(currentHabitState);
      globalMutate("/habits/all");
      throw error;
    }
  }

  const deleteHabit = async () => {
    if(!id) return;

    try {
      await apiClient(`/habits/${id}`, { method: "DELETE" });

      mutate(undefined, false)

      globalMutate("/habits/all",
        (currentList: HabitsPageResponse[] | undefined) => {
          if (!currentList) return [];
          return currentList.filter((h) => h.id !== id);
        },
        false
      );

      globalMutate("/habits/all");
    } catch (error) {
      console.error("Failed to delete habit:", error);
      throw error;
    }
  }

  return {
    habitDetails: data ?? null,
    isLoading,
    isError: error,
    mutate,
    toggleHabitState,
    deleteHabit
  }
}

export function useHabitlogs(habitId: string){
  // const { mutate: globalMutate } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<HabitBackendLog[]>(
    habitId ? `/habits/heatmap-logs?habitId=${habitId}` : null,
    () => apiClient<HabitBackendLog[]>(`/habits/heatmap-logs?habitId=${habitId}`)
  );

  const heatmapData: HeatmapActivity[] = data ? transformLogsToHeatmapData(data) : [];

  // Refine token expiration error messages
  const formattedError = error?.message === "SESSION_EXPIRED"
    ? "Your session has expired. Please log in again."
    : error?.message || null;

  return {
    heatmapData,
    isLoading,
    error: formattedError,
    mutate, // Expose mutate in case you need to refresh data after completing a habit
  };
}

