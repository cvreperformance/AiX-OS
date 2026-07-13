'use client';

import { useState } from 'react';
import { saveCapture } from '@/app/actions/personal.actions';

export default function CapturePage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    if (!text.trim()) return;
    setStatus('Saving...');
    try {
      await saveCapture(text);
      setText('');
      setStatus('Saved.');
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
          className="w-full h-64 bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl p-6 text-white text-lg focus:outline-none focus:border-amber-500 resize-none transition-colors"
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
    </div>
  );
}
