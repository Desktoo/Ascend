export default function SystemSection() {
  const steps = [
    {
      id: "01",
      title: "Goals & Inputs",
      desc: "Define your summit. Drop your massive, intimidating long-term goals into the system.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
      )
    },
    {
      id: "02",
      title: "AI Breakdown",
      desc: "The engine analyzes your targets and fractures them into actionable, micro-daily habits.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
      )
    },
    {
      id: "03",
      title: "Smart Scheduling",
      desc: "Tasks are autonomously slotted into your calendar, protecting your deep-work blocks.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      )
    },
    {
      id: "04",
      title: "Daily Execution",
      desc: "You execute. The HUD keeps you focused on the present moment, eliminating noise.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      id: "05",
      title: "Momentum",
      desc: "Every completed task feeds the Contribution Grid, visualizing your unbreakable streak.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      )
    },
    {
      id: "06",
      title: "Long-Term Growth",
      desc: "Consistent micro-wins compound. You level up in the system, and in reality.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
      )
    }
  ];

  return (
    <section id="system" className="relative py-24 sm:py-32 px-4 w-full max-w-6xl mx-auto overflow-hidden">
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#0B213B] rounded-[100%] blur-[150px] opacity-30 pointer-events-none" />

      <div className="relative z-10">
        
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B213B]/40 border border-[#0B213B] text-[#66B2FF] text-[10px] uppercase tracking-widest font-semibold mb-6">
            The Operating System
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3399FF] to-[#99CCFF]">Ascend</span> Works.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            A seamless, autonomous pipeline that transforms your highest ambitions into daily, frictionless actions.
          </p>
        </div>

        {/* ── The Pipeline / Flow ── */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Central Glowing Line (Desktop: Horizontal, Mobile: Vertical) */}
          <div className="absolute top-0 bottom-0 left-8 md:left-0 md:right-0 md:top-24 md:bottom-auto w-[2px] md:w-full md:h-[2px] bg-slate-800 rounded-full z-0">
            {/* Animated Flowing Gradient */}
            <div className="absolute top-0 left-0 w-full md:w-1/3 h-1/3 md:h-full bg-gradient-to-b md:bg-gradient-to-r from-transparent via-[#3399FF] to-transparent animate-[pulse_3s_ease-in-out_infinite] blur-[2px]" />
          </div>

          {/* Grid of Steps */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 relative z-10 pl-16 md:pl-0">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative flex flex-col items-start md:items-center group animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out"
                style={{ 
                  animationTimeline: 'view()',
                  animationDelay: `${index * 150}ms` 
                }}
              >
                
                {/* Node Point on the Line */}
                <div className="absolute -left-16 md:left-auto md:top-[-48px] md:relative md:mb-6 w-8 h-8 rounded-full bg-[#02050A] border-2 border-[#0B213B] flex items-center justify-center group-hover:border-[#3399FF] group-hover:shadow-[0_0_15px_#3399FF] transition-all duration-300 z-10">
                  <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
                </div>

                {/* The Glass Card */}
                <div className="w-full bg-[#0A1220]/80 backdrop-blur-md border border-[#0B213B] rounded-2xl p-5 hover:bg-[#0B213B]/40 hover:border-[#3399FF]/50 transition-all duration-300 transform group-hover:-translate-y-1">
                  
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold text-[#66B2FF] bg-[#004F98]/20 px-2 py-0.5 rounded border border-[#004F98]/30">
                      PHASE {step.id}
                    </span>
                    <div className="text-slate-500 group-hover:text-[#3399FF] transition-colors">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-semibold text-white mb-2 md:text-center text-left">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed md:text-center text-left">
                    {step.desc}
                  </p>
                  
                </div>

                {/* Mobile connecting line (hides on desktop) */}
                {index !== steps.length - 1 && (
                  <div className="absolute -left-[33px] top-8 bottom-[-24px] w-[2px] bg-gradient-to-b from-[#3399FF]/50 to-transparent md:hidden" />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}