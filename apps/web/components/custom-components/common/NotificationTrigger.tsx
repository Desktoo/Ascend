// src/components/notifications/NotificationTrigger.tsx
"use client";

import { Bell } from "lucide-react";
import { useModalStore } from "@/core/store/useModalStore";

export default function NotificationTrigger() {
  const openModal = useModalStore((state) => state.openModal);
  
  // Example unread count (to be replaced by SWR later)
  const unreadCount = 3; 

  return (
    <button 
      onClick={() => openModal("NOTIFICATION")}
      className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <Bell className="w-3.5 h-3.5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#818CF8] rounded-full border-2 border-white dark:border-[#0a0a0a]" />
      )}
    </button>
  );
}