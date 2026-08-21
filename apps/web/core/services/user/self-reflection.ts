import { ReflectionSubmissionPayload, SelfReflectionResponse } from "@/app/(home)/dashboard/_components/overlays/DailyReflectionOverlay/Daily-Reflection.types";
import { apiClient } from "@/core/services/client";


export interface SubmitSelfReflectionPayload extends ReflectionSubmissionPayload {
  timeZone: string;
}

export async function submitSelfReflection(
  payload: SubmitSelfReflectionPayload
): Promise<SelfReflectionResponse> {
  return await apiClient<SelfReflectionResponse>("/user/self-reflection", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}