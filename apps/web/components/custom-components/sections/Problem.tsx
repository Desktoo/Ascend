export default function ProblemSection() {
  return (
    <section id="the-problem" className="relative py-24 sm:py-32 px-4 w-full max-w-6xl mx-auto">
      
      {/* Subtle ambient background to ground the section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/50 to-transparent pointer-events-none" />

      <div className="relative z-10">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-6">
            The anatomy of <span className="text-slate-500 line-through decoration-slate-700 decoration-2">ambition</span> burnout.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            You know what needs to be done. You have read the books and watched the videos. Yet, months pass, and the needle hasn&apos;t moved. Here is why the traditional approach to productivity is failing you.
          </p>
        </div>

        {/* ── Problem Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Motivation */}
          <div className="group flex flex-col p-8 rounded-2xl bg-[#0A1220] border border-slate-800/80 hover:border-slate-700 transition-colors animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out delay-[100ms]" style={{ animationTimeline: 'view()' }}>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-slate-500 group-hover:text-red-400/80 transition-colors">
              {/* Flame Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">You rely on motivation.</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Motivation is a spark, not an engine. It is an emotion, and emotions fade. When the initial excitement of a new goal dies after two weeks, execution completely stops because there is no system to carry the weight.
            </p>
          </div>

          {/* Card 2: Lost Goals */}
          <div className="group flex flex-col p-8 rounded-2xl bg-[#0A1220] border border-slate-800/80 hover:border-slate-700 transition-colors animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out delay-[200ms]" style={{ animationTimeline: 'view()' }}>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-slate-500 group-hover:text-orange-400/80 transition-colors">
              {/* Target / Eye-Off Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Goals disappear into noise.</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              You write down your ambitious targets on January 1st, but they quickly get buried under daily busywork and endless to-do lists. Out of sight means out of mind. Consistency is lost without daily visual tracking.
            </p>
          </div>

          {/* Card 3: Lack of Systems */}
          <div className="group flex flex-col p-8 rounded-2xl bg-[#0A1220] border border-slate-800/80 hover:border-slate-700 transition-colors animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out delay-[300ms]" style={{ animationTimeline: 'view()' }}>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-slate-500 group-hover:text-blue-400/80 transition-colors">
              {/* Layers/Structure Broken Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15l16-4" /> {/* Strikethrough to represent failure */}</svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Plans fail without structure.</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Standard to-do lists treat all tasks equally. They lack the architectural structure to distinguish between minor busywork and tasks that actually build momentum. Without a system, you are just reacting.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}