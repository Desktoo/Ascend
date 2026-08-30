// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-purple-900/30 bg-[#06030c] pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Ascend Logo"
              width={20}
              height={20}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-slate-400 font-medium text-xs">
            © {new Date().getFullYear()} Ascend. All rights reserved.
          </span>
        </div>

        <ul className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
          <li><Link href="/privacy" className="hover:text-purple-300 transition-colors">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-purple-300 transition-colors">Terms of Service</Link></li>
          <li><Link href="/contact" className="hover:text-purple-300 transition-colors">Contact</Link></li>
        </ul>
        
      </div>
    </footer>
  );
}