export default function TransformationSection() {
  return (
    <section id="transformation" className="relative py-24 sm:py-32 px-4 w-full max-w-6xl mx-auto overflow-hidden">
      
      {/* ── Header ── */}
      <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-6">
          Who you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3399FF] to-[#99CCFF]">become.</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          Ascend isn&apos;t just about managing tasks. It is an identity shift. It bridges the gap between the overwhelmed dreamer and the disciplined executor.
        </p>
      </div>

      {/* ── Transformation Bridge ── */}
      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 animate-in fade-in zoom-in-95 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
        
        {/* State 1: The Old Paradigm (Before) */}
        <div className="w-full md:w-[40%] flex flex-col p-8 rounded-3xl bg-[#050B14] border border-slate-800/60 shadow-inner relative overflow-hidden group">
          {/* Chaotic background noise */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
          
          <h3 className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-8 text-center md:text-left">
            The Old Paradigm
          </h3>
          
          <ul className="space-y-6 relative z-10">
            <li className="flex items-center gap-4 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm font-medium">Overwhelmed by noise</span>
            </li>
            <li className="flex items-center gap-4 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              </div>
              <span className="text-sm font-medium">Inconsistent execution</span>
            </li>
            <li className="flex items-center gap-4 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm font-medium">Reactive to the day</span>
            </li>
          </ul>
        </div>

        {/* The Catalyst Engine (Ascend) */}
        <div className="relative w-full md:w-[20%] flex items-center justify-center py-8 md:py-0">
          {/* Animated connection lines */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-slate-800 via-[#3399FF] to-[#3399FF] -translate-y-1/2 hidden md:block z-0" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-slate-800 via-[#3399FF] to-[#3399FF] -translate-x-1/2 md:hidden z-0" />
          
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#0B213B] border border-[#007BFF]/50 shadow-[0_0_30px_rgba(0,123,255,0.4)] flex items-center justify-center text-[#3399FF] font-bold font-serif text-2xl">
            A
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-2xl border border-[#3399FF] animate-ping opacity-20" />
          </div>
        </div>

        {/* State 2: The New Standard (After) */}
        <div className="w-full md:w-[40%] flex flex-col p-8 rounded-3xl bg-gradient-to-br from-[#0B213B]/40 to-[#02050A] border border-[#004F98]/50 shadow-[0_0_50px_rgba(0,79,152,0.15)] relative overflow-hidden">
          {/* Structural background grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3399FF 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          
          <h3 className="text-[11px] uppercase tracking-widest text-[#66B2FF] font-semibold mb-8 text-center md:text-left relative z-10">
            The New Standard
          </h3>
          
          <ul className="space-y-6 relative z-10">
            <li className="flex items-center gap-4 text-white">
              <div className="w-8 h-8 rounded-full bg-[#004F98]/30 border border-[#007BFF]/50 flex items-center justify-center text-[#66B2FF] shadow-[0_0_10px_rgba(0,123,255,0.2)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <span className="text-sm font-semibold tracking-wide">Hyper-focused</span>
            </li>
            <li className="flex items-center gap-4 text-white">
              <div className="w-8 h-8 rounded-full bg-[#004F98]/30 border border-[#007BFF]/50 flex items-center justify-center text-[#66B2FF] shadow-[0_0_10px_rgba(0,123,255,0.2)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm font-semibold tracking-wide">Disciplined architecture</span>
            </li>
            <li className="flex items-center gap-4 text-white">
              <div className="w-8 h-8 rounded-full bg-[#004F98]/30 border border-[#007BFF]/50 flex items-center justify-center text-[#66B2FF] shadow-[0_0_10px_rgba(0,123,255,0.2)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <span className="text-sm font-semibold tracking-wide">Consistent growth</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}