// app/page.tsx
import { Metadata } from "next";
import Navbar from "../components/custom-components/common/Navbar";
import HeroSection from "../components/custom-components/sections/Hero";
import FeatureSection from "../components/custom-components/sections/Feature";
import Footer from "../components/custom-components/sections/Footer";
import ProblemSection from "../components/custom-components/sections/Problem";
import SystemSection from "../components/custom-components/sections/System";
import GrowthEngineSection from "../components/custom-components/sections/GrowthEngine";
import EcosystemSection from "../components/custom-components/sections/Ecosystem";
import TransformationSection from "../components/custom-components/sections/Transformation";
import CTASection from "../components/custom-components/sections/CTA";

export const metadata: Metadata = {
  title: "Ascend | The Ultimate Discipline Engine",
  description:
    "Ascend is a unified productivity workspace that maps your daily execution to long-term data visualization. Build habits, track progress, and engineer focus.",
  openGraph: {
    title: "Ascend | Master Your Time",
    description:
      "Design your day with intelligent habit tracking and deep work timers.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#02050A] text-slate-200 font-sans selection:bg-[#3399FF]/30 overflow-x-hidden">
      {/* Deep Space / Ascent Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#001a33_0%,_#02050A_80%)] opacity-80" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col items-center w-full">
        <HeroSection />
        <ProblemSection />
        <SystemSection />
        <GrowthEngineSection />
        <EcosystemSection />
        <TransformationSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
