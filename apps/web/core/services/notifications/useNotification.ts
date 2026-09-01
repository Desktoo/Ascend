// src/core/services/notifications/useNotifications.ts
import useSWR from "swr";
import { apiClient } from "../client";

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  // SWR automatically handles caching and loading states
  const { data, error, isLoading, mutate } = useSWR<AppNotification[]>(
    "/notifications", 
    () => apiClient<AppNotification[]>("/notifications")
  );

  const removeNotification = async (id: string) => {
    // 1. Optimistic UI update (instantly removes it from the screen)
    mutate((current) => current?.filter((n) => n._id !== id), false);
    
    // 2. Tell the backend to delete it from MongoDB
    await apiClient(`/notifications/${id}`, { method: "DELETE" });
    
    // 3. Re-validate to ensure sync
    mutate();
  };

  const clearAllNotifications = async () => {
    mutate([], false);
    await apiClient("/notifications", { method: "DELETE" });
    mutate();
  };

  return {
    notifications: data || [],
    isLoading,
    error,
    removeNotification,
    clearAllNotifications,
  };
}