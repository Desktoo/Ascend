// app/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/custom-components/common/Navbar";
import HeroSection from "@/components/custom-components/sections/Hero";
import FeaturePillarsSection from "@/components/custom-components/sections/FeaturePillars";
import GrowthEngineSection from "@/components/custom-components/sections/GrowthEngine";
import WorkflowSection from "@/components/custom-components/sections/Workflow";
import CTASection from "@/components/custom-components/sections/CTA";
import Footer from "@/components/custom-components/sections/Footer";

export const metadata: Metadata = {
  title: "Ascend | The Ultimate Discipline Engine",
  description:
    "Ascend is a unified discipline and momentum workspace. Track daily habits, execute high-priority focus tasks, break down summit goals, and level up with gamified momentum.",
  openGraph: {
    title: "Ascend | Master Your Daily Discipline",
    description:
      "A unified system for habit tracking, priority focus execution, and gamified momentum.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#08080a] text-zinc-200 font-sans selection:bg-purple-700 selection:text-white overflow-x-hidden antialiased">
      {/* Subtle Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-950/20 rounded-full blur-[140px]" />
        <div className="absolute top-[45%] right-[-5%] w-[450px] h-[450px] bg-purple-950/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col items-center w-full">
        {/* 1. Hero Section: The Execution Problem & System Overview */}
        <HeroSection />

        {/* 2. Feature Pillars: 4 Essential Pillars of Daily Execution */}
        <FeaturePillarsSection />

        {/* 3. Growth Engine: Compounding & Gamification */}
        <GrowthEngineSection />

        {/* 4. Workflow: 4-Step Daily Execution Cycle */}
        <WorkflowSection />

        {/* 5. CTA Horizon: Final Call to Action */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
