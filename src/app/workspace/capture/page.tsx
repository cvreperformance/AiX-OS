'use client';

import { useState, useEffect } from 'react';
import { saveCapture, getRecentCaptures } from '@/app/actions/personal.actions';
import { Capture } from '@/modules/personal/types/personal.types';

export default function CapturePage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [captures, setCaptures] = useState<Capture[]>([]);

  useEffect(() => {
    loadCaptures();
  }, []);

  const loadCaptures = async () => {
    try {
      const data = await getRecentCaptures();
      setCaptures(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    setStatus('Saving...');
    try {
      await saveCapture(text);
      setText('');
      setStatus('Saved.');
      await loadCaptures();
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus('Error saving.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-16">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Capture</h1>
        <p className="text-zinc-400 mt-2">Ultra-fast raw text dump. Write anything.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="I spoke with Marian. Villa. 780k. Call me in August."
          className="w-full h-40 bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl p-6 text-white text-lg focus:outline-none focus:border-amber-500 resize-none transition-colors"
          autoFocus
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-500">{status}</span>
          <button 
            onClick={handleSave}
            disabled={!text.trim()}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Recent Captures</h2>
        {captures.length === 0 ? (
          <p className="text-zinc-500">No recent captures.</p>
        ) : (
          captures.map(capture => (
            <div key={capture.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <p className="text-zinc-300 whitespace-pre-wrap">{capture.rawText}</p>
              <p className="text-xs text-zinc-500 mt-2">
                {new Date(capture.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
