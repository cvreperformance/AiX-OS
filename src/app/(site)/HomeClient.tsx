"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Search, Globe, Brain, Activity, Plane, Coins } from "lucide-react";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { getMarketIntelligence, type MarketItem } from "@/lib/market/dataProvider";
import { designSystem } from "@/styles/designSystem";

// ─── Quick Access (hardcoded client-side to avoid Server→Client fn prop issue)
const QUICK_ACCESS = [
  { label: "Hartă GIS", href: "/map", icon: Globe },
  { label: "Money Advisor", href: "/money-advisor", icon: Brain },
  { label: "Piață & Macro", href: "/market", icon: Activity },
  { label: "Aviație Privată", href: "/private-jets", icon: Plane },
  { label: "Oportunități", href: "/oportunitati", icon: Coins },
];

// ─── Default export — Hero interactive section ────────────────────────────────
export default function HomeClient() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="space-y-5 mt-4">
      {/* Search trigger */}
      {!showSearch ? (
        <button
          onClick={() => setShowSearch(true)}
          className="group mx-auto flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:border-amber-500/40 hover:bg-zinc-900/60 px-5 py-3.5 text-sm text-zinc-500 hover:text-zinc-300 transition-all duration-300 w-full max-w-xl backdrop-blur-sm"
        >
          <Search className="h-4 w-4 text-zinc-600 group-hover:text-amber-500/70 transition-colors shrink-0" />
          <span className="flex-1 text-left">Caută proprietăți, orașe, investiții…</span>
          <kbd className="hidden sm:inline-block rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-600">⌘K</kbd>
        </button>
      ) : (
        <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <GlobalSearch />
        </div>
      )}

      {/* Quick access pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_ACCESS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 hover:border-amber-500/30 hover:text-amber-400 hover:bg-zinc-900/40 transition-all duration-200 backdrop-blur-sm"
            >
              <Icon className="h-3 w-3" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Live Market Ticker ───────────────────────────────────────────────────────
const FALLBACK_CRYPTO: MarketItem[] = [
  { label: "Bitcoin (BTC)", value: "$67,890.00", change: "+3.40%", trend: "up", desc: "" },
  { label: "Ethereum (ETH)", value: "$3,480.20", change: "+2.15%", trend: "up", desc: "" },
  { label: "Solana (SOL)", value: "$148.50", change: "+5.80%", trend: "up", desc: "" },
];

export function HomeMarketTicker() {
  const [crypto, setCrypto] = useState<MarketItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMarketIntelligence();
        if (!cancelled) setCrypto(res.crypto ?? []);
      } catch { /* stay on fallback */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const data = crypto.length > 0 ? crypto : FALLBACK_CRYPTO;
  const isLive = crypto.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className={`p-6 rounded-3xl ${designSystem.glass} grid grid-cols-1 md:grid-cols-4 gap-6 items-center`}>
        <div>
          <span className={designSystem.tickerText}>Live Market Data</span>
          <h3 className="text-sm font-bold text-white mt-1">Cotații Active</h3>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {isLive ? "CoinGecko live feed" : "Date de referință • Actualizare în curs"}
          </p>
        </div>
        <div className="border-t border-zinc-900/80 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6 md:col-span-3 grid grid-cols-3 gap-4">
          {data.map((c) => (
            <div key={c.label}>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">{c.label.split(" (")[0]}</p>
              <p className={`text-xs font-bold mt-0.5 font-mono ${isLive ? "text-white" : "text-zinc-400"}`}>{c.value}</p>
              <span className={`text-[10px] font-semibold ${c.trend === "down" ? "text-red-400" : "text-emerald-400"} ${!isLive ? "opacity-60" : ""}`}>
                {c.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Buttons ──────────────────────────────────────────────────────────────
export function HomeCTAButtons() {
  return (
    <div className="flex flex-wrap justify-center gap-3 pt-2">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
        className="rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
      >
        Programează Întâlnire Advisor
      </button>
      <Link
        href="/ai"
        className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-6 py-2.5 text-xs text-zinc-350 hover:text-white transition-all flex items-center gap-1"
      >
        AI Terminal
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
