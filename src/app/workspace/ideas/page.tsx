'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIdeas, createIdea } from '@/app/actions/personal.actions';
import { Idea } from '@/modules/personal/types/personal.types';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' as string, tags: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await getIdeas(50);
      setIdeas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setIsSaving(true);
    setFormError('');
    try {
      const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await createIdea({ title: form.title, description: form.description, priority: form.priority as any, tags: tagsArr });
      setForm({ title: '', description: '', priority: 'Medium', tags: '' });
      setShowForm(false);
      await load();
    } catch (e: any) {
      setFormError(e?.message || 'Failed to save idea.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Ideas</h1>
          <p className="text-zinc-400 mt-2">Revenue-generating concepts and sparks.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
        >
          + New Idea
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white">Capture New Idea</h2>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Idea title…"
            className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
          />
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the idea, opportunity, or insight…"
            className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white h-24 resize-none focus:border-amber-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="revenue, product, market"
                className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-white text-sm px-4 py-2">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={isSaving || !form.title.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving…' : 'Save Idea'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <p className="text-zinc-500">Loading…</p>
      ) : ideas.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-800 rounded-2xl text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
            <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No ideas yet.</h2>
          <p className="text-zinc-400 max-w-sm text-lg mb-8">Capture your first revenue idea, insight, or product spark.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            Capture First Idea
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map(idea => (
            <div key={idea.id} className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-5 rounded-xl hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-lg">{idea.title}</h3>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  idea.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  idea.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                  idea.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>{idea.priority} Priority</span>
              </div>
              {idea.description && <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{idea.description}</p>}
              <div className="flex justify-between mt-4 items-center">
                <div className="flex gap-2 flex-wrap">
                  {idea.tags.map(t => (
                    <span key={t} className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
                <span className="text-xs text-zinc-600">{new Date(idea.createdAt).toLocaleDateString()} | {idea.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
