import { apiClient } from "../client";
import { TaskDTO, TaskResponse } from "../../types/tasks.types";

export const taskService = {
  createTask: async (
    url: string,
    { arg }: { arg: TaskDTO },
  ): Promise<TaskResponse> => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return await apiClient<TaskResponse>(url, {
      method: "POST",
      body: JSON.stringify(arg),
      headers: {
        "x-user-timezone": userTimezone,
      }
    });
  },

  getAllTasks: async (url: string): Promise<TaskResponse[]> => {
    return await apiClient<TaskResponse[]>(url, {
      method: "GET",
    });
  },
};
