import { apiClient } from "@/core/services/client";

export interface UserActivePingResponse {
  success: boolean;
}

/**
 * Sends a background activity ping to update Redis lastActive state.
 */
export async function pingUserActive(): Promise<UserActivePingResponse> {
  return await apiClient<UserActivePingResponse>("/user/active", {
    method: "POST",
  });
}