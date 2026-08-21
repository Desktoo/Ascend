import { apiClient } from "@/core/services/client";
import useSWR from "swr";

interface UserProfile {
  id: string;
  userName: string;
  email: string;
  avatar_url: string | null;
  rank: string;
  dayStartTime: string;
  level: number;
  hasSubmittedReflectionToday: boolean;
  hasPassword: boolean;
  timeZone: string;
  xp: number;
}

export default function useUserProfile() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<UserProfile>("/user/profile", () => apiClient<UserProfile>("/user/profile"))

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
    isValidating
  }
}

