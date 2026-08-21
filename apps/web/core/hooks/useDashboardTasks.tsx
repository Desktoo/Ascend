import { apiClient } from "@/core/services/client";
import useSWR, { useSWRConfig } from "swr";

export interface Task {
  id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueTime: string;
  status: "PENDING" | "DONE";
}

export interface DashboardResponse {
  todaysTasks: Task[];
  abandonedTasks: Task[];
}

export default function useDashboardTasks() {
  const { mutate } = useSWRConfig();

  const dashboardUrl = `/tasks/dashboard`;

  const { data, error, isLoading } = useSWR<DashboardResponse>(
    dashboardUrl,
    () => apiClient<DashboardResponse>(dashboardUrl),
  );

  const globalInvalidate = () => mutate((key) => typeof key === 'string' && key.startsWith("/tasks"));

  const handleRescue = async (taskIds: string[]) => {
    await apiClient("/tasks/abandoned/rescue", { method: 'POST', body: JSON.stringify({ taskIds }) });
    await globalInvalidate();
  }

  const handlePurge = async (taskIds: string[]) => {
    const purgeUrl = `/tasks/abandoned/purge`;
    await apiClient(purgeUrl, { method: 'POST', body: JSON.stringify({ taskIds }) });
    await globalInvalidate();
  }

  return {
    todayTasks: data?.todaysTasks ?? [],
    abandonedTasks: data?.abandonedTasks ?? [],
    isLoading,
    isError: error,
    dashboardUrl,
    handlePurge,
    handleRescue,
    globalInvalidate,
  };
}
