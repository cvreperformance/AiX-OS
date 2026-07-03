"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Shield,
  Brain,
  Search,
  FileText,
  Building2,
  XCircle,
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";

const RED_FLAGS = [
  { icon: AlertTriangle, title: "Preț suspect de mic", desc: "Proprietăți cu prețuri cu 20%+ sub piață sunt adesea semnale de probleme juridice sau vânzare forțată." },
  { icon: XCircle, title: "Acte incomplete sau copii", desc: "Vânzătorul refuză să prezinte originale sau evită notarul. Semn că actele pot fi falsificate." },
  { icon: AlertTriangle, title: "Urgență artificială", desc: "Presiunea de a semna rapid, fără timp de verificare. Tactică clasică pentru a ascunde probleme." },
  { icon: XCircle, title: "Multiple agenții simultan", desc: "Proprietatea listată la multe agenții concomitent poate indica probleme de vânzare sau titlu neclar." },
  { icon: AlertTriangle, title: "Renovare proaspătă", desc: "Renovare recentă poate ascunde vicii structurale sau inundații. Verificare tehnică obligatorie." },
  { icon: XCircle, title: "Vânzător nervos sau evaziv", desc: "Refuză răspunsuri clare la întrebări despre vecini, calitatea clădirii sau istoricul proprietății." },
];

const CHECKS = [
  { icon: FileText, title: "Verificare Titlu de Proprietate", desc: "Confirmăm proprietarul legal, istoricul transferurilor și că titlul este curat și necontestat." },
  { icon: Shield, title: "Sarcini și Ipoteci", desc: "Verificăm în Cartea Funciară prezența ipotecilor, interdicțiilor de înstrăinare sau gajurilor." },
  { icon: Search, title: "Litigii Active", desc: "Identificăm procese civile sau penale legate de proprietate sau de vânzător la instanțele locale." },
  { icon: Brain, title: "Preț vs. Piață (AI)", desc: "AiX Score compară prețul cerut cu tranzacțiile similare și detectează deviații semnificative." },
  { icon: Building2, title: "Stare Tehnică", desc: "Evaluare vizuală a stării structurale, instalații și finisaje. Alertă pentru vicii ascunse." },
  { icon: AlertTriangle, title: "Istoricul Proprietarilor", desc: "Analizăm numărul de transferuri anterioare, moșteniri complexe și posibile dispute de proprietate." },
];

export default function AntiTeapaPage() {
  const [address, setAddress] = useState("");
  const [cadastru, setCadastru] = useState("");
  const [price, setPrice] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    score: number;
    safetyLevel: "low" | "medium" | "high";
    litigii: string;
    ipoteci: string;
    cadastruStatus: string;
    recommendation: string;
  } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !cadastru) return;

    setLoading(true);
    setReport(null);

    setTimeout(() => {
      // Simulate verification results
      const val = parseFloat(price);
      const isSuspectPrice = !isNaN(val) && val < 200000;
      
      setReport({
        score: isSuspectPrice ? 42 : 88,
        safetyLevel: isSuspectPrice ? "low" : "high",
        litigii: isSuspectPrice ? "1 dosar civil activ identificat (rol litigiu titlu)" : "Niciun litigiu activ identificat pe adresa solicitată",
        ipoteci: isSuspectPrice ? "Ipotecă activă (bancă comercială, nesalvată)" : "Liber de sarcini bancare active",
        cadastruStatus: "Număr cadastru înregistrat, corespunde cu releveul depus",
        recommendation: isSuspectPrice 
          ? "AVERTISMENT: Prețul cerut este suspect de scăzut pentru zonă, iar prezența litigiului active impune asistență juridică înainte de plata oricărui avans."
          : "VERDE: Proprietate curată din punct de vedere preliminar. Recomandăm due-diligence fizic complet înainte de semnare.",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12 animate-in">
      
      {/* Hero & Analyzer */}
      <section className="space-y-6">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-red-500/80 border border-red-500/20 rounded-full px-3 py-1">
          AiX OS · AntiȚeapă AI
        </span>
        
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-5xl font-light text-white leading-tight">
              Verifică Orice Proprietate<br />
              <span className="text-red-400">Înainte de Semnare.</span>
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Analizăm automat titlurile de proprietate, sarcinile înregistrate în Cartea Funciară și istoricul litigiilor active pentru a te proteja de capcane imobiliare.
            </p>

            {/* Quick Audit Form */}
            <div className={`p-6 sm:p-7 rounded-3xl ${designSystem.glass} space-y-4`}>
              <h3 className="text-xs uppercase tracking-widest text-zinc-550 font-bold">Verificare rapidă securizată</h3>
              
              <form onSubmit={handleVerify} className="space-y-4">
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adresa completă sau codul poștal"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500/50 focus:outline-none transition-colors"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    value={cadastru}
                    onChange={(e) => setCadastru(e.target.value)}
                    placeholder="Număr cadastral / CF"
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500/50 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Preț solicitat (€)"
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500/50 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-red-600 text-white py-3 text-xs font-semibold uppercase tracking-wider hover:bg-red-500 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? "Scanare registre active..." : "Scanează Risc Active"}
                </button>
              </form>

              {/* Dynamic Due Diligence Output */}
              {report && (
                <div className="pt-4 border-t border-zinc-900/80 space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <span className={designSystem.badgeElite}>AI Risk Report</span>
                    <span className={`text-[10px] uppercase tracking-widest font-mono font-bold ${
                      report.safetyLevel === "high" ? "text-emerald-400" : "text-red-400 animate-pulse"
                    }`}>
                      Siguranță: {report.score}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/60 text-[10px] space-y-2 text-zinc-450 font-mono">
                    <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span>Cartea Funciară:</span>
                      <span className="text-zinc-350">{report.cadastruStatus}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span>Ipoteci active:</span>
                      <span className={report.safetyLevel === "low" ? "text-red-400 font-bold" : "text-zinc-350"}>
                        {report.ipoteci}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Litigii active:</span>
                      <span className={report.safetyLevel === "low" ? "text-red-400 font-bold" : "text-zinc-350"}>
                        {report.litigii}
                      </span>
                    </div>
                  </div>

                  <p className={`text-[10.5px] leading-relaxed p-3.5 rounded-xl border ${
                    report.safetyLevel === "high"
                      ? "border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-450"
                      : "border-red-500/20 bg-red-500/[0.02] text-red-450 font-semibold"
                  }`}>
                    {report.recommendation}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-7 space-y-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <h3 className="text-lg font-light text-white">Informații Risc</h3>
            <ul className="space-y-3">
              {[
                "1 din 5 proprietăți din România are cel puțin o problemă de cadastru",
                "15% din tranzacțiile eșuate implică vicii juridice nedeclarate",
                "Ipotecile nesalvate reprezintă o cauză principală a litigiilor active",
              ].map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-xs">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                  <p className="text-zinc-300">{fact}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Red flags list */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-light text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Semnale de alarmă (Red Flags)
          </h2>
          <p className="text-xs text-zinc-500">Dacă întâlnești aceste situații, oprește-te înainte de plata avansului.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RED_FLAGS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <h3 className="text-xs font-semibold text-red-300">{f.title}</h3>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Checklist */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-light text-white">Ce acoperă auditul AntiȚeapă</h2>
          <p className="text-xs text-zinc-500">Verificăm registre active și detalii cadastrale fizice.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHECKS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className={`rounded-2xl border ${designSystem.borderMuted} bg-zinc-950/40 p-5 space-y-3`}>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-450">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-white">{c.title}</h3>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
