"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  MapPin,
  DollarSign,
  Activity,
  Zap,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface RadarLocation {
  id: string;
  city: string;
  area: string;
  country: string;
  pricePerSqm: string;
  yieldRate: string;
  riskRating: "AAA" | "AA+" | "AA" | "A+" | "A";
  sentiment: "Bullish" | "Bearish" | "Stable" | "Neutral" | "Elite";
  change: string;
  category: "RO" | "INT" | "EMERGING";
}

export default function MarketRadarPage() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<"ALL" | "RO" | "INT" | "EMERGING">("ALL");

  const RADAR_DATA: RadarLocation[] = [
    { id: "ro-floreasca", city: "București", area: "Floreasca / Herăstrău", country: "Romania", pricePerSqm: "€3,200", yieldRate: "6.20%", riskRating: "AA+", sentiment: "Bullish", change: "+4.2%", category: "RO" },
    { id: "ro-cluj", city: "Cluj-Napoca", area: "Centru / Zorilor", country: "Romania", pricePerSqm: "€2,900", yieldRate: "4.80%", riskRating: "AA", sentiment: "Stable", change: "+1.8%", category: "RO" },
    { id: "ro-pipera", city: "Ilfov / Pipera", area: "Pipera Nord Complex", country: "Romania", pricePerSqm: "€2,100", yieldRate: "6.80%", riskRating: "A+", sentiment: "Bullish", change: "+5.1%", category: "RO" },
    { id: "int-monaco", city: "Monaco", area: "Monte Carlo Waterfront", country: "Monaco", pricePerSqm: "€52,000", yieldRate: "2.50%", riskRating: "AAA", sentiment: "Elite", change: "+0.5%", category: "INT" },
    { id: "int-dubai", city: "Dubai", area: "Marina / Palm Jumeirah", country: "UAE", pricePerSqm: "€6,500", yieldRate: "7.80%", riskRating: "A+", sentiment: "Bullish", change: "+12.4%", category: "INT" },
    { id: "int-london", city: "Londra", area: "Mayfair / Belgravia", country: "UK", pricePerSqm: "€22,000", yieldRate: "3.40%", riskRating: "AA+", sentiment: "Neutral", change: "-0.8%", category: "INT" },
    { id: "em-cyprus", city: "Limassol", area: "Marina Towers", country: "Cyprus", pricePerSqm: "€4,800", yieldRate: "7.10%", riskRating: "A", sentiment: "Bullish", change: "+6.8%", category: "EMERGING" },
    { id: "em-marbella", city: "Marbella", area: "Golden Mile Villas", country: "Spain", pricePerSqm: "€7,200", yieldRate: "5.40%", riskRating: "AA", sentiment: "Bullish", change: "+8.2%", category: "EMERGING" }
  ];

  const filteredLocations = filter === "ALL" ? RADAR_DATA : RADAR_DATA.filter(loc => loc.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12 animate-in text-left">
      <PageHeader
        badge="Spatial Ticker Core"
        title="AiX OS™ Market Radar"
        subtitle={
          language === "ro"
            ? "Vizualizare globală comparativă a yield-urilor nete, prețului pe metru pătrat și indicilor de risc pe piețe imobiliare active."
            : "Global spatial tracker benchmark checking pricing indexes, risk grades, and yield statistics across premier target zones."
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-900 pb-4 overflow-x-auto scrollbar-none">
        {[
          { key: "ALL" as const, label: language === "ro" ? "Toate Piețele" : "All Coordinates" },
          { key: "RO" as const, label: language === "ro" ? "România Core" : "Romania Core" },
          { key: "INT" as const, label: language === "ro" ? "Internațional Lux" : "Global Luxury" },
          { key: "EMERGING" as const, label: language === "ro" ? "Yielduri Emergente" : "Emerging Yields" }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`rounded-full px-4.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
              filter === item.key
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400 font-bold"
                : "border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 bg-zinc-950/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Radar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} relative overflow-hidden flex flex-col justify-between min-h-[250px]`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.01] blur-2xl rounded-full" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold font-mono tracking-widest text-zinc-550 uppercase block">{loc.country}</span>
                  <h3 className="text-sm font-semibold text-white truncate max-w-[150px]">{loc.city}</h3>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-500/50 shrink-0" />
                    <span className="truncate max-w-[130px]">{loc.area}</span>
                  </p>
                </div>
                
                {/* Risk Badge */}
                <span className={`text-[9px] font-bold font-mono px-2 py-0.5 border rounded-full ${
                  loc.riskRating === "AAA" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" :
                  loc.riskRating.startsWith("AA") ? "border-amber-500/20 bg-amber-500/5 text-amber-400" :
                  "border-zinc-800 bg-zinc-950 text-zinc-400"
                }`}>
                  {loc.riskRating}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-900/60 pt-4 text-xs font-mono">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold">Avg / sqm</p>
                  <p className="text-zinc-200 mt-0.5">{loc.pricePerSqm}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold">Net Yield</p>
                  <p className="text-amber-400 font-bold mt-0.5">{loc.yieldRate}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900/60 flex justify-between items-center text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-amber-500/60" />
                <span className={`font-bold ${
                  loc.sentiment === "Bullish" || loc.sentiment === "Elite" ? "text-emerald-400" : "text-zinc-400"
                }`}>
                  {loc.sentiment}
                </span>
              </div>
              <span className={`font-bold ${loc.change.startsWith("+") ? "text-emerald-400" : "text-zinc-400"}`}>
                {loc.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Radar intelligence advisory block */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-zinc-900 bg-zinc-950/20 text-xs text-zinc-450 space-y-4`}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Radar Intelligence Directive</h4>
        </div>
        <p className="leading-relaxed">
          The above metrics represent synthesized data sets updated from active property exchanges and central bank reference registers. To integrate direct API endpoints or compile offline ROI allocations mapping to these coordinates, deploy the strategy module.
        </p>
        <div>
          <Link
            href="/simulation"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider"
          >
            <span>Simulate Strategy Allocations</span>
            <ChevronRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
