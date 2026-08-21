export default function GrowthEngineSection() {
  // Exponential growth data to simulate the 1% compounding curve
  const growthData = [2, 3, 5, 8, 12, 17, 24, 34, 47, 65, 85, 100];

  return (
    <section id="growth-engine" className="relative py-24 sm:py-32 px-4 w-full max-w-6xl mx-auto overflow-hidden">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#0B213B]/40 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* ── Left Column: Copy & Philosophy ── */}
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B213B]/40 border border-[#0B213B] text-[#66B2FF] text-[10px] uppercase tracking-widest font-semibold">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              The Growth Engine
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Small actions compound into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3399FF] to-[#99CCFF]">massive change.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
              Ascend operates on a simple mathematical truth: improving by just 1% every day makes you 37 times better by the end of the year. We don&apos;t track perfection; we track compounding execution.
            </p>
          </div>

          <div className="space-y-8">
            {/* Point 1: Momentum */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0B213B]/50 border border-[#004F98]/40 flex items-center justify-center text-[#3399FF] shadow-[0_0_15px_rgba(0,79,152,0.3)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Unstoppable Momentum</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  The hardest part is starting. By lowering the friction to track micro-habits, Ascend helps you build kinetic energy. A 3-day streak turns into a 30-day lifestyle.
                </p>
              </div>
            </div>

            {/* Point 2: Milestones */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0B213B]/50 border border-[#004F98]/40 flex items-center justify-center text-[#3399FF] shadow-[0_0_15px_rgba(0,79,152,0.3)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Data-Driven Milestones</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Blind effort leads to burnout. The system visualizes your growth trajectory, turning abstract effort into concrete, celebrated milestones along your journey.
                </p>
              </div>
            </div>

            {/* Point 3: Identity */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0B213B]/50 border border-[#004F98]/40 flex items-center justify-center text-[#3399FF] shadow-[0_0_15px_rgba(0,79,152,0.3)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Identity Architecture</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Every action is a vote for the person you wish to become. As your charts trend upwards, your self-image shifts. You don&apos;t just &quot;do tasks&quot;—you become an executor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: The Visuals (Graphs & Data) ── */}
        <div className="relative h-[500px] w-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 ease-out" style={{ animationTimeline: 'view()' }}>
          
          {/* Main Glass Card (The Exponential Growth Chart) */}
          <div className="absolute inset-0 max-w-md mx-auto my-auto h-80 rounded-2xl bg-[#050B14]/80 backdrop-blur-xl border border-[#0B213B] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Background Equation Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-serif font-bold text-white/[0.02] whitespace-nowrap pointer-events-none">
              (1.01)³⁶⁵
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Compound Effect</p>
                <div className="text-white text-3xl font-bold font-serif">37.78x <span className="text-sm text-[#3399FF] font-sans font-normal">Growth</span></div>
              </div>
              <div className="px-2 py-1 rounded bg-[#0B213B] border border-[#004F98]/50 text-[#66B2FF] text-[10px] font-bold">
                Year 1 Projection
              </div>
            </div>

            {/* The Animated Exponential Bar Chart */}
            <div className="relative z-10 h-32 flex items-end justify-between gap-1 mt-auto">
              {growthData.map((height, i) => (
                <div key={i} className="relative flex-1 bg-white/[0.02] rounded-t-sm group">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-[#004F98] to-[#3399FF] rounded-t-sm"
                    style={{ 
                      height: `${height}%`,
                      // Pure CSS animation to make bars grow on load
                      animation: `grow-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                      animationDelay: `${i * 100}ms`,
                      transformOrigin: 'bottom'
                    }}
                  />
                  {/* Custom CSS for the bar growth */}
                  <style>{`
                    @keyframes grow-up {
                      0% { transform: scaleY(0); opacity: 0; }
                      100% { transform: scaleY(1); opacity: 1; }
                    }
                  `}</style>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Widget 1: Consistency (Top Left) */}
          <div className="absolute -left-4 sm:left-4 top-16 w-48 rounded-xl bg-[#0A1220]/90 backdrop-blur-md border border-[#0B213B] p-4 shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#004F98]/20 flex items-center justify-center text-[#3399FF]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Consistency</p>
                <p className="text-white text-sm font-bold">98.2% <span className="text-green-400 text-[10px]">↑</span></p>
              </div>
            </div>
            {/* Mini line chart simulation */}
            <div className="h-6 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCwxMDAgTDIwLDYwIEw0MCw4MCBMNjAsMzAgTDgwLDQwIEwxMDAsMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM5OUZGIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-no-repeat bg-cover opacity-80" />
          </div>

          {/* Floating Widget 2: Focus (Bottom Right) */}
          <div className="absolute -right-4 sm:right-4 bottom-12 w-48 rounded-xl bg-[#0A1220]/90 backdrop-blur-md border border-[#0B213B] p-4 shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#004F98]/20 flex items-center justify-center text-[#3399FF]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Deep Focus</p>
                <p className="text-white text-sm font-bold">14h 20m <span className="text-[#3399FF] text-[10px]">↑</span></p>
              </div>
            </div>
            {/* Mini progress bar simulation */}
            <div className="h-1.5 w-full bg-[#0B213B] rounded-full overflow-hidden mt-3">
              <div className="h-full w-4/5 bg-gradient-to-r from-[#004F98] to-[#3399FF] rounded-full" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}