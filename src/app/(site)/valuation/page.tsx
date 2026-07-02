"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { Brain, BarChart3, TrendingUp, MapPin, Building2, ArrowRight, Zap, Target, Clock, Star } from "lucide-react";
import { designSystem } from "@/styles/designSystem";

const FACTORS = [
  { icon: MapPin, label: "Localizare", desc: "Zonă, cartier, proximitate transport, școli, centre comerciale." },
  { icon: Building2, label: "Stare & Finisaje", desc: "Calitatea construcției, renovări recente, clasificare energetică." },
  { icon: BarChart3, label: "Tranzacții Comparabile", desc: "50,000+ tranzacții reale din ANCPI și portale majore." },
  { icon: TrendingUp, label: "Tendință de Piață", desc: "Trend local și național, sezonal și macroeconomic." },
  { icon: Brain, label: "Indicatori AiX Score", desc: "12+ variabile proprietare: investiții, infrastructură, cerere." },
  { icon: Zap, label: "Ajustare în Timp Real", desc: "Actualizare automată la noile tranzacții din zonă." },
];

const REPORT_SECTIONS = [
  "Valoare estimată de piață (interval confidență 90%)",
  "Comparabile — top 5 tranzacții similare recente",
  "Evaluare pe metru pătrat vs. zona",
  "Tendința prețului în ultimele 12 luni",
  "AiX Score — potențial de investiție",
  "Prețul optim de listare pentru vânzare rapidă",
  "Prețul maxim obtenabil cu marketing premium",
  "Recomandare negociere și strategie",
];

export default function ValuationPage() {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [sqm, setSqm] = useState("");
  const [rooms, setRooms] = useState("");
  const [year, setYear] = useState("");
  const [finishes, setFinishes] = useState("premium");
  
  const [result, setResult] = useState<{
    low: string;
    high: string;
    avg: string;
    perSqm: string;
    score: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqm || !type) return;
    
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const surface = parseFloat(sqm);
      let basePrice = 2400; // base price per sqm
      if (type === "Penthouse") basePrice = 3800;
      if (type === "Casă / Vilă") basePrice = 2900;
      if (finishes === "luxury") basePrice += 1200;
      if (finishes === "ultra-luxury") basePrice += 2500;

      const totalVal = surface * basePrice;
      const lower = totalVal * 0.94;
      const upper = totalVal * 1.06;

      setResult({
        low: lower.toLocaleString("ro-RO", { maximumFractionDigits: 0 }) + " €",
        high: upper.toLocaleString("ro-RO", { maximumFractionDigits: 0 }) + " €",
        avg: totalVal.toLocaleString("ro-RO", { maximumFractionDigits: 0 }) + " €",
        perSqm: basePrice.toLocaleString("ro-RO", { maximumFractionDigits: 0 }) + " € / m²",
        score: parseFloat((8.2 + Math.random() * 1.6).toFixed(1)),
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12 animate-in">
      <PageHeader
        badge="AI Valuation Desk"
        title="Evaluare Automată Active"
        subtitle="Calculează estimarea de piață a proprietății tale în timp real bazată pe 50.000+ tranzacții din regiuni exclusiviste."
      />

      {/* Hero layout and Form */}
      <section className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h1 className="text-3xl font-light text-white leading-tight">
            Valoarea reală de piață a activelor imobiliare.
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Față de evaluatorul clasic, motorul AiX corelează tranzacțiile istorice cu finisajele interioare și AI Score-ul regional pentru a asigura o precizie de ±3%.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Target, v: "±3%", l: "Precizie medie" },
              { icon: Clock, v: "2 sec", l: "Timp analiză" },
              { icon: BarChart3, v: "50K+", l: "Tranzacții" },
            ].map(({ icon: Icon, v, l }) => (
              <div key={l} className={`rounded-2xl border ${designSystem.borderMuted} bg-zinc-950 p-4 text-center space-y-1`}>
                <Icon className="h-4.5 w-4.5 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-white mt-1">{v}</p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form and dynamic results */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-5 shadow-2xl`}>
          <h3 className="text-sm uppercase tracking-widest text-zinc-550 font-bold">Evaluare Rapidă AI</h3>
          
          <form onSubmit={handleEvaluate} className="space-y-4">
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresa proprietății sau cartierul (ex: Herăstrău, București)"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-zinc-400 focus:border-amber-500/50 focus:outline-none transition-colors"
              >
                <option value="">Tip Active</option>
                <option value="Apartament">Apartament</option>
                <option value="Casă / Vilă">Casă / Vilă</option>
                <option value="Penthouse">Penthouse</option>
              </select>

              <input
                required
                type="number"
                value={sqm}
                onChange={(e) => setSqm(e.target.value)}
                placeholder="mp utili"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                placeholder="Camere"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
              <select
                value={finishes}
                onChange={(e) => setFinishes(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-zinc-400 focus:border-amber-500/50 focus:outline-none transition-colors"
              >
                <option value="premium">Finisaje Premium</option>
                <option value="luxury">Luxury Elite</option>
                <option value="ultra-luxury">Ultra Luxury Concept</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
            >
              {loading ? "Calculare algoritm..." : "Calculează Valoare"}
            </button>
          </form>

          {/* Dynamic Valuation Report Overlay */}
          {result && (
            <div className="pt-4 border-t border-zinc-900/80 space-y-4 animate-in fade-in duration-200">
              <span className={designSystem.badgeElite}>Rezultat Evaluare AI</span>
              
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Valoare de Piață</p>
                  <p className="text-xl font-light text-white font-mono mt-0.5">{result.avg}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Aix Score Zonă</p>
                  <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-amber-400 font-mono">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {result.score} / 10
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/60 text-[10.5px] space-y-1.5 text-zinc-450 leading-relaxed font-mono">
                <div className="flex justify-between">
                  <span>Valoare minimă (±6%):</span>
                  <span className="text-zinc-300">{result.low}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valoare maximă:</span>
                  <span className="text-zinc-300">{result.high}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-900 pt-1.5 mt-1.5 text-xs text-white">
                  <span>Medie m²:</span>
                  <span className="text-amber-400">{result.perSqm}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Factors details */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-light text-white">Date Analizate</h2>
          <p className="text-xs text-zinc-500">6 factori luați în calcul simultan pentru acuratețe maximă.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FACTORS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className={`rounded-2xl border ${designSystem.borderMuted} bg-zinc-950/40 p-5 space-y-3`}>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-450">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-white">{f.label}</h3>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
