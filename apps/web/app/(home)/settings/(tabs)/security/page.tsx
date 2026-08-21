"use client";

import useUserProfile from "@/core/hooks/useUserProfile";
import PasswordAccordion from "./_components/PasswordAccordion";

export default function SecurityPage() {
  const { isLoading } = useUserProfile();


  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0C0C0E] text-zinc-400 text-xs font-mono">
        Loading security settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      {/* Header Section */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h2 className="text-base font-bold text-white tracking-tight">
          Security Settings
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage password updates, authentication credentials, and session access.
        </p>
      </div>

      
        <PasswordAccordion />
    </div>
  );
}