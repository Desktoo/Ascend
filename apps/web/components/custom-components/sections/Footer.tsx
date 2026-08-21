// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/50 bg-[#02040A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-[#004F98]/20 border border-[#007BFF]/40 text-[#3399FF] flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="text-slate-300 font-medium text-sm">© {new Date().getFullYear()} Ascend Technologies</span>
        </div>

        <ul className="flex items-center gap-8 text-xs text-slate-500 font-medium">
          <li><Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link></li>
          <li><Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link></li>
        </ul>
        
      </div>
    </footer>
  );
}