"use client";

import React from "react";
import VerticalTabs from "./_components/Tabs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0C] text-zinc-200 py-6 px-4 sm:p-10 font-sans">
      <div className=" mx-auto  flex flex-col md:flex-row gap-6 items-start">
        {/* Left Side: Vertical Navigation Sidebar */}
        <VerticalTabs />

        {/* Right Side: Tab Page Contents */}
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}