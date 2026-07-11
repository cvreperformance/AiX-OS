"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  Building,
  TrendingUp,
  Shield,
  Activity,
  ArrowRight,
  RefreshCw,
  Zap,
  Check
} from "lucide-react";

export default function PropertyScannerPage() {
  const { language } = useLanguage();
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const scanProgressSteps = language === "ro" ? [
    "Interogare baze de date cadastrale ANCPI...",
    "Verificare istoric proprietari și titluri active...",
    "Analiză rețea drum de servitute și plan urbanistic (PUG)...",
    "Evaluare sarcini active, ipoteci și litigii în curs...",
    "Compilare AiX Score™ bazat pe 12 coordonate macro..."
  ] : [
    "Querying state ANCPI cadastral archives...",
    "Scanning owner histories and active title deeds...",
    "Auditing easement road access & zoning laws (PUG)...",
    "Verifying bank mortgages & active litigation logs...",
    "Synthesizing weighted AiX Score™ variables..."
  ];

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !description.trim()) return;

    setScanning(true);
    setScanStep(0);
    setShowResult(false);

    // Simulate scanning pipeline
    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanProgressSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setScanning(false);
            setShowResult(true);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-12 animate-in text-left">
      <PageHeader
        badge="AI Operating System Module"
        title="AI Property Scanner"
        subtitle={
          language === "ro"
            ? "Introdu adresa URL a unui anunț imobiliar sau descrierea acestuia pentru a genera instant un audit de risc, randament și calculul AiX Score™."
            : "Input any property listing URL or detailed information to audit cadastral risks, compute yields, and compile its AiX Score™."
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Input Card */}
        <div className={`lg:col-span-5 p-6 rounded-3xl ${designSystem.glass} space-y-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Search className="h-4.5 w-4.5 text-amber-500" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              {language === "ro" ? "Parametri Scanare" : "Scanner Inputs"}
            </h3>
          </div>

          <form onSubmit={handleScanSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                {language === "ro" ? "Adresă URL Anunț (Imobiliare.ro, Storia, etc.)" : "Listing URL (Storia, etc.)"}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.imobiliare.ro/vanzare-apartamente/..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-650 focus:border-amber-500/40 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                {language === "ro" ? "Informații Suplimentare / Text Anunț" : "Property Details / Plain Text"}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={
                  language === "ro"
                    ? "Apartament 3 camere, 85 mp, etaj 3, Pipera, finisaje premium..."
                    : "Penthouse apartment, 120 sqm, 5th floor, Floreasca, net yields estimated at..."
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-650 focus:border-amber-500/40 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={scanning || (!url.trim() && !description.trim())}
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-amber-500/10"
            >
              {scanning ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>{language === "ro" ? "Se Auditează..." : "Auditing..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>{language === "ro" ? "Lansează Audit AI" : "Run AI Scan"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Diagnostic Scanning Output / Results Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Default state */}
          {!scanning && !showResult && (
            <div className={`p-8 rounded-3xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-xl text-center space-y-4`}>
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500 border border-zinc-850">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  {language === "ro" ? "Sandbox Audit Inactiv" : "Audit Sandbox Idle"}
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  {language === "ro"
                    ? "Completează datele din stânga pentru a activa motorul de conformitate cadastrală."
                    : "Fill in the coordinates on the left to trigger our automated compliance engine."}
                </p>
              </div>
            </div>
          )}

          {/* Scanning Live State */}
          {scanning && (
            <div className={`p-8 rounded-3xl border border-amber-500/20 bg-zinc-950/40 backdrop-blur-xl text-left space-y-6`}>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-amber-500 animate-spin" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {language === "ro" ? "Audit Imobiliar în Desfășurare" : "AI Property Audit Running"}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">COMPLIANCE SIMULATION ACTIVE</p>
                </div>
              </div>

              {/* Progress Steps Feed */}
              <div className="space-y-2 font-mono text-xs">
                {scanProgressSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 py-1.5 transition-opacity duration-300 ${
                      idx < scanStep ? "text-emerald-400 opacity-100" :
                      idx === scanStep ? "text-amber-400 opacity-100 animate-pulse" :
                      "text-zinc-650 opacity-40"
                    }`}
                  >
                    {idx < scanStep ? (
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : idx === scanStep ? (
                      <Activity className="h-4 w-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-800 shrink-0 ml-1.5 mr-1" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show Diagnostic Report */}
          {showResult && (
            <div className="space-y-6">
              
              {/* Report Header Card */}
              <div className={`p-6 sm:p-8 rounded-3xl border border-zinc-850 bg-[#080808]/85 backdrop-blur-xl relative overflow-hidden space-y-6`}>
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/[0.02] blur-3xl pointer-events-none rounded-full" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/25">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">AiX Verified Audit Report</h3>
                        <span className="text-[8px] font-bold font-mono px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">PASSED</span>
                      </div>
                      <p className="text-[10px] text-zinc-550 font-mono mt-0.5">ID: SCAN-8422A6 • July 2026</p>
                    </div>
                  </div>
                  
                  {/* Premium Seal Badge */}
                  <div className="flex items-center gap-1.5 border border-amber-500/35 bg-amber-500/5 rounded-xl px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-400 font-mono shrink-0">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>AiX VERIFIED PROPERTY™</span>
                  </div>
                </div>

                {/* Score visualization dials */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Circular Dial Column */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border border-zinc-900 rounded-2xl bg-zinc-950/40">
                    <div className="relative h-24 w-24">
                      {/* Circle Gauge SVG */}
                      <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#18181b" strokeWidth="2.5" />
                        <circle
                          cx="18" cy="18" r="16" fill="none"
                          stroke="url(#dial-grad)"
                          strokeWidth="2.5"
                          strokeDasharray="92 100"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="dial-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#fbbf24" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-light text-white font-mono leading-none">9.2</span>
                        <span className="text-[9px] text-zinc-550 font-mono">/ 10</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-wider mt-3">AiX SCORE™</span>
                    <span className="text-[9px] text-zinc-550 mt-1 uppercase font-bold text-emerald-400 tracking-wider">STRONG OPPORTUNITY</span>
                  </div>

                  {/* Sub-scores bars */}
                  <div className="md:col-span-8 space-y-3 text-xs">
                    {[
                      { label: language === "ro" ? "Scor Investiție" : "Investment Score", val: 92, status: "Low Risk" },
                      { label: language === "ro" ? "Scor Locație" : "Location Score", val: 95, status: "AAA Grade" },
                      { label: language === "ro" ? "Potențial Creștere" : "Growth Potential", val: 89, status: "High Growth" },
                      { label: language === "ro" ? "Nivel Risc" : "Risk Index", val: 15, status: "Low", isRisk: true }
                    ].map((sub, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                          <span>{sub.label}</span>
                          <span className="font-mono text-white">{sub.isRisk ? sub.status : `${sub.val}/100`}</span>
                        </div>
                        {/* Bar */}
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.isRisk ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${sub.isRisk ? 100 - sub.val : sub.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Checklist Verification Seals */}
                <div className="border-t border-zinc-900 pt-5 space-y-3">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 font-mono">AiX Verified™ Certification Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-[10.5px]">
                    {[
                      { label: language === "ro" ? "Analiză Locație" : "Location Audit", valid: true },
                      { label: language === "ro" ? "Evaluare Piață" : "Market Spread", valid: true },
                      { label: language === "ro" ? "Audit Cadastru" : "Documentation OK", valid: true },
                      { label: language === "ro" ? "Randament ROI" : "Yield Verified", valid: true },
                      { label: language === "ro" ? "Evaluare AI" : "AI Core Rating", valid: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 p-2 rounded-xl bg-zinc-950/50 border border-zinc-900">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="text-zinc-350 truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Text Verdict summary */}
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900 text-xs text-zinc-400 leading-relaxed italic border-l-4 border-l-emerald-500">
                  <Sparkles className="h-4 w-4 text-amber-500 mb-1.5" />
                  <p>
                    {language === "ro"
                      ? "AI Verdict: Activele corelate din această sub-zonă indică o discrepanță de preț subevaluată cu 8% față de benchmark-ul general de vânzări. Titlurile sunt libere de sarcini, iar accesul la drumul public este securizat structural. Recomandare: STRONG BUY."
                      : "AI Verdict: Comparable transactions in this sub-sector index indicate an undervalued pricing discrepancy of 8% below generic sales benchmarks. Deeds are free of passive liabilities, and easement access routes are structurally secured. Recommendation: STRONG BUY."}
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
