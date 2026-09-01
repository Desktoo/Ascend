// src/components/notifications/LiveNotificationManager.tsx
"use client";

import { useLiveNotifications } from "@/core/hooks/useLiveNotifications";
import useUserProfile from "@/core/hooks/useUserProfile";
// Import wherever you get your current user's ID from (adjust this to match your app)
// import { useUserProfile } from "@/core/hooks/useUserProfile"; 

export default function LiveNotificationManager() {
  // If you fetch user globally, you can do: const { user } = useUserProfile();
  // and pass user?.id below instead of taking it as a prop.
  const { user } = useUserProfile();
  
  useLiveNotifications(user?.id);

  return null; // This component is invisible, it just runs in the background
}