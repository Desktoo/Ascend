// src/components/notifications/NotificationTrigger.tsx
"use client";

import { Bell } from "lucide-react";
import { useModalStore } from "@/core/store/useModalStore";
import { useNotifications } from "@/core/services/notifications/useNotification";

export default function NotificationTrigger() {
  const openModal = useModalStore((state) => state.openModal);
  const { notifications } = useNotifications();

  const hasNotifications = Array.isArray(notifications) && notifications.length > 0;

  return (
    <button 
      onClick={() => openModal("NOTIFICATION")}
      className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      title="Notifications"
    >
      <Bell className="w-3.5 h-3.5" />
      {hasNotifications && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#818CF8] rounded-full border-2 border-white dark:border-[#0a0a0a]" />
      )}
    </button>
  );
}