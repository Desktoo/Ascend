import { ProfileFormValues, UserProfile } from "@/core/types/user.types";
import { apiClient } from "../client";

export const userService = {
  /**
   * SWR Mutation Fetcher for PATCH /user/profile
   * Accepts { arg } matching the Partial<ProfileFormValues> payload or FormData for file uploads
   */
  updateProfile: async (
    url: string,
    { arg }: { arg: Partial<ProfileFormValues> | FormData },
  ): Promise<UserProfile> => {
    const isFormData = arg instanceof FormData;
    return await apiClient<UserProfile>(url, {
      method: "PATCH",
      body: isFormData ? arg : JSON.stringify(arg),
    });
  },
};