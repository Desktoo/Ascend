"use client";

import React from "react";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

const mono = { fontFamily: "var(--font-mono-data, 'JetBrains Mono', monospace)" };
const display = { fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" };

interface ErrorStateProps {
  onRetry?: () => void;
}

export default function ObjectiveDetailErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-[#0C0C0F] p-8 text-center shadow-2xl">
        {/* Warning Badge */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white tracking-wide" style={display}>
          Blueprint Not Found
        </h3>

        {/* Message */}
        <p className="mt-2 text-xs leading-relaxed text-zinc-400 max-w-xs">
          Unable to retrieve the requested objective blueprint. It may have been archived, deleted, or a server timeout occurred.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/20 hover:text-white active:scale-95 cursor-pointer"
              style={mono}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry Sync
            </button>
          )}

          <Link href="/objectives" passHref>
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#141418] px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
              style={mono}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Objectives
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}