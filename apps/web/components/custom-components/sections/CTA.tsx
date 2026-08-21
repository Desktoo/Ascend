import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-48 px-4 overflow-hidden mt-20">
      
      {/* ── The "Launchpad" Horizon ── */}
      {/* Creates a massive, curved glowing horizon at the bottom of the section */}
      <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-[150%] md:w-[120%] h-[100%] bg-[#0B213B] rounded-[100%] blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-60%] left-1/2 -translate-x-1/2 w-[100%] md:w-[80%] h-[100%] bg-[#3399FF] rounded-[100%] blur-[120px] opacity-20 pointer-events-none" />

      {/* Grid fade out */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
        
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold font-serif text-white tracking-tight leading-[1.05] mb-8">
          The system is ready.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3399FF] via-[#99CCFF] to-white">
            Are you?
          </span>
        </h2>
        
        <p className="text-sm sm:text-base text-[#99CCFF] max-w-xl mx-auto leading-relaxed font-light mb-12">
          Join the early adopters turning scattered ambitions into architectural growth. Stop relying on motivation. Start building systems.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary Action */}
          <Link 
            href="/signup" 
            className="w-full sm:w-auto h-14 px-10 flex items-center justify-center bg-white text-[#0B213B] text-sm font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-[1.03] transition-all"
          >
            Start Ascending
          </Link>
          
          {/* Secondary Action */}
          <Link 
            href="/demo" 
            className="w-full sm:w-auto h-14 px-10 flex items-center justify-center bg-transparent border border-[#3399FF]/40 text-white text-sm font-bold rounded-full hover:bg-[#0B213B]/60 hover:border-[#3399FF]/80 backdrop-blur-sm transition-all"
          >
            Create Momentum
          </Link>
        </div>

        <p className="mt-8 text-[11px] text-[#66B2FF]/60 uppercase tracking-widest font-semibold">
          No credit card required • Build your first system free
        </p>
      </div>
      
    </section>
  );
}