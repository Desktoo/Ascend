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
    <div className="relative min-h-screen bg-[#06030c] text-slate-200 font-sans selection:bg-purple-700 selection:text-white overflow-x-hidden">
      {/* Deep Space Purple / Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2e1065_0%,_#06030c_70%)] opacity-80" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] bg-purple-800/15 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col items-center w-full">
        {/* 1. Hero Section: Value Proposition & Live Mockup HUD */}
        <HeroSection />

        {/* 2. Feature Pillars: Bento Grid of Core App Capabilities */}
        <FeaturePillarsSection />

        {/* 3. Growth Engine: Gamification, XP Progression & 1% Compounding */}
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
