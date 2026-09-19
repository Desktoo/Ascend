"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Target,
  Repeat,
  Trophy,
  Settings,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
} from "lucide-react";
import { signOut } from "@/utils/auth";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useUserProfile from "@/core/hooks/useUserProfile";
import NotificationTrigger from "./NotificationTrigger";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Objectives", href: "/objectives", icon: Target },
  { name: "Habits", href: "/habits", icon: Repeat },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const currentPath = usePathname();
  const [theme, setTheme] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const { user } = useUserProfile();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const root = document.documentElement;

    console.log("user profile in sidebar", user);

    if (
      storedTheme === "light" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: light)").matches)
    ) {
      setTheme("light");
      root.classList.remove("dark");
    } else {
      setTheme("dark");
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const isDark = theme === "dark";

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: isCollapsed ? 72 : 240,
        paddingLeft: isCollapsed ? 12 : 20,
        paddingRight: isCollapsed ? 12 : 20,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [isCollapsed]);

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{
          width: isCollapsed ? 72 : 240,
          paddingLeft: isCollapsed ? 12 : 20,
          paddingRight: isCollapsed ? 12 : 20,
        }}
        className="hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-[#0A0A0C] border-r border-slate-200 dark:border-[#222226] py-5 selection:bg-[#818CF8]/30 overflow-y-auto overflow-x-hidden"
      >
        {/* ── Top Section: Logo ── */}
        <div
          className={`mb-8 flex items-center h-8 relative ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <>
              <Link href="/" className="flex items-center gap-2.5 group w-max">
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50/50 dark:bg-black/20 border border-indigo-200/50 dark:border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] dark:group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] group-hover:border-indigo-300 dark:group-hover:border-[#A855F7]/40 overflow-hidden transition-all duration-300">
                    <Image
                      src="/logo.svg"
                      alt="Ascend Logo"
                      priority
                      fill
                      unoptimized
                      className="object-contain px-2 py-0.5"
                    />
                  </div>
                  <span className="text-slate-900 dark:text-white font-serif font-semibold text-lg tracking-wide transition-colors duration-300 whitespace-nowrap">
                    Ascend
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setIsCollapsed(true)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}

          {isCollapsed && (
            <div className="relative group/logo cursor-pointer flex items-center justify-center w-8 h-8">
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover/logo:opacity-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50/50 dark:bg-black/20 border border-indigo-200/50 dark:border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.2)] overflow-hidden">
                  <Image
                    src="/logo.svg"
                    priority
                    alt="Ascend Logo"
                    fill
                    unoptimized
                    className="object-contain px-2 py-0.5"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1a1a1e] rounded-lg border border-slate-200 dark:border-[#222226]"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Middle Section: Vertical Navigation ── */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.href || currentPath.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${
                  isCollapsed
                    ? "justify-center w-8 h-8 mx-auto"
                    : "gap-3 px-3 py-2"
                } rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-linear-to-tr from-[#6366F1] to-[#A855F7] text-white shadow-md shadow-[#A855F7]/20"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.02]"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <span className="tracking-wide font-semibold">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom Section: Action Controls & User Metrics ── */}
        <div className="mt-6 flex flex-col gap-4 pt-5 border-t border-slate-200 dark:border-[#222226] transition-colors duration-300">
          {isCollapsed ? (
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <button
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative overflow-hidden w-4 h-4 flex items-center justify-center"
                title="Toggle Theme"
              >
                <Sun
                  className={`absolute w-4 h-4 transition-all duration-500 ease-in-out ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
                />
                <Moon
                  className={`absolute w-4 h-4 transition-all duration-500 ease-in-out ${theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`}
                />
              </button>

              {/* Collapsed view Logout trigger using Dialog uncontrolled open wrapper */}
              <button
                onClick={() => setIsLogoutOpen(true)}
                className="text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
                title="Disconnect Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Search className="w-3.5 h-3.5" />
                </button>
                <NotificationTrigger />
                <button
                  onClick={toggleTheme}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative overflow-hidden w-3.5 h-3.5 flex items-center justify-center"
                  title="Toggle Theme"
                >
                  <Sun
                    className={`absolute w-3.5 h-3.5 transition-all duration-500 ease-in-out ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
                  />
                  <Moon
                    className={`absolute w-3.5 h-3.5 transition-all duration-500 ease-in-out ${theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`}
                  />
                </button>
              </div>

              {/* Expanded view Logout trigger */}
              <button
                onClick={() => setIsLogoutOpen(true)}
                className="text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
                title="Disconnect Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Profile Avatar Stack with Core RPG Statistics */}
          <div
            className={`flex items-center ${
              isCollapsed
                ? "justify-center bg-transparent border-transparent p-0"
                : "gap-2.5 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#222226] p-1.5"
            } rounded-lg transition-all duration-300`}
          >
            {user?.avatarUrl ? (
              <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden bg-white dark:bg-[#0A0A0C] shadow-sm">
                <Image
                  src={user.avatarUrl}
                  alt={user?.userName || "Avatar"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
                {user?.userName?.[0]?.toUpperCase() ?? (
                  <Image
                    src="/images/user-logo.png"
                    alt="Default Avatar"
                    width={28}
                    height={28}
                    unoptimized
                    className="object-cover rounded-full" 
                  />
                )}
              </div>
            )}

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                  LVL {user?.level || "0"} | {user?.rank || "Unranked"}
                </p>
                <p className="text-xs text-slate-900 dark:text-white font-semibold truncate">
                  {user?.userName || "Loading..."}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Shared Managed Shadcn Confirmation Modal ── */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="max-w-xs sm:max-w-md bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-[#222226] rounded-2xl p-6 font-sans shadow-2xl selection:bg-[#818CF8]/30">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-bold text-slate-950 dark:text-white">
              Disconnect Session
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Are you sure you want to log out of Ascend? Your current data
              loops are secured, but you will need to re-authenticate to sync
              progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row bg-transparent items-center justify-end gap-2 mt-4">
            <Button
              onClick={() => setIsLogoutOpen(false)}
              className="px-4 py-2 text-xs bg-zinc-800 font-semibold rounded-xl text-slate-100 dark:text-slate-400 hover:bg-slate-800 dark:hover:bg-white/4 border border-slate-200 dark:border-[#222226] transition-all active:scale-95"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsLogoutOpen(false);
                signOut();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-800 text-white shadow-lg shadow-rose-500/10 transition-all active:scale-95"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
