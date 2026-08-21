import { ChangePasswordValues } from "@/core/types/user.types";
import { apiClient } from "../client";

export const securityService = {
  /**
   * SWR Mutation fetcher for updating account password
   */
  changePassword: async (
    url: string,
    { arg }: { arg: ChangePasswordValues }
  ): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(url, {
      method: "PATCH",
      body: JSON.stringify({
        currentPassword: arg.currentPassword,
        newPassword: arg.newPassword,
      }),
    });
  },
};