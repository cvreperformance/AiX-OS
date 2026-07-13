import { PersonalStorage } from '@/modules/personal/storage/personal.storage';

export default async function IdeasPage() {
  const storage = new PersonalStorage();
  const ideas = await storage.getRecentIdeas(50);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Ideas</h1>
        <p className="text-zinc-400 mt-2">Revenue-generating concepts and sparks.</p>
      </div>

      <div className="space-y-4">
        {ideas.length === 0 ? (
          <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/30 text-center text-zinc-500">
            No ideas captured yet.
          </div>
        ) : ideas.map(idea => (
          <div key={idea.id} className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-5 rounded-xl">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white text-lg">{idea.title}</h3>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">{idea.priority} Priority</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">{idea.description}</p>
            <div className="flex justify-between mt-4 items-center">
              <div className="flex gap-2">
                {idea.tags.map(t => (
                  <span key={t} className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <span className="text-xs text-zinc-600">{new Date(idea.createdAt).toLocaleDateString()} | {idea.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
