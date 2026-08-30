import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06030c] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 mb-6 font-serif font-bold text-xl shadow-[0_0_20px_rgba(126,34,206,0.3)]">
        404
      </div>
      <h1 className="text-3xl font-bold font-serif mb-2">Page Not Found</h1>
      <p className="text-slate-400 text-sm mb-6 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs shadow-[0_0_15px_rgba(126,34,206,0.4)] transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </Link>
    </div>
  );
}
