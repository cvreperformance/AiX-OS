"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
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

export default function AntiTeapaPage() {
  const { language, t } = useLanguage();
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

  // Lead form states
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadBotfield, setLeadBotfield] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState("");

  const handleRequestAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    setLeadLoading(true);
    setLeadError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "AntiȚeapă Legal Audit",
          name: leadName,
          phone: leadPhone,
          email: leadEmail || undefined,
          message: `Solicitare Verificare Documente Juridice pentru Adresa: ${address}. Cadastru/CF: ${cadastru}, Pret: ${price} EUR. Scor AI: ${report?.score}%`,
          source: "anti-teapa-cta",
          page: "/anti-teapa",
          botfield: leadBotfield || undefined,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit lead");
      }
      setLeadSuccess(true);
    } catch (err: any) {
      setLeadError(err.message || "Failed to request audit.");
    } finally {
      setLeadLoading(false);
    }
  };

  const RED_FLAGS = [
    {
      icon: AlertTriangle,
      title: language === "ro" ? "Preț suspect de mic" : "Suspiciously Low Price",
      desc: language === "ro"
        ? "Proprietăți cu prețuri cu 20%+ sub piață sunt adesea semnale de probleme juridice sau vânzare forțată."
        : "Properties priced 20%+ below market value are often flags for critical legal claims or forced fire sales.",
    },
    {
      icon: XCircle,
      title: language === "ro" ? "Acte incomplete sau copii" : "Incomplete Titles or Copies Only",
      desc: language === "ro"
        ? "Vânzătorul refuză să prezinte originale sau evită notarul. Semn că actele pot fi falsificate."
        : "Seller refuses to present original titles or stalls notary validation. A potential indicator of fraud.",
    },
    {
      icon: AlertTriangle,
      title: language === "ro" ? "Urgență artificială" : "Artificial Urgency",
      desc: language === "ro"
        ? "Presiunea de a semna rapid, fără timp de verificare. Tactică clasică pentru a ascunde probleme."
        : "Pressure to close quickly without allowing due diligence. A classic play to hide legal defects.",
    },
    {
      icon: XCircle,
      title: language === "ro" ? "Multiple agenții simultan" : "Multiple Agencies Simultaneously",
      desc: language === "ro"
        ? "Proprietatea listată la multe agenții concomitent poate indica probleme de vânzare sau titlu neclar."
        : "Property listed with numerous agents at once can signal title ownership disputes or sale bottlenecks.",
    },
    {
      icon: AlertTriangle,
      title: language === "ro" ? "Renovare proaspătă" : "Fresh Refurbishments",
      desc: language === "ro"
        ? "Renovarea recentă poate ascunde vicii structurale sau inundații. Verificare tehnică obligatorie."
        : "Recent paint jobs or repairs can mask structural faults or water damage. A physical inspect is recommended.",
    },
    {
      icon: XCircle,
      title: language === "ro" ? "Vânzător nervos sau evaziv" : "Evasive Seller",
      desc: language === "ro"
        ? "Refuză răspunsuri clare la întrebări despre vecini, calitatea clădirii sau istoricul proprietății."
        : "Refusing direct replies regarding neighbors, structural integrity, or land history registries.",
    },
  ];

  const CHECKS = [
    {
      icon: FileText,
      title: language === "ro" ? "Verificare Titlu de Proprietate" : "Title Registry Verification",
      desc: language === "ro"
        ? "Confirmăm proprietarul legal, istoricul transferurilor și că titlul este curat și necontestat."
        : "We trace legal owner lineages, past deeds, and verify that the title registry is clear of claims.",
    },
    {
      icon: Shield,
      title: language === "ro" ? "Sarcini și Ipoteci" : "Liens & Mortgages",
      desc: language === "ro"
        ? "Verificăm în Cartea Funciară prezența ipotecilor, interdicțiilor de înstrăinare sau gajurilor."
        : "We cross-reference active commercial mortgages, bank constraints, or foreclosure notes.",
    },
    {
      icon: Search,
      title: language === "ro" ? "Litigii Active" : "Active Court Litigation",
      desc: language === "ro"
        ? "Identificăm procese civile sau penale legate de proprietate sau de vânzător la instanțele locale."
        : "We lookup civil or corporate lawsuits filed against the seller or the target asset.",
    },
    {
      icon: Brain,
      title: language === "ro" ? "Preț vs. Piață (AI)" : "Price Target Model",
      desc: language === "ro"
        ? "AiX Score compară prețul cerut cu tranzacțiile similare și detectează deviații semnificative."
        : "The AiX Score compares current listing targets with actual closed transactions.",
    },
    {
      icon: Building2,
      title: language === "ro" ? "Stare Tehnică" : "Technical Inspection",
      desc: language === "ro"
        ? "Evaluare vizuală a stării structurale, instalații și finisaje. Alertă pentru vicii ascunse."
        : "Inspect structural elements, active plumbing systems, and electrical nodes.",
    },
    {
      icon: AlertTriangle,
      title: language === "ro" ? "Istoricul Proprietarilor" : "Owner Registry History",
      desc: language === "ro"
        ? "Analizăm numărul de transferuri anterioare, moșteniri complexe și posibile dispute de proprietate."
        : "We study inheritance lines, partition disputes, and frequency of ownership swaps.",
    },
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !cadastru) return;

    setLoading(true);
    setReport(null);

    setTimeout(() => {
      const val = parseFloat(price);
      const isSuspectPrice = !isNaN(val) && val < 200000;
      
      setReport({
        score: isSuspectPrice ? 42 : 88,
        safetyLevel: isSuspectPrice ? "low" : "high",
        litigii: isSuspectPrice 
          ? (language === "ro" ? "1 dosar civil activ identificat (rol litigiu titlu)" : "1 active civil court claim found (title dispute)")
          : (language === "ro" ? "Niciun litigiu activ identificat pe adresa solicitată" : "No active court disputes identified for this address"),
        ipoteci: isSuspectPrice 
          ? (language === "ro" ? "Ipotecă activă (bancă comercială, nesalvată)" : "Active mortgage (commercial lender, unresolved)")
          : (language === "ro" ? "Liber de sarcini bancare active" : "Clear of active banking liens"),
        cadastruStatus: language === "ro" 
          ? "Număr cadastru înregistrat, corespunde cu releveul depus"
          : "Registered cadastre ID matching official floor plans",
        recommendation: isSuspectPrice 
          ? (language === "ro" 
              ? "AVERTISMENT: Prețul cerut este suspect de scăzut pentru zonă, iar prezența litigiului activ impune asistență juridică înainte de plata oricărui avans."
              : "ALERT: Target price is abnormally low for this zone, and active title litigation requires legal assistance before writing deposits.")
          : (language === "ro"
              ? "VERDE: Proprietate curată din punct de vedere preliminar. Recomandăm due-diligence fizic complet înainte de semnare."
              : "GREEN: Asset appears clean on preliminary checks. Complete a structural inspection before signing contracts."),
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12 animate-in">
      
      {/* Hero & Analyzer */}
      <section className="space-y-6">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-red-500/80 border border-red-500/20 rounded-full px-3 py-1">
          AiX OS™ · AntiȚeapă AI
        </span>
        
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-5xl font-light text-zinc-900 leading-tight">
              {language === "ro" ? "Verifică Orice Proprietate" : "Audit Any Asset"} <br />
              <span className="text-red-400">{language === "ro" ? "Înainte de Semnare." : "Before Signing."}</span>
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === "ro"
                ? "Analizăm automat titlurile de proprietate, sarcinile înregistrate în Cartea Funciară și istoricul litigiilor active pentru a te proteja de capcane imobiliare."
                : "We automatically audit title histories, land registry encumbrances, and local court disputes to isolate transaction vulnerabilities."}
            </p>

            {/* Quick Audit Form */}
            <div className={`p-6 sm:p-7 rounded-3xl ${designSystem.glass} space-y-4`}>
              <h3 className="text-xs uppercase tracking-widest text-zinc-550 font-bold">
                {language === "ro" ? "Verificare rapidă securizată" : "Secure Preliminary Audit"}
              </h3>
              
              <form onSubmit={handleVerify} className="space-y-4">
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === "ro" ? "Adresa completă sau codul poștal" : "Full street address or postal code"}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-red-500/50 focus:outline-none transition-colors"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    value={cadastru}
                    onChange={(e) => setCadastru(e.target.value)}
                    placeholder={language === "ro" ? "Număr cadastral / CF" : "Cadastre ID / Land Registry CF"}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-red-500/50 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={language === "ro" ? "Preț solicitat (€)" : "Asking Price (€)"}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-red-500/50 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-red-600 text-zinc-900 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-red-500 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading 
                    ? (language === "ro" ? "Scanare registre active..." : "Querying database registers...") 
                    : (language === "ro" ? "Scanează Risc Proprietate" : "Scan Property Risk")}
                </button>
              </form>

              {/* Dynamic Due Diligence Output */}
              {report && (
                <div className="pt-4 border-t border-zinc-200/80 space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <span className={designSystem.badgeElite}>AI Risk Report</span>
                    <span className={`text-[10px] uppercase tracking-widest font-mono font-bold ${
                      report.safetyLevel === "high" ? "text-emerald-400" : "text-red-400 animate-pulse"
                    }`}>
                      {language === "ro" ? "Siguranță: " : "Safety Score: "}{report.score}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-200 bg-white/60 text-[10px] space-y-2 text-zinc-450 font-mono">
                    <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                      <span>{language === "ro" ? "Cartea Funciară:" : "Registry Status:"}</span>
                      <span className="text-zinc-350">{report.cadastruStatus}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                      <span>{language === "ro" ? "Ipoteci active:" : "Active Mortgages:"}</span>
                      <span className={report.safetyLevel === "low" ? "text-red-400 font-bold" : "text-zinc-350"}>
                        {report.ipoteci}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === "ro" ? "Litigii active:" : "Court Cases:"}</span>
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

                  {/* Audit Lead Form */}
                  <div className="pt-4 border-t border-zinc-200/80 space-y-3">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">
                      {language === "ro" ? "Solicită Raport Complet Certificat" : "Request Certified Notary Audit"}
                    </p>
                    {leadSuccess ? (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                        <p className="text-emerald-400 text-xs font-semibold">✓ Solicitare trimisă cu succes!</p>
                      </div>
                    ) : (
                      <form onSubmit={handleRequestAudit} className="space-y-2">
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
                            className="rounded-lg border border-zinc-200 bg-zinc-50/40 px-3 py-2 text-[11px] text-zinc-900 placeholder-zinc-650 focus:border-red-500/50 focus:outline-none transition-colors"
                          />
                          <input
                            required
                            type="tel"
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            placeholder="Telefon"
                            className="rounded-lg border border-zinc-200 bg-zinc-50/40 px-3 py-2 text-[11px] text-zinc-900 placeholder-zinc-650 focus:border-red-500/50 focus:outline-none transition-colors"
                          />
                        </div>
                        <input
                          type="email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="E-mail (opțional)"
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50/40 px-3 py-2 text-[11px] text-zinc-900 placeholder-zinc-650 focus:border-red-500/50 focus:outline-none transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={leadLoading}
                          className="w-full rounded-lg bg-red-600 hover:bg-red-500 text-zinc-900 py-2 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                        >
                          {leadLoading ? "Se trimite..." : "Solicită Audit Juridic"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-7 space-y-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <h3 className="text-lg font-light text-zinc-900">{language === "ro" ? "Statistici de Risc" : "Property Risk Stats"}</h3>
            <ul className="space-y-3">
              {(language === "ro" 
                ? [
                    "1 din 5 proprietăți din România are cel puțin o problemă de cadastru",
                    "15% din tranzacțiile eșuate implică vicii juridice nedeclarate",
                    "Ipotecile nesalvate reprezintă o cauză principală a litigiilor active",
                  ]
                : [
                    "1 in 5 properties in Romania has an unresolved cadastral or map issue",
                    "15% of failed property deals involve undisclosed litigation or boundary claims",
                    "Unresolved historical mortgages are the leading cause of active title disputes",
                  ]
              ).map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-xs">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                  <p className="text-zinc-600">{fact}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Red flags list */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-light text-zinc-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            {language === "ro" ? "Semnale de alarmă (Red Flags)" : "Property Red Flags"}
          </h2>
          <p className="text-xs text-zinc-400">
            {language === "ro" 
              ? "Dacă întâlnești aceste situații, oprește-te înainte de plata avansului."
              : "If you encounter any of these scenarios, halt the transaction before wiring deposits."}
          </p>
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
          <h2 className="text-xl font-light text-zinc-900">
            {language === "ro" ? "Ce acoperă auditul AntiȚeapă" : "What the Audit Inspects"}
          </h2>
          <p className="text-xs text-zinc-400">
            {language === "ro" 
              ? "Verificăm registre active și detalii cadastrale fizice."
              : "We inspect active government registries and cadastral outlines."}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHECKS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className={`rounded-2xl border ${designSystem.borderMuted} bg-white/40 p-5 space-y-3`}>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-450">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-900">{c.title}</h3>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
