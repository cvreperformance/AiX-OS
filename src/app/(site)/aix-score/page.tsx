"use client";

import { useState } from "react";
import { BarChart3, Shield, Target, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { designSystem } from "@/styles/designSystem";
import { useLanguage } from "@/context/LanguageContext";

const FACTORS_RO = [
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

const FACTORS_EN = [
  { id: 1, name: "Economic Impact", desc: "Macro and sectoral economic impact of the analyzed market", weight: 12 },
  { id: 2, name: "Market Relevance", desc: "Relevance for target market and overall liquidity", weight: 10 },
  { id: 3, name: "Investment Potential", desc: "Appreciation potential and medium-term yield", weight: 15 },
  { id: 4, name: "Supply vs Demand", desc: "Supply-demand equilibrium in the evaluated segment", weight: 10 },
  { id: 5, name: "Capital Appreciation", desc: "Long-term capital appreciation vs. benchmark", weight: 12 },
  { id: 6, name: "Rental Potential", desc: "Rental income potential and net yield", weight: 10 },
  { id: 7, name: "Liquidity", desc: "Ease of sale / exit in an active market", weight: 8 },
  { id: 8, name: "Risk Level", desc: "Multi-factor and macroeconomic risk assessment", weight: 8 },
  { id: 9, name: "Infrastructure", desc: "Existing and planned infrastructure over 5 years", weight: 5 },
  { id: 10, name: "Geopolitical Importance", desc: "Regional geopolitical stability and context", weight: 5 },
  { id: 11, name: "Market Sentiment", desc: "Market sentiment, trends, and trading volumes", weight: 3 },
  { id: 12, name: "Long-term Value", desc: "Fundamental long-term value over 10Y+ horizon", weight: 2 },
];

const SCORE_RANGES_RO = [
  { range: "9.0 — 10.0", label: "Exceptional", color: "text-emerald-400", borderColor: "border-emerald-500/30", bgColor: "bg-emerald-500/5", desc: "Oportunitate rară. Factori favorabili simultan. Investiție prioritară." },
  { range: "7.0 — 8.9", label: "Strong", color: "text-amber-400", borderColor: "border-amber-500/30", bgColor: "bg-amber-500/5", desc: "Fundamentale solide. Merită analiză detaliată și alocare semnificativă." },
  { range: "5.0 — 6.9", label: "Moderate", color: "text-zinc-600", borderColor: "border-zinc-300", bgColor: "bg-zinc-50/30", desc: "Relevanță medie. Evaluare context-dependent cu strategii de hedging." },
  { range: "1.0 — 4.9", label: "Low", color: "text-zinc-400", borderColor: "border-zinc-200", bgColor: "bg-white/40", desc: "Impact limitat. Filtrat automat din feed. Nu apare în recomandări." },
];

const SCORE_RANGES_EN = [
  { range: "9.0 — 10.0", label: "Exceptional", color: "text-emerald-400", borderColor: "border-emerald-500/30", bgColor: "bg-emerald-500/5", desc: "Rare opportunity. Favorable factors aligned simultaneously. Priority investment." },
  { range: "7.0 — 8.9", label: "Strong", color: "text-amber-400", borderColor: "border-amber-500/30", bgColor: "bg-amber-500/5", desc: "Solid fundamentals. Deserves detailed analysis and significant allocation." },
  { range: "5.0 — 6.9", label: "Moderate", color: "text-zinc-600", borderColor: "border-zinc-300", bgColor: "bg-zinc-50/30", desc: "Average relevance. Context-dependent evaluation with hedging strategies." },
  { range: "1.0 — 4.9", label: "Low", color: "text-zinc-400", borderColor: "border-zinc-200", bgColor: "bg-white/40", desc: "Limited impact. Automatically filtered from feed. Does not appear in recommendations." },
];

const DEMO_ASSETS = [
  { name: "Penthouse Herăstrău", type: "Rezidențial Lux", typeEn: "Luxury Residential", score: 9.2, location: "București" },
  { name: "One Lake District", type: "Rezidențial Off-plan", typeEn: "Off-plan Residential", score: 8.7, location: "București" },
  { name: "Dubai Marina Tower", type: "International Luxury", typeEn: "International Luxury", score: 9.5, location: "Dubai" },
  { name: "Tour Odeon MCM", type: "Ultra-Luxury", typeEn: "Ultra-Luxury", score: 9.8, location: "Monaco" },
  { name: "Apartament Cluj Tech Hub", type: "Rezidențial", typeEn: "Residential", score: 7.4, location: "Cluj-Napoca" },
  { name: "Spațiu Comercial Pipera", type: "Comercial", typeEn: "Commercial", score: 6.1, location: "București" },
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 9 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
    score >= 7 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
    score >= 5 ? "bg-zinc-100 border-zinc-300 text-zinc-600" :
    "bg-white border-zinc-200 text-zinc-400";
  
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

export default function AixScorePage() {
  const { language } = useLanguage();
  const [selectedFactor, setSelectedFactor] = useState<typeof FACTORS_RO[0] | null>(null);

  const factors = language === "ro" ? FACTORS_RO : FACTORS_EN;
  const scoreRanges = language === "ro" ? SCORE_RANGES_RO : SCORE_RANGES_EN;

  const pillars = language === "ro" ? [
    { icon: Target, title: "Algoritmic, nu subiectiv", desc: "Generat pe baza factorilor macroeconomici și de piață. Nu conține bias editorial sau comercial." },
    { icon: BarChart3, title: "Scală completă 1.0–10.0", desc: "Distribuție realistă bazată pe date comparabile. Scoruri >9.0 sunt rare și semnalează oportunitate excepțională." },
    { icon: Shield, title: "Transparent cu explicație", desc: "Fiecare score vine cu breakdown pe factori, insight-uri și recomandare de strategie pentru investitor." },
  ] : [
    { icon: Target, title: "Algorithmic, not subjective", desc: "Generated based on macroeconomic and market factors. No editorial or commercial bias." },
    { icon: BarChart3, title: "Full scale 1.0–10.0", desc: "Realistic distribution based on comparable data. Scores >9.0 are rare and signal exceptional opportunity." },
    { icon: Shield, title: "Transparent with explanation", desc: "Every score comes with a factor breakdown, insights, and strategy recommendation for the investor." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Proprietary Rating Engine"
        title="AiX OS™ Score™"
        subtitle={
          language === "ro"
            ? "Sistemul proprietar de intelligence al platformei. Evaluează fiecare oportunitate pe baza a 12 indicatori strategici ponderați, generând un rating de investiție de la 1.0 la 10.0."
            : "The platform's proprietary intelligence engine. Evaluates every opportunity across 12 weighted strategic indicators, generating an investment rating from 1.0 to 10.0."
        }
      />

      {/* How it works - 3 pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pillars.map((item) => (
          <div key={item.title} className={`rounded-3xl ${designSystem.glass} p-6 space-y-3`}>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 w-fit">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
            <p className="text-xs text-zinc-450 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Score range interpretation */}
      <section className="space-y-6">
        <h2 className="text-lg font-light text-zinc-900">
          {language === "ro" ? "Interpretare Scor" : "Score Interpretation"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoreRanges.map((sr) => (
            <div key={sr.range} className={`rounded-2xl border ${sr.borderColor} ${sr.bgColor} p-5 space-y-2`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">{sr.range}</span>
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
          <h2 className="text-lg font-light text-zinc-900">
            {language === "ro" ? "12 Factori de Evaluare" : "12 Evaluation Factors"}
          </h2>
          <span className="text-[10px] text-zinc-400 font-mono">
            {language === "ro" ? "Click pentru detalii" : "Click for details"}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFactor(selectedFactor?.id === f.id ? null : f)}
              className={`flex items-start gap-4 rounded-2xl border text-left p-4 transition-all duration-200 ${
                selectedFactor?.id === f.id
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-zinc-200 bg-white/40 hover:border-zinc-300 hover:bg-zinc-100/20"
              }`}
            >
              <span className="text-[10px] text-amber-500/60 font-mono mt-0.5 flex-shrink-0">
                {String(f.id).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-zinc-200">{f.name}</p>
                  <span className="text-[9px] text-zinc-400 font-mono flex-shrink-0">{f.weight}%</span>
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
          <h2 className="text-lg font-light text-zinc-900">
            {language === "ro" ? "Exemple Active Evaluate" : "Live Evaluated Examples"}
          </h2>
        </div>
        
        <div className={`rounded-3xl ${designSystem.glass} overflow-hidden`}>
          <div className="grid grid-cols-12 px-5 py-3 text-[9px] uppercase tracking-widest text-zinc-600 border-b border-zinc-200 font-semibold">
            <span className="col-span-4">{language === "ro" ? "Active" : "Asset"}</span>
            <span className="col-span-3">{language === "ro" ? "Tip" : "Type"}</span>
            <span className="col-span-3">{language === "ro" ? "Locație" : "Location"}</span>
            <span className="col-span-2 text-right">AiX Score</span>
          </div>
          {DEMO_ASSETS.map((asset, idx) => (
            <div
              key={asset.name}
              className={`grid grid-cols-12 px-5 py-4 text-xs items-center ${
                idx < DEMO_ASSETS.length - 1 ? "border-b border-zinc-200/50" : ""
              } hover:bg-zinc-100/20 transition-colors`}
            >
              <span className="col-span-4 font-semibold text-zinc-900 truncate pr-2">{asset.name}</span>
              <span className="col-span-3 text-zinc-450">{language === "ro" ? asset.type : asset.typeEn}</span>
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
