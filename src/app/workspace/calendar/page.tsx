import { PersonalStorage } from '@/modules/personal/storage/personal.storage';

export default async function CalendarPage() {
  const storage = new PersonalStorage();
  const today = new Date().toISOString().split('T')[0];
  const events = await storage.getEventsForDate(today);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Calendar</h1>
          <p className="text-zinc-400 mt-2">AiX Private OS Schedule.</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-lg transition-colors">
          + New Event
        </button>
      </div>

      <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Today's Schedule</h2>
        
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              No events scheduled for today.
            </div>
          ) : events.map(event => (
            <div key={event.id} className="p-5 border border-zinc-800/80 rounded-xl bg-zinc-900/30 flex items-start">
              <div className="w-32 shrink-0 text-amber-500 font-bold text-lg">{event.time}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-lg">{event.title}</h3>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{event.priority}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">{event.category} {event.linkedCompany && `| ${event.linkedCompany}`}</p>
                {event.description && <p className="text-sm text-zinc-500 mt-3">{event.description}</p>}
              </div>
              <div className="w-32 shrink-0 text-right">
                {event.estimatedRevenue > 0 && (
                  <span className="text-emerald-400 font-bold">€{event.estimatedRevenue.toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
