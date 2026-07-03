"use client";

import { useState } from "react";
import { BarChart3, Shield, Target, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { designSystem } from "@/styles/designSystem";

const factors = [
  { id: 1, name: "Economic Impact", desc: "Impact macroeconomic și sectorial al pieței analizate", weight: 12 },
  { id: 2, name: "Market Relevance", desc: "Relevanță pentru piața țintă și lichiditate", weight: 10 },
  { id: 3, name: "Investment Potential", desc: "Potențial de apreciere și yield pe termen mediu", weight: 15 },
  { id: 4, name: "Supply vs Demand", desc: "Echilibrul ofertă-cerere în segmentul evaluat", weight: 10 },
  { id: 5, name: "Capital Appreciation", desc: "Apreciere capital pe termen lung vs. benchmark", weight: 12 },
  { id: 6, name: "Rental Potential", desc: "Potențial de închiriere și randament net", weight: 10 },
  { id: 7, name: "Liquidity", desc: "Ușurința de vânzare / exit în piață activă", weight: 8 },
  { id: 8, name: "Risk Level", desc: "Evaluare risc multi-factor și macroeconomic", weight: 8 },
  { id: 9, name: "Infrastructure", desc: "Infrastructură existentă și planificată în 5 ani", weight: 5 },
  { id: 10, name: "Geopolitical Importance", desc: "Stabilitate și context geopolitic regional", weight: 5 },
  { id: 11, name: "Market Sentiment", desc: "Sentimentul pieței, trenduri și volume", weight: 3 },
  { id: 12, name: "Long-term Value", desc: "Valoare fundamentală pe termen lung 10Y+", weight: 2 },
];

const scoreRanges = [
  { range: "9.0 — 10.0", label: "Exceptional", color: "text-emerald-400", borderColor: "border-emerald-500/30", bgColor: "bg-emerald-500/5", desc: "Oportunitate rară. Factori favorabili simultan. Investiție prioritară." },
  { range: "7.0 — 8.9", label: "Strong", color: "text-amber-400", borderColor: "border-amber-500/30", bgColor: "bg-amber-500/5", desc: "Fundamentale solide. Merită analiză detaliată și alocare semnificativă." },
  { range: "5.0 — 6.9", label: "Moderate", color: "text-zinc-300", borderColor: "border-zinc-700", bgColor: "bg-zinc-900/30", desc: "Relevanță medie. Evaluare context-dependent cu strategii de hedging." },
  { range: "1.0 — 4.9", label: "Low", color: "text-zinc-500", borderColor: "border-zinc-900", bgColor: "bg-zinc-950/40", desc: "Impact limitat. Filtrat automat din feed. Nu apare în recomandări." },
];

// Demo score calculator
const DEMO_ASSETS = [
  { name: "Penthouse Herăstrău", type: "Rezidențial Lux", score: 9.2, location: "București" },
  { name: "One Lake District", type: "Rezidențial Off-plan", score: 8.7, location: "București" },
  { name: "Dubai Marina Tower", type: "International Luxury", score: 9.5, location: "Dubai" },
  { name: "Tour Odeon MCM", type: "Ultra-Luxury", score: 9.8, location: "Monaco" },
  { name: "Apartament Cluj Tech Hub", type: "Rezidențial", score: 7.4, location: "Cluj-Napoca" },
  { name: "Spațiu Comercial Pipera", type: "Comercial", score: 6.1, location: "București" },
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 9 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
    score >= 7 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
    score >= 5 ? "bg-zinc-800 border-zinc-700 text-zinc-300" :
    "bg-zinc-950 border-zinc-900 text-zinc-500";
  
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

export default function AixScorePage() {
  const [selectedFactor, setSelectedFactor] = useState<typeof factors[0] | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Proprietary Rating Engine"
        title="AiX OS Score™"
        subtitle="Sistemul proprietar de intelligence al platformei. Evaluează fiecare oportunitate pe baza a 12 indicatori strategici ponderați, generând un rating de investiție de la 1.0 la 10.0."
      />

      {/* How it works - 3 pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "Algoritmic, nu subiectiv", desc: "Generat pe baza factorilor macroeconomici și de piață. Nu conține bias editorial sau comercial." },
          { icon: BarChart3, title: "Scală completă 1.0–10.0", desc: "Distribuție realistă bazată pe date comparabile. Scoruri >9.0 sunt rare și semnalează oportunitate excepțională." },
          { icon: Shield, title: "Transparent cu explicație", desc: "Fiecare score vine cu breakdown pe factori, insight-uri și recomandare de strategie pentru investitor." },
        ].map((item) => (
          <div key={item.title} className={`rounded-3xl ${designSystem.glass} p-6 space-y-3`}>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 w-fit">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="text-xs text-zinc-450 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Score range interpretation */}
      <section className="space-y-6">
        <h2 className="text-lg font-light text-white">Interpretare Scor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoreRanges.map((sr) => (
            <div key={sr.range} className={`rounded-2xl border ${sr.borderColor} ${sr.bgColor} p-5 space-y-2`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{sr.range}</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${sr.color}`}>{sr.label}</span>
              </div>
              <p className="text-[11px] text-zinc-450 leading-relaxed">{sr.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 12 Factors Interactive Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-light text-white">12 Factori de Evaluare</h2>
          <span className="text-[10px] text-zinc-500 font-mono">Click pentru detalii</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFactor(selectedFactor?.id === f.id ? null : f)}
              className={`flex items-start gap-4 rounded-2xl border text-left p-4 transition-all duration-200 ${
                selectedFactor?.id === f.id
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-900/20"
              }`}
            >
              <span className="text-[10px] text-amber-500/60 font-mono mt-0.5 flex-shrink-0">
                {String(f.id).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-zinc-200">{f.name}</p>
                  <span className="text-[9px] text-zinc-500 font-mono flex-shrink-0">{f.weight}%</span>
                </div>
                {selectedFactor?.id === f.id && (
                  <p className="text-[10.5px] text-zinc-400 mt-1.5 leading-relaxed">{f.desc}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Demo Active Scores Table */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500/80" />
          <h2 className="text-lg font-light text-white">Exemple Active Evaluate</h2>
        </div>
        
        <div className={`rounded-3xl ${designSystem.glass} overflow-hidden`}>
          <div className="grid grid-cols-12 px-5 py-3 text-[9px] uppercase tracking-widest text-zinc-600 border-b border-zinc-900 font-semibold">
            <span className="col-span-4">Active</span>
            <span className="col-span-3">Tip</span>
            <span className="col-span-3">Locație</span>
            <span className="col-span-2 text-right">AiX Score</span>
          </div>
          {DEMO_ASSETS.map((asset, idx) => (
            <div
              key={asset.name}
              className={`grid grid-cols-12 px-5 py-4 text-xs items-center ${
                idx < DEMO_ASSETS.length - 1 ? "border-b border-zinc-900/50" : ""
              } hover:bg-zinc-900/20 transition-colors`}
            >
              <span className="col-span-4 font-semibold text-white truncate pr-2">{asset.name}</span>
              <span className="col-span-3 text-zinc-450">{asset.type}</span>
              <span className="col-span-3 text-zinc-550 flex items-center gap-1.5">
                <span className="text-zinc-650">{asset.location}</span>
              </span>
              <span className="col-span-2 flex justify-end">
                <ScoreBadge score={asset.score} />
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
