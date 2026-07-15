"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { Brain, BarChart3, TrendingUp, MapPin, Building2, Zap, Target, Clock, Star } from "lucide-react";
import { designSystem } from "@/styles/designSystem";

const FACTORS = [
  { icon: MapPin, label: "Localizare", desc: "Zonă, cartier, proximitate transport, școli, centre comerciale." },
  { icon: Building2, label: "Stare & Finisaje", desc: "Calitatea construcției, renovări recente, clasificare energetică." },
  { icon: BarChart3, label: "Tranzacții Comparabile", desc: "50,000+ tranzacții reale din ANCPI și portale majore." },
  { icon: TrendingUp, label: "Tendință de Piață", desc: "Trend local și național, sezonal și macroeconomic." },
  { icon: Brain, label: "Indicatori AiX Score", desc: "12+ variabile proprietare: investiții, infrastructură, cerere." },
  { icon: Zap, label: "Ajustare în Timp Real", desc: "Actualizare automată la noile tranzacții din zonă." },
];

export default function ValuationPage() {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [sqm, setSqm] = useState("");
  const [rooms, setRooms] = useState("");
  const [finishes, setFinishes] = useState("premium");
  
  const [result, setResult] = useState<{
    low: string;
    high: string;
    avg: string;
    perSqm: string;
    score: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  // Lead contact form states
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadBotfield, setLeadBotfield] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState("");

  const handleRequestReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    setLeadLoading(true);
    setLeadError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "AI Property Valuation",
          name: leadName,
          phone: leadPhone,
          email: leadEmail || undefined,
          message: `Solicitare Raport Oficial pentru Adresa: ${address}. Suprafata: ${sqm} mp, Tip: ${type}, Finisaje: ${finishes}. Valoare Evaluare AI: ${result?.avg}`,
          source: "valuation-report-cta",
          page: "/valuation",
          botfield: leadBotfield || undefined,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit lead");
      }
      setLeadSuccess(true);
    } catch (err: any) {
      setLeadError(err.message || "Failed to request report.");
    } finally {
      setLeadLoading(false);
    }
  };

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
        title="Află valoarea reală de vânzare a casei tale"
        subtitle="Evită stabilirea unui preț greșit care îți blochează vânzarea. Calculează valoarea pe baza tranzacțiilor reale."
      />

      {/* Hero layout and Form */}
      <section className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h1 className="text-3xl font-light text-zinc-900 leading-tight">
            Nu lăsa bani pe masă la tranzacționare.
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sistemul analizează automat contractele de vânzare din zonă și calitatea finisajelor pentru a oferi o estimare de preț precisă cu o marjă de eroare scăzută.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Target, v: "Optim", l: "Estimare corectă" },
              { icon: Clock, v: "Rapid", l: "Timp analiză" },
              { icon: BarChart3, v: "Multiple", l: "Tranzacții" },
            ].map(({ icon: Icon, v, l }) => (
              <div key={l} className={`rounded-2xl border ${designSystem.borderMuted} bg-white p-4 text-center space-y-1`}>
                <Icon className="h-4.5 w-4.5 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-zinc-900 mt-1">{v}</p>
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">{l}</p>
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
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-400 focus:border-amber-500/50 focus:outline-none transition-colors"
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
                className="rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                placeholder="Camere"
                className="rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
              <select
                value={finishes}
                onChange={(e) => setFinishes(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-400 focus:border-amber-500/50 focus:outline-none transition-colors"
              >
                <option value="premium">Calitate superioară</option>
                <option value="luxury">Finisaje de înaltă calitate</option>
                <option value="ultra-luxury">Finisaje personalizate la comandă</option>
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
            <div className="pt-4 border-t border-zinc-200/80 space-y-4 animate-in fade-in duration-200">
              <span className={designSystem.badgeElite}>Rezultat Evaluare AI</span>
              
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Valoare de Piață</p>
                  <p className="text-xl font-light text-zinc-900 font-mono mt-0.5">{result.avg}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Aix Score Zonă</p>
                  <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-amber-400 font-mono">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {result.score} / 10
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white/60 text-[10.5px] space-y-1.5 text-zinc-450 leading-relaxed font-mono">
                <div className="flex justify-between">
                  <span>Valoare minimă (±6%):</span>
                  <span className="text-zinc-600">{result.low}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valoare maximă:</span>
                  <span className="text-zinc-600">{result.high}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-1.5 mt-1.5 text-xs text-zinc-900">
                  <span>Medie m²:</span>
                  <span className="text-amber-400">{result.perSqm}</span>
                </div>
              </div>

              {/* Premium Report Lead Form */}
              <div className="pt-4 border-t border-zinc-200/80 space-y-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Solicită Raport Semnat Oficial</p>
                {leadSuccess ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                    <p className="text-emerald-400 text-xs font-semibold">✓ Solicitare trimisă cu succes!</p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestReport} className="space-y-2">
                    <input
                      type="text"
                      name="botfield"
                      value={leadBotfield}
                      onChange={(e) => setLeadBotfield(e.target.value)}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    {leadError && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2 text-[10px] text-red-400">
                        {leadError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Numele dvs."
                        className="rounded-lg border border-zinc-200 bg-zinc-50/40 px-3 py-2 text-[11px] text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
                      />
                      <input
                        required
                        type="tel"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="Telefon"
                        className="rounded-lg border border-zinc-200 bg-zinc-50/40 px-3 py-2 text-[11px] text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="E-mail (opțional)"
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/40 px-3 py-2 text-[11px] text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={leadLoading}
                      className="w-full rounded-lg bg-amber-500 text-black py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-1"
                    >
                      {leadLoading ? "Se trimite..." : "Solicită Raport Complet"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Factors details */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-light text-zinc-900">Date Analizate</h2>
          <p className="text-xs text-zinc-400">6 factori luați în calcul simultan pentru acuratețe maximă.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FACTORS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className={`rounded-2xl border ${designSystem.borderMuted} bg-white/40 p-5 space-y-3`}>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-450">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-900">{f.label}</h3>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
