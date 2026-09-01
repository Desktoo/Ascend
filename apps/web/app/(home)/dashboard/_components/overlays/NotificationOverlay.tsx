// src/app/(home)/dashboard/_components/overlays/NotificationOverlay.tsx
"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Trophy, Target, Bell, X, ChevronDown, Loader2 } from "lucide-react";
import { useModalStore } from "@/core/store/useModalStore";
import { useNotifications } from "@/core/services/notifications/useNotification";

// Tiny helper to show "2m ago", "1h ago"
const getRelativeTime = (dateString: string) => {
  const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

export default function NotificationOverlay() {
  const { activeModal, closeModal } = useModalStore();
  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Hooking up the real data service!
  const { notifications, isLoading, removeNotification, clearAllNotifications } = useNotifications();

  if (activeModal !== "NOTIFICATION") return null;

  const filteredNotifications = notifications.filter(
    (n) => activeTab === "ALL" || !n.isRead
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case "RANK_UP": return <Trophy className="w-4 h-4 text-amber-500" />;
      case "REMINDER": return <Clock className="w-4 h-4 text-blue-500" />;
      case "GOAL": return <Target className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-[#818CF8]" />;
    }
  };

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
    // (Optional) Call a mark-as-read API here if you want to track read state
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    removeNotification(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0 bg-transparent cursor-pointer" onClick={closeModal} />

      <div className="relative w-full max-w-sm rounded-2xl bg-[#121214] border border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-right-12 fade-in duration-200 flex flex-col h-[90vh] max-h-[90vh]">
        
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800/60 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Notifications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Stay updated on your roadmap</p>
            </div>
            <button onClick={closeModal} className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex bg-zinc-950/60 rounded-lg p-1 border border-slate-800 w-fit">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "ALL" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setActiveTab("UNREAD")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "UNREAD" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-slate-600" />
              <p className="text-xs">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
              <CheckCircle2 className="w-10 h-10 text-slate-700 mb-3" />
              <p>You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col mt-5">
              {filteredNotifications.map((notif) => {
                const isExpanded = expandedId === notif._id;
                
                return (
                  <div 
                    key={notif._id} 
                    onClick={() => handleToggle(notif._id)}
                    className={`p-3 m-2 rounded-xl flex gap-4 transition-colors hover:bg-white/5 cursor-pointer relative group ${
                      !notif.isRead ? "bg-[#818CF8]/5" : ""
                    }`}
                  >
                    {/* The X Button */}
                    <button
                      onClick={(e) => handleDelete(e, notif._id)}
                      className="absolute -top-1.5 border bg-white/50 -right-0.5 p-0.5 rounded-full text-slate-900 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-slate-300 transition-all z-10"
                      title="Remove notification"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="relative shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-zinc-950/80 flex items-center justify-center border border-slate-800">
                        {getIconForType(notif.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-sm font-medium text-slate-200 truncate pr-2">
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-500 whitespace-nowrap mt-0.5">
                            {getRelativeTime(notif.createdAt)}
                          </span>
                          <ChevronDown 
                            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                          />
                        </div>
                      </div>
                      
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-[500px]" : "max-h-5"}`}>
                        <p className={`text-xs text-slate-400 leading-relaxed ${isExpanded ? "" : "truncate"}`}>
                          {notif.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-800/60 flex items-center justify-center shrink-0 bg-zinc-950/20">
          <button 
            onClick={clearAllNotifications}
            className="h-9 px-4 text-slate-500 hover:text-slate-400 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 w-full"
          >
            <X className="w-4 h-4" />
            Clear all notifications
          </button>
        </div>
      </div>
    </div>
  );
}