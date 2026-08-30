"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsScrolled(true);
        // Scrolling down -> hide navbar
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
          setIsVisible(false);
        }
        // Scrolling up -> show navbar
        else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
          setIsVisible(true);
        }
      } else {
        setIsScrolled(false);
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:px-8 transition-all duration-300 transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-[#06030c]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="max-w-5xl mx-auto flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-6 h-6">
            <Image
              src="/logo.svg"
              alt="Ascend Logo"
              width={22}
              height={22}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <span className="text-white font-serif font-semibold text-sm tracking-wide group-hover:text-purple-200 transition-colors">
            Ascend
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 text-[11px] font-medium text-slate-300 uppercase tracking-wider">
          <li>
            <Link
              href="#features"
              className="hover:text-purple-300 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-purple-500 hover:after:w-full after:transition-all"
            >
              Core Pillars
            </Link>
          </li>
          <li>
            <Link
              href="#growth-engine"
              className="hover:text-purple-300 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-purple-500 hover:after:w-full after:transition-all"
            >
              Growth Engine
            </Link>
          </li>
          <li>
            <Link
              href="#workflow"
              className="hover:text-purple-300 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-purple-500 hover:after:w-full after:transition-all"
            >
              Daily Workflow
            </Link>
          </li>
        </ul>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/login"
            className="text-[10px] sm:text-[11px] font-medium text-slate-300 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-purple-950/40"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="group relative inline-flex items-center gap-1 px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold text-white bg-purple-700 hover:bg-purple-600 rounded-full shadow-[0_0_12px_rgba(126,34,206,0.35)] hover:shadow-[0_0_18px_rgba(168,85,247,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-2.5 h-2.5 text-purple-200 group-hover:rotate-12 transition-transform" />
            <span>Start Ascending</span>
            <ArrowRight className="w-2.5 h-2.5 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
