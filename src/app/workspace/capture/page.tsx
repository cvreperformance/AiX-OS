'use client';

import { useState, useEffect, useCallback } from 'react';
import { saveCapture, getRecentCaptures } from '@/app/actions/personal.actions';
import { Capture } from '@/modules/personal/types/personal.types';

type Status = 'idle' | 'saving' | 'saved' | 'error';

export default function CapturePage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCaptures = useCallback(async () => {
    try {
      const data = await getRecentCaptures(20);
      setCaptures(data);
    } catch (e: any) {
      console.error('Failed to load captures:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCaptures();
  }, [loadCaptures]);

  const handleSave = async () => {
    if (!text.trim()) return;
    setStatus('saving');
    setErrorMsg('');
    try {
      const result = await saveCapture(text.trim());
      if (!result) throw new Error('Server returned null — check Supabase RLS policies and user session.');
      setText('');
      setStatus('saved');
      await loadCaptures();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e: any) {
      console.error('Save capture failed:', e);
      setErrorMsg(e?.message || 'Unknown error. Check the browser console.');
      setStatus('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-16">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Capture</h1>
        <p className="text-zinc-400 mt-2">Ultra-fast raw text dump. Press ⌘+Enter to save.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="I spoke with Marian. Villa. 780k. Call me in August."
          className="w-full h-40 bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl p-6 text-white text-lg focus:outline-none focus:border-amber-500 resize-none transition-colors"
          autoFocus
          disabled={status === 'saving'}
        />

        {/* Status bar */}
        <div className="flex justify-between items-center">
          <div className="text-sm">
            {status === 'saving' && <span className="text-zinc-400">Saving…</span>}
            {status === 'saved' && <span className="text-emerald-400">✓ Saved successfully</span>}
            {status === 'error' && (
              <span className="text-red-400">✗ {errorMsg}</span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!text.trim() || status === 'saving'}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'saving' ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Recent Captures */}
      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Recent Captures</h2>
        {isLoading ? (
          <p className="text-zinc-500">Loading…</p>
        ) : captures.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500">No captures yet. Type something and hit Save.</p>
          </div>
        ) : (
          captures.map((capture) => (
            <div key={capture.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <p className="text-zinc-300 whitespace-pre-wrap">{capture.rawText}</p>
              <p className="text-xs text-zinc-600 mt-2">
                {new Date(capture.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
