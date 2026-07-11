"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Calculator,
  Compass,
  ArrowRight,
  TrendingUp,
  Shield,
  Activity,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function WealthSimulationPage() {
  const { language } = useLanguage();
  const [step, setStep] = useState<"inputs" | "calculating" | "results">("inputs");
  
  // Input State Variables
  const [capital, setCapital] = useState("500k-2m");
  const [objective, setObjective] = useState("yield");
  const [timeline, setTimeline] = useState("5-10");
  const [preference, setPreference] = useState("luxury");

  const runSimulation = () => {
    setStep("calculating");
    setTimeout(() => {
      setStep("results");
    }, 1500);
  };

  const resetSimulation = () => {
    setStep("inputs");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-12 animate-in text-left">
      <PageHeader
        badge="HNWI Allocation Simulator"
        title="AiX OS™ Future Simulation"
        subtitle={
          language === "ro"
            ? "Simulează strategii imobiliare avansate și alocări de capital conform profilului tău de risc."
            : "Model portfolio allocations and build structured real estate roadmaps matching your liquidity parameters."
        }
      />

      {/* ─── INPUTS STATE ────────────────────────────────────────────────── */}
      {step === "inputs" && (
        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} space-y-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.01] blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Calculator className="h-4.5 w-4.5 text-amber-500" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Consultation Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400">
            
            {/* Capital Select */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-500">Capital Size (€)</label>
              <select
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2.5 text-xs text-white focus:border-amber-500/40 focus:outline-none"
              >
                <option value="200k-500k">200.000 € — 500.000 €</option>
                <option value="500k-2m">500.000 € — 2.000.000 €</option>
                <option value="2m-10m">2.000.000 € — 10.000.000 €</option>
                <option value="10m+">10.000.000 € +</option>
              </select>
            </div>

            {/* Core Objective */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-500">Core Objective</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2.5 text-xs text-white focus:border-amber-500/40 focus:outline-none"
              >
                <option value="yield">Yield Optimization (Rent ROI)</option>
                <option value="capital">Capital Preservation (Safe Haven)</option>
                <option value="growth">Speculative Development (Flip/Off-plan)</option>
                <option value="relocation">Global Residency / Relocation</option>
              </select>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-500">Timeline (Years)</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2.5 text-xs text-white focus:border-amber-500/40 focus:outline-none"
              >
                <option value="1-3">1 — 3 Years</option>
                <option value="3-5">3 — 5 Years</option>
                <option value="5-10">5 — 10 Years</option>
                <option value="10+">10+ Years</option>
              </select>
            </div>

            {/* Preference */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-500">Asset Class Preference</label>
              <select
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2.5 text-xs text-white focus:border-amber-500/40 focus:outline-none"
              >
                <option value="luxury">Luxury Physical Residential</option>
                <option value="commercial">Commercial Yield Portfolios</option>
                <option value="land">Strategic Land Banking plots</option>
                <option value="offshore">Offshore Development Funds</option>
              </select>
            </div>

          </div>

          <div className="pt-4 border-t border-zinc-900">
            <button
              onClick={runSimulation}
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>Simulate Portfolio Allocation</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── LOADING STATE ───────────────────────────────────────────────── */}
      {step === "calculating" && (
        <div className={`p-12 rounded-3xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-xl text-center space-y-6`}>
          <RefreshCw className="h-10 w-10 text-amber-500 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Running Strategic Algorithms</h3>
            <p className="text-xs text-zinc-500 font-mono">ESTIMATING DYNAMIC ALLOCATIONS</p>
          </div>
        </div>
      )}

      {/* ─── RESULTS STATE ───────────────────────────────────────────────── */}
      {step === "results" && (
        <div className="space-y-6">
          
          {/* Main Results Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border border-zinc-850 bg-[#080808]/85 backdrop-blur-xl relative overflow-hidden space-y-6`}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/[0.02] blur-3xl pointer-events-none rounded-full" />

            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Simulation Output Report</h3>
                <p className="text-[10px] text-zinc-550 font-mono mt-0.5">STRATEGY CODE: STRAT-ALPHA-CORE</p>
              </div>
              <button
                onClick={resetSimulation}
                className="text-[10px] uppercase font-mono font-bold text-amber-500 hover:underline cursor-pointer"
              >
                Re-simulate &rarr;
              </button>
            </div>

            {/* Asset Allocation Breakdown */}
            <div className="space-y-4">
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Suggested Allocation Spread</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                {[
                  { label: "Luxury Units (RO Core)", val: "40%", color: "border-sky-500/25 bg-sky-500/5 text-sky-400" },
                  { label: "Offshore Funds", val: "30%", color: "border-amber-500/25 bg-amber-500/5 text-amber-400" },
                  { label: "Speculative Plots", val: "20%", color: "border-rose-500/25 bg-rose-500/5 text-rose-400" },
                  { label: "Sovereign Cash Reserves", val: "10%", color: "border-zinc-800 bg-zinc-950 text-zinc-400" }
                ].map((alloc, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${alloc.color} space-y-1.5`}>
                    <p className="text-[9px] uppercase tracking-wider text-zinc-550 truncate font-bold">{alloc.label}</p>
                    <p className="text-2xl font-light">{alloc.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Property Roadmap */}
            <div className="space-y-4 border-t border-zinc-900 pt-5">
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Real Estate Roadmap Timeline</h4>
              
              <div className="relative border-l border-zinc-800 ml-3 pl-6 space-y-6 text-xs text-zinc-400 text-left">
                <div className="relative">
                  <div className="absolute -left-[30px] top-0.5 h-3 w-3 rounded-full bg-amber-500" />
                  <p className="font-semibold text-white">Phase 1: Direct Core Acquisitions</p>
                  <p className="text-zinc-450 mt-0.5">Allocate capital size to premium pre-sales developments in Herăstrău Lake, mitigating entrance premiums.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[30px] top-0.5 h-3 w-3 rounded-full bg-zinc-700" />
                  <p className="font-semibold text-zinc-200">Phase 2: Leverage & Diversify</p>
                  <p className="text-zinc-450 mt-0.5">Utilize asset equity lines to enter off-market international developments in Dubai Marina for currency hedging.</p>
                </div>
              </div>
            </div>

            {/* Protection Strategy Checklist */}
            <div className="space-y-4 border-t border-zinc-900 pt-5">
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Asset Protection Strategy</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  "Incorporate local Special Purpose Vehicle (SPV) to hedge individual tax liabilities.",
                  "Apply progressive notarial escrow clauses to secure transaction payments.",
                  "Run automated cadastre scans on land plots using the AI Property Scanner.",
                  "Acquire optional PAD and premium building liability insurance to insulate holdings."
                ].map((tip, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start p-3 rounded-xl bg-zinc-950/40 border border-zinc-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-400 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/property-scanner"
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-6 py-2.5 text-xs text-zinc-300 transition-all flex items-center gap-1.5"
            >
              <span>Scan Active Listings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
