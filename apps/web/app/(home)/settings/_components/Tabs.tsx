"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bell, ShieldCheck, Plug } from "lucide-react";

const SETTINGS_TABS = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Security", href: "/settings/security", icon: ShieldCheck },
  { label: "Integrations", href: "/settings/integrations", icon: Plug },
];

export default function VerticalTabs() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 bg-[#0C0C0E] border border-zinc-800/80 rounded-xl p-3 h-fit">
      <nav className="flex flex-col gap-1">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}