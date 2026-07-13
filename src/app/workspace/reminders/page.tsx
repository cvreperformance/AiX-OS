import { PersonalStorage } from '@/modules/personal/storage/personal.storage';

export default async function RemindersPage() {
  const storage = new PersonalStorage();
  const reminders = await storage.getPendingReminders(50);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Reminders</h1>
        <p className="text-zinc-400 mt-2">Actionable triggers.</p>
      </div>

      <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl overflow-hidden">
        {reminders.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No pending reminders.
          </div>
        ) : reminders.map(rem => (
          <div key={rem.id} className="p-5 border-b border-zinc-800/50 last:border-0 flex items-center justify-between hover:bg-zinc-900/30 transition-colors">
            <div className="flex items-center">
              <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 bg-zinc-900/50 mr-4 cursor-pointer" />
              <div>
                <h3 className="font-bold text-white">{rem.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">Due: {new Date(rem.date).toLocaleDateString()}</p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded bg-zinc-800 text-zinc-300">{rem.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
