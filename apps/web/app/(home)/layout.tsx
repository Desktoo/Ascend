import Sidebar from "@/components/custom-components/common/Sidebar";
import TimeZoneSync from "@/core/services/timeZoneSync";
import { SWRConfig } from "swr";

declare global {
  interface HTMLElementTagNameMap {
    "lottie-player": HTMLElement & {
      src?: string;
      background?: string;
      speed?: string;
      loop?: boolean;
      autoplay?: boolean;
    };
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;  
}) {

 
  return (
    // 1. Switched to flex row to place Sidebar on the left, Page content on the right
    <SWRConfig value={{ revalidateOnFocus: false, dedupingInterval: 5000 }}>

    <div
      className="select-none flex min-h-screen w-full bg-slate-50 dark:bg-[#0A0A0C] text-slate-900 dark:text-slate-200 transition-colors duration-300"
      style={{
        fontFamily:
          "'Switzer', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Import Switzer font from Fontshare */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap');`,
        }}
      />
      <TimeZoneSync />

      {/* Your vertical left sidebar component */}
      <Sidebar />

      {/* 2. Main content area container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header (Kept for small screen sizes if needed) */}
        <header className="md:hidden flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-[#222226] bg-white dark:bg-[#0A0A0C] transition-colors duration-300">
          <span className="text-slate-900 dark:text-white font-semibold text-lg tracking-wide">
            Ascend
          </span>
          <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {/* 3. Main content area now naturally spreads to fill the remaining vertical height */}
        <main className="flex-1 w-full overflow-y-auto">{children}</main>
      </div>
    </div>
    </SWRConfig>
  );
}
