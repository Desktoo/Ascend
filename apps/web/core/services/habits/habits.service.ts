import { apiClient } from "../client";
import { HabitDto, HabitResponse } from "../../types/habits.types";

export const habitService = {
  createHabit: async (
    url: string,
    { arg }: { arg: HabitDto },
  ): Promise<HabitResponse> => {
    return await apiClient<HabitResponse>(url, {
      method: "POST",
      body: JSON.stringify(arg),
    });
  },
};
