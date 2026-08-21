"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Optional helper component inside your layout or page
export function LenisResizeHandler() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    // Force Lenis to recalculate container height when switching routes or dynamic components load
    if (lenis) {
      lenis.resize();
    }
  }, [pathname, lenis]);

  return null;
}