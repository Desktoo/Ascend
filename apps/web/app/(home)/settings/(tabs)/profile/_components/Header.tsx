"use client";

import React from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  userName: string;
  avatarUrl: string;
  level: number;
  rank: string;
  isSaveDisabled: boolean;
  isUpdating?: boolean; // Added loading state prop
}

export default function ProfileHeader({
  userName,
  avatarUrl,
  level,
  rank,
  isSaveDisabled,
  isUpdating = false,
}: ProfileHeaderProps) {
  const isDisabled = isSaveDisabled || isUpdating;

  return (
    <div className="space-y-6 pb-6 border-b border-zinc-800/80">
      {/* Top Header Row: Section Title & Save Button */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Profile Information
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Update your personal details and photo
          </p>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            !isDisabled
              ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 active:scale-95 cursor-pointer"
              : "bg-zinc-800 text-zinc-500 border border-zinc-700/40 cursor-not-allowed opacity-50"
          }`}
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save changes</span>
          )}
        </button>
      </div>

      {/* User Info Avatar & Rank Card */}
      <div className="flex items-center gap-4 pt-2">
        <div className="relative">
          <Image
            width={64}
            height={64}
            src={avatarUrl || "/images/photo-test.jpg"}
            alt={userName}
            className="w-16 h-16 rounded-full object-cover bg-zinc-900 border border-zinc-800"
          />
          <button
            type="button"
            className="absolute -bottom-1 -right-1 p-1 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-all shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{userName}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/80 border border-purple-500/30 text-purple-300 font-bold">
              Lvl {level}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-medium">{rank}</p>
        </div>
      </div>
    </div>
  );
}