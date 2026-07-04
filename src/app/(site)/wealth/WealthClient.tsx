"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Landmark,
  Activity,
  Calculator,
  Calendar,
  Briefcase,
  Coins,
  DollarSign,
  ArrowRight,
  TrendingUp as TrendUpIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/format";

interface MarketItem {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  desc: string;
}

export default function WealthClient() {
  const { language, t } = useLanguage();
  const [marketData, setMarketData] = useState<any>(null);

  // Portfolio interactive allocation sliders
  const [allocation, setAllocation] = useState({
    realEstate: 40,
    equities: 30,
    metals: 10,
    crypto: 10,
    cash: 10,
  });

  const handleSliderChange = (key: keyof typeof allocation, value: number) => {
    setAllocation((prev) => {
      const updated = { ...prev, [key]: value };
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      
      // Auto adjust other values to ensure total is exactly 100%
      if (total !== 100) {
        const factor = (100 - value) / (100 - prev[key]);
        const keys = Object.keys(updated) as Array<keyof typeof allocation>;
        keys.forEach((k) => {
          if (k !== key) {
            updated[k] = Math.max(0, Math.round(prev[k] * factor));
          }
        });
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/market");
        if (res.ok) {
          const json = await res.json();
          setMarketData(json);
        }
      } catch (e) {
        console.warn("[AiX Wealth Page] Failed loading live market data", e);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 40000);
    return () => clearInterval(interval);
  }, []);

  const totalAlloc = Object.values(allocation).reduce((a, b) => a + b, 0);

  // SVG parameters for allocations circle
  let strokeAccumulator = 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const allocationTypes = [
    { key: "realEstate" as const, label: language === "ro" ? "Imobiliare" : "Real Estate", color: "stroke-blue-400", bg: "bg-blue-400" },
    { key: "equities" as const, label: language === "ro" ? "Acțiuni / ETF" : "Equities & ETFs", color: "stroke-violet-400", bg: "bg-violet-400" },
    { key: "metals" as const, label: language === "ro" ? "Metale (Aur/Argint)" : "Metals (Gold/Silver)", color: "stroke-amber-400", bg: "bg-amber-400" },
    { key: "crypto" as const, label: language === "ro" ? "Cripto-active" : "Cryptocurrency", color: "stroke-rose-400", bg: "bg-rose-400" },
    { key: "cash" as const, label: language === "ro" ? "Lichidități (Cash)" : "Cash & Treasury", color: "stroke-teal-400", bg: "bg-teal-400" },
  ];

  const calendarEvents = [
    { date: "15 Iul 2026", event: language === "ro" ? "Ședință Politică Monetară BNR" : "BNR Monetary Policy Meeting", desc: language === "ro" ? "Decizie referitoare la dobânda de referință în România." : "Decision on standard interest rates in Romania." },
    { date: "24 Iul 2026", event: language === "ro" ? "Publicare Indice Inflație (INS)" : "INS Inflation CPI Report", desc: language === "ro" ? "Raportul oficial pe luna iunie referitor la consumatori." : "Official report for June consumer pricing metrics." },
    { date: "30 Iul 2026", event: language === "ro" ? "Decizie Rată Dobândă Fed (SUA)" : "Fed Funds Interest Decision", desc: language === "ro" ? "Rezerva Federală publică noul coridor al ratelor de dobândă." : "Federal Reserve announces updated base rate window." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          {language === "ro" ? "AiX OS · Managementul Portofoliului" : "AiX OS · Portfolio Manager"}
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
          {language === "ro" ? "Private Wealth Desk &" : "Private Wealth Desk &"} <br />
          <span className="gradient-gold">{language === "ro" ? "Alocator de Active Live" : "Live Asset Allocator"}</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Configurează-ți structura portofoliului, monitorizează indicatorii macroeconomici și urmărește evoluția aurului, a burselor și a lichidităților într-o singură pagină securizată."
            : "Model your portfolio distribution, track macroeconomic benchmarks, and monitor real-time pricing of gold, stocks, and crypto."}
        </p>
      </section>

      {/* Asset Allocator Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sliders Card */}
        <div className={`lg:col-span-2 rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Calculator className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-light text-white">{language === "ro" ? "Modelator Alocare Active" : "Asset Allocation Modeler"}</h2>
              <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">{language === "ro" ? "Simulare structură capital" : "Capital Structure Simulation"}</p>
            </div>
          </div>

          <div className="space-y-6">
            {allocationTypes.map(({ key, label, bg }) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-2 text-zinc-300 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${bg}`} />
                    {label}
                  </span>
                  <span className="font-mono font-bold text-white">{allocation[key]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation[key]}
                  onChange={(e) => handleSliderChange(key, parseInt(e.target.value) || 0)}
                  className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-900/60 text-xs">
            <span className="text-zinc-550">{language === "ro" ? "Total structură:" : "Total distribution:"}</span>
            <span className={`font-mono font-bold ${totalAlloc === 100 ? "text-emerald-400" : "text-amber-500"}`}>{totalAlloc}%</span>
          </div>
        </div>

        {/* Visual Allocation Graph Card */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col items-center justify-center text-center min-h-[360px]`}>
          <p className="text-xs font-semibold text-white uppercase tracking-wider mb-2">{language === "ro" ? "Diagramă Portofoliu" : "Visual Balance"}</p>
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="fill-transparent stroke-zinc-900/50"
                strokeWidth="10"
              />
              {allocationTypes.map(({ key, color }) => {
                const percent = allocation[key];
                if (percent === 0) return null;
                const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -strokeAccumulator;
                strokeAccumulator += (percent / 100) * circumference;
                return (
                  <circle
                    key={key}
                    cx="60"
                    cy="60"
                    r={radius}
                    className={`fill-transparent ${color} transition-all duration-500`}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-light font-mono text-white">100%</span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-550 font-semibold mt-0.5">{language === "ro" ? "Active" : "Portfolio"}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] mt-4 border-t border-zinc-900/60 pt-4">
            {allocationTypes.map(({ key, label, bg }) => (
              <div key={key} className="flex items-center gap-1.5 justify-start">
                <span className={`w-2 h-2 rounded-full ${bg} flex-shrink-0`} />
                <span className="text-zinc-450 truncate">{label}:</span>
                <span className="font-mono text-white font-semibold ml-auto">{allocation[key]}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Pulse Indicators */}
      <section className="space-y-6">
        <div className="border-b border-zinc-900 pb-3">
          <h2 className="text-lg font-light text-white uppercase tracking-wider">
            {language === "ro" ? "Indicatori Macro & Valutari Live" : "Live Macro & Currency Feeds"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData?.macro?.map((item: MarketItem) => (
            <div key={item.label} className={`p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex justify-between items-center`}>
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-550 uppercase tracking-wider font-mono font-semibold">{item.label}</p>
                <p className="text-xs text-zinc-400 font-medium">{item.desc}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold text-white font-mono">{item.value}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.trend === "up" ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10" : item.trend === "down" ? "text-red-400 bg-red-500/5 border border-red-500/10" : "text-zinc-500"}`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Economic Calendar Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Economic Calendar events list */}
        <div className={`md:col-span-2 rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Calendar className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-light text-white">{language === "ro" ? "Calendar Economic" : "Economic Calendar"}</h2>
              <p className="text-[10px] text-zinc-555 uppercase tracking-widest font-mono">{language === "ro" ? "Date cheie macro" : "Key Macro Releases"}</p>
            </div>
          </div>

          <div className="space-y-4">
            {calendarEvents.map((evt, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-zinc-900 bg-zinc-950/30">
                <div className="flex-shrink-0 text-center w-20 px-2.5 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono leading-none block">{evt.date.split(" ")[1]}</span>
                  <span className="text-lg font-light text-white font-mono block mt-1">{evt.date.split(" ")[0]}</span>
                  <span className="text-[8px] text-zinc-500 uppercase block leading-none mt-1">{evt.date.split(" ")[2]}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">{evt.event}</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wealth Resources list */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <Briefcase className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-light text-white">{language === "ro" ? "Ghidul Investitorului" : "Wealth Resources"}</h2>
              <p className="text-[10px] text-zinc-555 uppercase tracking-widest font-mono">{language === "ro" ? "Checklist-uri active" : "Asset management lists"}</p>
            </div>
          </div>

          <ul className="space-y-4">
            {[
              { label: language === "ro" ? "Planificare Fiscală Română" : "Romanian Fiscal Optimization", desc: language === "ro" ? "Optimizarea impozitelor pe dividende și tranzacții în 2026." : "Tax planning details for local dividend taxation in 2026.", href: "/learning" },
              { label: language === "ro" ? "Calculatoare Randament" : "ROI and Mortgage Calculators", desc: language === "ro" ? "Calculează randamentul net din chirii (Yield) și rate." : "Calculate net rental yields and monthly mortgage amortization.", href: "/calculators" },
              { label: language === "ro" ? "Evaluare Riscuri Proprietăți" : "Real Estate Risk Scanning", desc: language === "ro" ? "Evită litigii, vicii cadastrale și probleme cadastru." : "Avoid court litigations, land registry claims, and cadastre loops.", href: "/anti-teapa" },
            ].map((res, idx) => (
              <li key={idx} className="group border-b border-zinc-900/60 pb-3 last:border-0 last:pb-0">
                <a href={res.href} className="block space-y-1">
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                    {res.label}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-[10px] text-zinc-550 leading-relaxed block">{res.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
