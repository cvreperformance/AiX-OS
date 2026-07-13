import { TodayService } from '@/modules/personal/services/today.service';

// Server Component
export default async function TodayPage() {
  const service = new TodayService();
  const data = await service.getTodayData();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Good Morning, Cristian</h1>
          <p className="text-zinc-400 mt-2">Today's Mission: <span className="text-emerald-400 font-semibold">{data.mission}</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Est. Pipeline</p>
          <p className="text-2xl font-bold text-emerald-400">€{data.estimatedPipeline.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-4 rounded-xl flex justify-between items-center mt-6">
        <div className="flex items-center gap-4">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <h2 className="text-white font-bold">System Health</h2>
          <span className="text-sm text-zinc-400">| {data.agentHealth.activeCount} Active Agents</span>
          {data.agentHealth.runningCount > 0 && (
            <span className="text-sm bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded ml-2">
              {data.agentHealth.runningCount} Running
            </span>
          )}
        </div>
        <div className="text-sm text-zinc-500">
          Last Agent Run: <span className="text-zinc-300">{data.agentHealth.lastRun}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
              Top 3 Revenue Actions
            </h2>
            <div className="space-y-4">
              {data.topActions.length === 0 ? (
                <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500 text-sm">No actions pending.</div>
              ) : data.topActions.map(action => (
                <div key={action.id} className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-5 rounded-xl">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-white">{action.title}</h3>
                    <span className="text-emerald-400 font-bold">€{action.estimatedRevenue?.toLocaleString() || 0}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2">{action.recommendedAction}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              Today's Calendar
            </h2>
            <div className="space-y-4">
              {data.calendarEvents.length === 0 ? (
                <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500 text-sm">No events scheduled.</div>
              ) : data.calendarEvents.map(event => (
                <div key={event.id} className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-5 rounded-xl flex">
                  <div className="w-24 shrink-0 text-amber-500 font-bold">{event.time}</div>
                  <div>
                    <h3 className="font-bold text-white">{event.title}</h3>
                    <p className="text-sm text-zinc-400">{event.category} - {event.priority} Priority</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              Today's Reminders
            </h2>
            <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl overflow-hidden">
              {data.reminders.length === 0 ? (
                <div className="p-6 text-zinc-500 text-sm">No pending reminders.</div>
              ) : data.reminders.map(rem => (
                <div key={rem.id} className="p-4 border-b border-zinc-800/50 last:border-0 flex items-center">
                  <div className="w-4 h-4 rounded border border-zinc-600 mr-3"></div>
                  <span className="text-sm text-zinc-300">{rem.title}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
              Recent Captures
            </h2>
            <div className="space-y-3">
              {data.recentCaptures.length === 0 ? (
                <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500 text-sm">No recent captures.</div>
              ) : data.recentCaptures.map(cap => (
                <div key={cap.id} className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl">
                  <p className="text-sm text-zinc-300 italic">"{cap.rawText}"</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Recent Ideas
            </h2>
            <div className="space-y-3">
              {data.recentIdeas.length === 0 ? (
                <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500 text-sm">No recent ideas.</div>
              ) : data.recentIdeas.map(idea => (
                <div key={idea.id} className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-white">{idea.title}</h3>
                  <div className="flex gap-2 mt-2">
                    {idea.tags.map(t => (
                      <span key={t} className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
