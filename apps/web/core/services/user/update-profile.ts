import { ProfileFormValues, UserProfile } from "@/core/types/user.types";
import { apiClient } from "../client";

export const userService = {
  /**
   * SWR Mutation Fetcher for PATCH /user/profile
   * Accepts { arg } matching the Partial<ProfileFormValues> payload
   */
  updateProfile: async (
    url: string,
    { arg }: { arg: Partial<ProfileFormValues> },
  ): Promise<UserProfile> => {
    return await apiClient<UserProfile>(url, {
      method: "PATCH",
      body: JSON.stringify(arg),
    });
  },
};