import type { Metadata } from "next";
import { BarChart3, Shield, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "AiX OS Score",
  description:
    "Sistemul proprietar de evaluare a oportunităților de investiții. Score 1.0 — 10.0.",
};

const factors = [
  { name: "Economic Impact", desc: "Impact macroeconomic și sectorial" },
  { name: "Market Relevance", desc: "Relevanță pentru piața țintă" },
  { name: "Investment Potential", desc: "Potențial de apreciere și yield" },
  { name: "Supply vs Demand", desc: "Echilibrul ofertă-cerere" },
  { name: "Capital Appreciation", desc: "Apreciere capital pe termen lung" },
  { name: "Rental Potential", desc: "Potențial de închiriere" },
  { name: "Liquidity", desc: "Ușurința de vânzare / exit" },
  { name: "Risk Level", desc: "Evaluare risc multi-factor" },
  { name: "Infrastructure", desc: "Infrastructură existentă și planificată" },
  { name: "Geopolitical Importance", desc: "Stabilitate și context geopolitic" },
  { name: "Market Sentiment", desc: "Sentimentul pieței și trenduri" },
  { name: "Long-term Value", desc: "Valoare fundamentală pe termen lung" },
];

const scoreRanges = [
  { range: "9.0 — 10.0", label: "Exceptional", color: "text-emerald-400", desc: "Oportunitate rară. Factori favorabili simultan." },
  { range: "7.0 — 8.9", label: "Strong", color: "text-amber-400", desc: "Fundamentale solide. Merită analiză detaliată." },
  { range: "5.0 — 6.9", label: "Moderate", color: "text-zinc-300", desc: "Relevanță medie. Context-dependent." },
  { range: "1.0 — 4.9", label: "Low", color: "text-zinc-500", desc: "Impact limitat. Filtrat automat din feed." },
];

export default function AixScorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Proprietary Rating"
        title="AiX OS Score"
        subtitle="Un rating proprietar de investment intelligence, conceput pentru a evalua oportunități pe baza a 12+ indicatori strategici."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Target, title: "Nu e random", desc: "Generat algoritmic pe baza factorilor definitorii." },
          { icon: BarChart3, title: "Scală completă", desc: "De la 1.0 la 10.0, cu distribuție realistă." },
          { icon: Shield, title: "Cu explicație", desc: "Fiecare score vine cu Why și Investment Insight." },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3"
          >
            <item.icon className="h-6 w-6 text-amber-500/70" />
            <h3 className="text-lg font-light text-white">{item.title}</h3>
            <p className="text-sm text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-light text-white mb-8">Factori de Evaluare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((f, i) => (
            <div
              key={f.name}
              className="flex items-start gap-4 rounded-xl border border-zinc-800 p-4"
            >
              <span className="text-xs text-amber-500/60 font-mono mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-200">{f.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-light text-white mb-8">Interpretare Score</h2>
        <div className="space-y-4">
          {scoreRanges.map((s) => (
            <div
              key={s.range}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-zinc-800 p-5"
            >
              <div className="sm:w-32">
                <p className={`text-lg font-light ${s.color}`}>{s.range}</p>
                <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
              </div>
              <p className="text-sm text-zinc-400 flex-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
        <TrendingUp className="h-8 w-8 text-amber-500/70 mx-auto" />
        <p className="text-zinc-300 max-w-lg mx-auto">
          Exemplu: Score <span className="text-emerald-400 font-medium">9.4</span> — Strong
          long-term investment fundamentals supported by limited supply, increasing demand
          and positive macroeconomic indicators.
        </p>
      </section>
    </div>
  );
}
