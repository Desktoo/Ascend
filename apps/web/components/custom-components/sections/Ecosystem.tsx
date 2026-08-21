export default function EcosystemSection() {
  const features = [
    {
      id: "01",
      title: "AI Scheduler",
      description: "Your raw goals are processed and autonomously slotted into optimal time blocks.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
      )
    },
    {
      id: "02",
      title: "Dynamic Habits",
      description: "Scheduled blocks fracture into trackable micro-habits on your daily HUD.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      id: "03",
      title: "Calendar Sync",
      description: "Execution is synced back to your calendar. Busy days trigger 'Auto-Pause' to protect streaks.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      )
    },
    {
      id: "04",
      title: "Deep Analytics",
      description: "Completion data feeds the Contribution Grid, visualizing your exact consistency score.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
      )
    },
    {
      id: "05",
      title: "Level-Gated Themes",
      description: "Sustained momentum unlocks premium visual themes, morphing your workspace aesthetic.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
      )
    },
    {
      id: "06",
      title: "Milestone Rewards",
      description: "XP algorithms rank you up, converting daily grinds into permanent architectural growth.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
      )
    }
  ];

  return (
    <section id="ecosystem" className="relative py-24 sm:py-32 px-4 w-full max-w-6xl mx-auto overflow-hidden">
      
      {/* Ambient Deep Navy Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#0B213B]/40 rounded-[100%] blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B213B]/40 border border-[#0B213B] text-[#66B2FF] text-[10px] uppercase tracking-widest font-semibold mb-6">
            Feature Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Everything works <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3399FF] to-white">together.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Isolated tools create friction. Ascend is a unified engine where your inputs automatically feed your outputs, creating a seamless loop of momentum.
          </p>
        </div>

        {/* ── Ecosystem Bento Grid ── */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out"
              style={{ 
                animationTimeline: 'view()',
                animationDelay: `${index * 100}ms` 
              }}
            >
              
              {/* The Glass Feature Card */}
              <div className="relative z-10 h-full flex flex-col p-6 rounded-2xl bg-[#0A1220]/80 backdrop-blur-xl border border-[#0B213B] hover:border-[#004F98] transition-colors duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,79,152,0.2)]">
                
                {/* Header (Icon + Phase) */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0B213B]/50 border border-[#004F98]/40 flex items-center justify-center text-[#3399FF] shadow-[inset_0_0_15px_rgba(0,123,255,0.1)] group-hover:bg-[#004F98]/30 group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-[#66B2FF] transition-colors">
                    FLOW {feature.id}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* ── Connecting Data Streams (Visual Flow) ── */}
              {/* Downward Arrow for Mobile */}
              {index !== features.length - 1 && (
                <div className="md:hidden absolute -bottom-5 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-[#004F98] to-transparent z-0" />
              )}
              
              {/* Horizontal Arrows for Desktop (Row 1) */}
              {index < 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-4 h-0.5 bg-gradient-to-r from-[#004F98] to-transparent z-0" />
              )}
              {/* Horizontal Arrows for Desktop (Row 2) */}
              {index >= 3 && index < 5 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-4 h-0.5 bg-gradient-to-r from-[#004F98] to-transparent z-0" />
              )}

              {/* Vertical connecting loop (from Row 1 to Row 2 on the right edge) */}
              {index === 2 && (
                <div className="hidden lg:block absolute -bottom-6 right-10 w-0.5 h-4 bg-gradient-to-b from-[#004F98] to-transparent z-0" />
              )}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}