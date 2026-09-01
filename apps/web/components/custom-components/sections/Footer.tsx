// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#08080a] pt-8 pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Ascend Logo"
              width={18}
              height={18}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} Ascend. All rights reserved.
          </span>
        </div>

        <ul className="flex items-center gap-6 text-xs text-zinc-500">
          <li><Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link></li>
          <li><Link href="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link></li>
        </ul>
        
      </div>
    </footer>
  );
}