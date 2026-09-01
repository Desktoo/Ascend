import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-6 text-center antialiased select-none">
      <div className="flex flex-col items-center max-w-sm w-full space-y-4">
        <span className="text-xs font-mono font-medium tracking-widest text-zinc-500 uppercase">
          404 Error
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
          Page Not Found
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
          The page you requested does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
