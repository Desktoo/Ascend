// components/Navbar.tsx
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6 px-6 sm:px-12">
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/20 border border-white/20 backdrop-blur-md shadow-inner overflow-hidden">
              <Image
                src="/logo.png"
                alt="Ascend Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-serif font-semibold text-lg tracking-wide">
              Ascend
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
          <li>
            <Link
              href="#the-problem"
              className="hover:text-white transition-colors"
            >
              The Problem
            </Link>
          </li>
          <li>
            <Link href="#system" className="hover:text-white transition-colors">
              System
            </Link>
          </li>
          <li>
            <Link
              href="#growth-engine"
              className="hover:text-white transition-colors"
            >
              Growth Engine
            </Link>
          </li>
          <li>
            <Link
              href="#ecosystem"
              className="hover:text-white transition-colors"
            >
              Ecosystem
            </Link>
          </li>
        </ul>

        {/* Auth CTA - Credential focused */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            className="hidden sm:block text-[11px] font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="h-8 px-5 flex items-center justify-center bg-[#004F98] hover:bg-[#005bb5] text-white text-[11px] font-medium rounded-full border border-[#007BFF]/40 shadow-[0_0_15px_rgba(0,79,152,0.4)] hover:shadow-[0_0_20px_rgba(0,123,255,0.6)] transition-all uppercase tracking-wider"
          >
            Start with Email
          </Link>
        </div>
      </nav>
    </header>
  );
}
