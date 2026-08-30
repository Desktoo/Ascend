import { apiClient } from "@/core/services/client";
import useSWR from "swr";

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  avatar_url: string | null;
  rank: string;
  dayStartTime: string;
  level: number;
  hasSubmittedReflectionToday: boolean;
  hasPassword: boolean;
  isOnboarded: boolean;
  timeZone: string;
  xp: number;
}

export default function useUserProfile() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<UserProfile>(
    "/user/profile",
    () => apiClient<UserProfile>("/user/profile"),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: (err) => {
        return err?.message !== "SESSION_EXPIRED" && !err?.message?.includes("401");
      },
    }
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}

