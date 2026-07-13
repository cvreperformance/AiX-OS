'use client';

import { useState } from 'react';
import { RadarAnalyzerService } from '@/modules/radar/services/analyzer.service';
import { RadarAnalysisResult } from '@/modules/radar/types/radar.types';

export default function RadarPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<RadarAnalysisResult | null>(null);
  
  const handleAnalyze = () => {
    if (!text.trim()) return;
    const analyzer = new RadarAnalyzerService();
    const analysis = analyzer.analyze(text);
    setResult(analysis);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-display text-white font-bold tracking-tight">AiX Radar</h1>
        <p className="text-zinc-400 mt-2">Deterministic property analysis engine.</p>
      </div>

      <div className="glass-card p-6 border border-zinc-800/50 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm">
        <textarea
          className="w-full h-40 bg-[#121212] border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none transition-all placeholder:text-zinc-600"
          placeholder="Paste property description here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!text.trim()}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0a] text-sm font-semibold rounded-md transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>

      {result && (
        <div className="glass-card p-6 border border-zinc-800/50 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm animate-in slide-in-from-bottom-4 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <h2 className="text-xl font-medium text-white">Analysis Result</h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Opportunity Score</p>
                <p className={`text-3xl font-bold ${result.opportunityScore >= 70 ? 'text-emerald-500' : result.opportunityScore <= 40 ? 'text-red-500' : 'text-amber-500'}`}>
                  {result.opportunityScore}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#121212] p-4 rounded-lg border border-zinc-800/80">
              <p className="text-xs text-zinc-500 uppercase font-medium">Revenue Potential</p>
              <p className="text-sm font-medium text-white mt-1">{result.revenuePotential}</p>
            </div>
            <div className="bg-[#121212] p-4 rounded-lg border border-zinc-800/80">
              <p className="text-xs text-zinc-500 uppercase font-medium">Risk Level</p>
              <p className="text-sm font-medium text-white mt-1">{result.riskLevel}</p>
            </div>
            <div className="bg-[#121212] p-4 rounded-lg border border-zinc-800/80">
              <p className="text-xs text-zinc-500 uppercase font-medium">Property Type</p>
              <p className="text-sm font-medium text-white mt-1">{result.propertyType}</p>
            </div>
            <div className="bg-[#121212] p-4 rounded-lg border border-zinc-800/80">
              <p className="text-xs text-zinc-500 uppercase font-medium">Price Range</p>
              <p className="text-sm font-medium text-white mt-1">{result.priceRange}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="text-sm font-medium text-emerald-500 mb-3 flex items-center">
                Strengths ({result.strengths.length})
              </h3>
              <ul className="space-y-2.5">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start">
                    <span className="mr-2 text-emerald-500 mt-0.5">•</span> {s}
                  </li>
                ))}
                {result.strengths.length === 0 && <li className="text-sm text-zinc-600 italic">None detected.</li>}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-red-500 mb-3 flex items-center">
                Weaknesses ({result.weaknesses.length})
              </h3>
              <ul className="space-y-2.5">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start">
                    <span className="mr-2 text-red-500 mt-0.5">•</span> {w}
                  </li>
                ))}
                {result.weaknesses.length === 0 && <li className="text-sm text-zinc-600 italic">None detected.</li>}
              </ul>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg mt-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-amber-500/80 mb-2">Recommendation</h3>
            <p className="text-sm text-amber-100/90">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
