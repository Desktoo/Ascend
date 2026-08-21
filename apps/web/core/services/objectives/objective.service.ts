import { GoalDto, GoalResponse } from "@/core/types/objective.types";
import { apiClient } from "../client";

export const objectiveService = {
  createObjective: async (
    url: string,
    { arg }: { arg: GoalDto },
  ): Promise<GoalResponse> => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return await apiClient<GoalResponse>(url, {
      method: "POST",
      body: JSON.stringify(arg),
      headers: {
        "x-user-timezone": userTimezone,
      }
    });
  },
};