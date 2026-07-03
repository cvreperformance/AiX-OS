"use client";

import { useState } from "react";
import {
  FileText,
  FileCheck,
  Percent,
  RefreshCw,
  QrCode,
  Download,
  Building,
  Activity,
  ArrowRight,
  TrendingUp,
  Cpu,
  Coins,
  Scale,
  Shield,
  Binary,
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

export default function ConveniencePage() {
  // QR Generator state
  const [qrText, setQrText] = useState("https://aixos.ro");
  const [qrUrl, setQrUrl] = useState(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://aixos.ro")}`);

  // Currency Converter state
  const [fromCurr, setFromCurr] = useState("EUR");
  const [toCurr, setToCurr] = useState("RON");
  const [amount, setAmount] = useState("1000");
  const [converted, setConverted] = useState<number>(4976.8);

  // Unit Converter state
  const [sqm, setSqm] = useState("100");
  const [sqft, setSqft] = useState("1076.39");

  // QR handle change
  const generateQR = () => {
    if (!qrText.trim()) return;
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`);
  };

  // Convert Currency
  const convertCurrency = () => {
    const val = Number(amount);
    if (isNaN(val)) return;
    
    // Rates (simulated but in sync with BNR indicators)
    const rates: Record<string, number> = {
      "EUR-RON": 4.9768,
      "RON-EUR": 1 / 4.9768,
      "USD-RON": 4.5820,
      "RON-USD": 1 / 4.5820,
      "EUR-USD": 1.0850,
      "USD-EUR": 1 / 1.0850,
    };

    const key = `${fromCurr}-${toCurr}`;
    if (rates[key]) {
      setConverted(val * rates[key]);
    } else if (fromCurr === toCurr) {
      setConverted(val);
    } else {
      // Cross-rates
      const toRON = fromCurr === "EUR" ? 4.9768 : fromCurr === "USD" ? 4.5820 : 1;
      const fromRON = toCurr === "EUR" ? 1 / 4.9768 : toCurr === "USD" ? 1 / 4.5820 : 1;
      setConverted(val * toRON * fromRON);
    }
  };

  // Convert sqm <-> sqft
  const handleSqmChange = (val: string) => {
    setSqm(val);
    const num = Number(val);
    if (!isNaN(num)) {
      setSqft((num * 10.7639).toFixed(2));
    }
  };

  const handleSqftChange = (val: string) => {
    setSqft(val);
    const num = Number(val);
    if (!isNaN(num)) {
      setSqm((num / 10.7639).toFixed(2));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Daily Workspace"
        title="Convenience Tools Hub"
        subtitle="Utilitare rapide pentru activitatea de zi cu zi. Convertoare, generatoare și instrumente digitale gata de utilizat direct din browser."
      />

      {/* Grid: Converter & Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* QR Code Generator */}
        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} relative overflow-hidden flex flex-col justify-between`}>
          <div className={designSystem.glowTop} />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <QrCode className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-zinc-400">QR Generator</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Generează Cod QR instant</h3>
            <p className="text-xs text-zinc-450 leading-relaxed">
              Introduceți o legătură URL sau un text pentru a genera un cod QR descărcabil imediat pentru prezentări sau broșuri imobiliare.
            </p>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://aixos.ro"
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none"
              />
              <button
                onClick={generateQR}
                className="rounded-xl bg-amber-500 text-black px-4 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all active:scale-95 shrink-0"
              >
                Generează
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="Cod QR Generat"
              className="w-36 h-36 rounded-xl border border-zinc-850 p-2 bg-white"
            />
            <div className="space-y-3 text-center sm:text-left">
              <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
                Codul QR este pregătit. Scanați-l cu camera telefonului sau descărcați fișierul PNG de înaltă rezoluție.
              </p>
              <a
                href={qrUrl}
                download="aix-qr-code.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white px-3.5 py-2 text-[10px] uppercase tracking-wider font-semibold transition-all active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                Deschide PNG
              </a>
            </div>
          </div>
        </div>

        {/* Currency & Unit Converter */}
        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} relative overflow-hidden flex flex-col justify-between`}>
          <div className={designSystem.glowTop} />
          
          <div className="space-y-6">
            {/* Currency Converter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Coins className="h-4.5 w-4.5 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-zinc-400">Convertor Valutar</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Schimb Valutar de Referință</h3>

              <div className="grid grid-cols-3 gap-2 items-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
                
                <div className="flex gap-1 justify-center">
                  <select
                    value={fromCurr}
                    onChange={(e) => setFromCurr(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 p-1.5 focus:outline-none"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="RON">RON</option>
                  </select>
                  <span className="text-zinc-650 self-center text-xs">→</span>
                  <select
                    value={toCurr}
                    onChange={(e) => setToCurr(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 p-1.5 focus:outline-none"
                  >
                    <option value="RON">RON</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <button
                  onClick={convertCurrency}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-3 py-2 text-xs text-zinc-300 hover:text-white transition-all font-semibold active:scale-95"
                >
                  Convertește
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/60 flex justify-between items-center text-xs">
                <span className="text-zinc-500">Valoare Convertită:</span>
                <span className="font-bold text-white font-mono">{converted.toFixed(2)} {toCurr}</span>
              </div>
            </div>

            {/* Unit Converter */}
            <div className="space-y-3 pt-4 border-t border-zinc-900/60">
              <div className="flex items-center gap-2 text-zinc-500">
                <Scale className="h-4.5 w-4.5 text-sky-400" />
                <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-zinc-400">Convertor Unități</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Suprafețe Imobiliare (m² ↔ sq ft)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-550 font-semibold font-mono">Metri Pătrați (m²)</label>
                  <input
                    type="number"
                    value={sqm}
                    onChange={(e) => handleSqmChange(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-550 font-semibold font-mono">Square Feet (sq ft)</label>
                  <input
                    type="number"
                    value={sqft}
                    onChange={(e) => handleSqftChange(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* PDF & File Tools Section */}
      <section className="space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Document Services</span>
          <h2 className="text-2xl font-light text-white mt-1">Management Documente & Fișiere</h2>
          <p className="text-xs text-zinc-500 mt-1">Soluții rapide de prelucrare documente în fluxurile de tranzacții.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "PDF Merge", desc: "Unește mai multe fișiere sau extrase de Carte Funciară într-un singur document.", action: "Pregătește fișierele" },
            { label: "PDF Split", desc: "Separă paginile dintr-un contract complex sau dosar cadastral stufos.", action: "Pregătește fișierele" },
            { label: "PDF Compress", desc: "Optimizează mărimea fișierelor pentru a fi trimise ușor prin email sau WhatsApp.", action: "Încarcă documentul" },
            { label: "Semnătură Digitală", desc: "Adaugă o semnătură digitală simplă direct din browser pe documentele tale.", action: "Semnează PDF" },
          ].map((tool, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[160px]`}
            >
              <div className="space-y-2">
                <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <FileText className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">{tool.label}</h4>
                <p className="text-[10.5px] text-zinc-500 leading-relaxed">{tool.desc}</p>
              </div>
              
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
                className="w-full text-center mt-4 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-400 rounded-lg py-2 text-[9px] uppercase tracking-wider font-mono font-semibold transition-all active:scale-98"
              >
                {tool.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Convenience CTA */}
      <section>
        <div className={`p-8 sm:p-10 rounded-3xl border border-amber-500/20 bg-[#080808]/70 backdrop-blur-xl text-center space-y-4 relative overflow-hidden`}>
          <div className="absolute -right-20 -top-20 w-44 h-44 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
          <Cpu className="h-7 w-7 text-amber-500/40 mx-auto" />
          <div>
            <h2 className="text-xl sm:text-2xl font-light text-white">Ai nevoie de calculatoare financiare?</h2>
            <p className="text-xs text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
              Calculează ratele ipotecare, return on investment (ROI), randamentul din chirii sau taxele notariale specifice direct din modulul nostru financiar.
            </p>
          </div>
          <a
            href="/calculators"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 active:scale-95"
          >
            Accesează Calculatoare Financiare
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
