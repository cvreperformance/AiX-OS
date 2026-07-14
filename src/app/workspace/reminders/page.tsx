'use client';

import { useState, useEffect, useCallback } from 'react';
import { getReminders, completeReminder, createReminder } from '@/app/actions/personal.actions';
import { Reminder } from '@/modules/personal/types/personal.types';

type Status = 'idle' | 'saving' | 'error';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: new Date().toISOString().split('T')[0], priority: 'Medium' });
  const [formStatus, setFormStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');
  const [completing, setCompleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getReminders(50);
      setReminders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleComplete = async (id: string) => {
    setCompleting(id);
    try {
      await completeReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (e: any) {
      console.error('Complete failed:', e);
    } finally {
      setCompleting(null);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setFormStatus('saving');
    setFormError('');
    try {
      await createReminder(form);
      setForm({ title: '', date: new Date().toISOString().split('T')[0], priority: 'Medium' });
      setShowForm(false);
      setFormStatus('idle');
      await load();
    } catch (e: any) {
      setFormError(e?.message || 'Failed to create reminder.');
      setFormStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Reminders</h1>
          <p className="text-zinc-400 mt-2">Actionable triggers. Check off when done.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
        >
          + New Reminder
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white">New Reminder</h2>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Remind me to…"
            className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Due Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
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
          </div>
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-white text-sm px-4 py-2">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={formStatus === 'saving' || !form.title.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {formStatus === 'saving' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading…</div>
        ) : reminders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-zinc-400 font-medium text-lg mb-1">No pending reminders.</p>
            <p className="text-zinc-600 text-sm">Create your first reminder to stay on top of priorities.</p>
          </div>
        ) : (
          reminders.map(rem => (
            <div key={rem.id} className="p-5 border-b border-zinc-800/50 last:border-0 flex items-center justify-between hover:bg-zinc-900/30 transition-colors">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleComplete(rem.id)}
                  disabled={completing === rem.id}
                  className="w-5 h-5 rounded border border-zinc-600 bg-zinc-900 hover:border-amber-500 hover:bg-amber-500/10 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0"
                  aria-label="Mark complete"
                />
                <div>
                  <h3 className="font-bold text-white">{rem.title}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Due: {new Date(rem.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded font-medium ${
                rem.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                rem.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                rem.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400' :
                'bg-zinc-800 text-zinc-400'
              }`}>{rem.priority}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
