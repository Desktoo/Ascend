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
          ? "bg-[#08080a]/85 backdrop-blur-xl border-b border-zinc-800/50"
          : "bg-transparent"
      }`}
    >
      <nav
        className="max-w-5xl mx-auto flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-5 h-5">
            <Image
              src="/logo.svg"
              alt="Ascend Logo"
              width={20}
              height={20}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-white font-medium text-sm tracking-tight">
            Ascend
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <li>
            <Link
              href="#problem"
              className="hover:text-zinc-200 transition-colors"
            >
              The Problem
            </Link>
          </li>
          <li>
            <Link
              href="#features"
              className="hover:text-zinc-200 transition-colors"
            >
              Capabilities
            </Link>
          </li>
          <li>
            <Link
              href="#growth-engine"
              className="hover:text-zinc-200 transition-colors"
            >
              Compounding
            </Link>
          </li>
          <li>
            <Link
              href="#workflow"
              className="hover:text-zinc-200 transition-colors"
            >
              Daily Workflow
            </Link>
          </li>
        </ul>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/40"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3 h-3 text-purple-200" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
