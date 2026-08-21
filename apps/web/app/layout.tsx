import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import GlobalSystemProviders from "@/components/providers/GlobalSystemProviders";
// import SmoothScroll from "@/components/custom-components/common/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ascend",
  description: "The Ultimate Discipline Engine",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased select-none`}
    >
      {/* <SmoothScroll> */}
      <body className="min-h-full flex flex-col">
        <GlobalSystemProviders>
          <TooltipProvider>{children}</TooltipProvider>
        </GlobalSystemProviders>
        <Toaster position="top-center" closeButton richColors />
      </body>
      {/* </SmoothScroll> */}
    </html>
  );
}
