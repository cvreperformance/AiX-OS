export default function PipelinePage() {
  return (
    <div className="space-y-8 py-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Pipeline</h1>
          <p className="text-zinc-400 mt-2">Deal stages and revenue tracking.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-2xl p-16 text-center shadow-2xl backdrop-blur-md flex flex-col items-center justify-center mt-12">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
          <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">No active deals.</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-10 text-lg">
          Your pipeline is currently empty. Convert leads or create new opportunities to start tracking your revenue.
        </p>
        
        <div className="flex gap-4">
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Deal
          </button>
        </div>
      </div>
    </div>
  );
}
