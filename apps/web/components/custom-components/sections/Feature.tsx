// components/FeatureSection.tsx
export default function FeatureSection() {
  return (
    <section id="features" className="py-32 px-6 sm:px-12 w-full max-w-7xl mx-auto">
      
      {/* Feature 1: The Contribution Grid */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
        <div className="space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            The Contribution Grid
          </h3>
          <p className="text-slate-400 leading-relaxed text-lg">
            Stop guessing about your consistency. Ascend visualizes your daily completion percentage on a heatmap grid[cite: 25, 26]. Watch your daily quests light up the board as you build an unbreakable streak of focused execution[cite: 18].
          </p>
        </div>
        <div className="relative h-80 rounded-2xl bg-[#0A1220] border border-slate-800 p-8 shadow-2xl flex flex-col justify-center gap-2">
          {/* Abstract Heatmap UI */}
          {[...Array(5)].map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-2">
              {[...Array(12)].map((_, colIdx) => {
                // Randomize opacity for visual effect
                const opacity = Math.random() > 0.3 ? (Math.random() * 0.8 + 0.2) : 0.05;
                return (
                  <div 
                    key={colIdx} 
                    className="w-full h-8 rounded-md bg-[#007BFF]" 
                    style={{ opacity }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </article>

      {/* Feature 2: Smart Sync & HUD */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-row-reverse animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out" style={{ animationTimeline: 'view()' }}>
        <div className="order-2 md:order-1 relative h-80 rounded-2xl bg-gradient-to-br from-[#0A1220] to-[#02050A] border border-slate-800 p-8 shadow-2xl flex items-center justify-center">
          {/* Abstract Extension HUD UI */}
          <div className="w-64 bg-[#050B14] border border-[#004F98]/40 rounded-xl p-4 shadow-[0_0_30px_rgba(0,123,255,0.15)]">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">Ascend HUD</div>
            <div className="space-y-3">
              <div className="h-10 rounded-lg border border-slate-700 flex items-center px-3 gap-3">
                <div className="w-4 h-4 rounded-full border border-slate-500" />
                <div className="h-2 w-24 bg-slate-600 rounded-full" />
              </div>
              <div className="h-10 rounded-lg border border-[#007BFF]/50 bg-[#004F98]/20 flex items-center px-3 gap-3">
                <div className="w-4 h-4 rounded-full bg-[#3399FF] shadow-[0_0_10px_#3399FF]" />
                <div className="h-2 w-32 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Omnipresent Execution
          </h3>
          <p className="text-slate-400 leading-relaxed text-lg">
            Your workflow shouldn&apos;t be interrupted to check off a task. The Ascend Chrome Extension provides a floating HUD to manage tasks without leaving your active tab[cite: 38]. 
          </p>
          <p className="text-slate-400 leading-relaxed text-lg">
            Combined with our Calendar Auto-Pause intelligence, the system automatically detects busy days or travel, seamlessly pausing your streaks so your metrics stay accurate to your actual effort[cite: 37].
          </p>
        </div>
      </article>

    </section>
  );
}