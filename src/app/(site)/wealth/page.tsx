"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui";
import { TrendingUp, TrendingDown, Trophy, Landmark, Activity } from "lucide-react";
import { getMarketIntelligence, BillionaireItem, CompanyItem } from "@/lib/market/dataProvider";
import { designSystem } from "@/styles/designSystem";

const baselineBillionaires: BillionaireItem[] = [
  { rank: 1, name: "Elon Musk", category: "Tech & Aerospace (Tesla / SpaceX)", value: "$248.5 B", trend: "up", source: "United States" },
  { rank: 2, name: "Jeff Bezos", category: "Tech & E-commerce (Amazon)", value: "$210.2 B", trend: "up", source: "United States" },
  { rank: 3, name: "Bernard Arnault & Family", category: "Luxury Goods (LVMH)", value: "$195.8 B", trend: "down", source: "France" },
  { rank: 4, name: "Mark Zuckerberg", category: "Tech & Social (Meta)", value: "$178.4 B", trend: "up", source: "United States" },
  { rank: 5, name: "Larry Ellison", category: "Software & Cloud (Oracle)", value: "$152.0 B", trend: "up", source: "United States" },
  { rank: 6, name: "Warren Buffett", category: "Finance & Holdings (Berkshire)", value: "$138.5 B", trend: "down", source: "United States" },
];

const baselineCompanies: CompanyItem[] = [
  { rank: 1, name: "Microsoft Corp. (MSFT)", category: "Tech / Cloud & AI", value: "$3.42 T", trend: "up", ticker: "NASDAQ" },
  { rank: 2, name: "Apple Inc. (AAPL)", category: "Consumer Tech & Devices", value: "$3.35 T", trend: "up", ticker: "NASDAQ" },
  { rank: 3, name: "NVIDIA Corp. (NVDA)", category: "Semiconductors & AI Hardware", value: "$3.18 T", trend: "up", ticker: "NASDAQ" },
  { rank: 4, name: "Alphabet Inc. (GOOGL)", category: "Tech & Search Infrastructure", value: "$2.20 T", trend: "up", ticker: "NASDAQ" },
  { rank: 5, name: "Amazon.com Inc. (AMZN)", category: "E-commerce & Cloud", value: "$1.98 T", trend: "down", ticker: "NASDAQ" },
  { rank: 6, name: "Saudi Aramco", category: "Energy & Petrochemicals", value: "$1.85 T", trend: "down", ticker: "TADAWUL" },
];

export default function WealthPage() {
  const [data, setData] = useState<{
    billionaires: BillionaireItem[];
    companies: CompanyItem[];
  } | null>(null);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/market');
        if (res.ok) {
          const json = await res.json();
          setData({
            billionaires: json.billionaires,
            companies: json.companies,
          });
        }
      } catch (e) {
        console.warn("[AiX Wealth Page] Failed loading API wealth data feeds", e);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const billionaires = data?.billionaires || baselineBillionaires;
  const companies = data?.companies || baselineCompanies;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Wealth Intelligence"
        title="Wealth & Capital Rankings"
        subtitle="Monitorizarea averilor globale nete și a capitalizării corporațiilor gigant. Index actualizat în concordanță cu piața financiară."
      />

      {/* Stats Summary Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Billionaires Dashboard Card */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/20 text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-light text-white">Forbes World Billionaires</h2>
              <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">Net Worth Tracker</p>
            </div>
          </div>

          <div className="space-y-3">
            {billionaires.map((b) => (
              <div
                key={b.rank}
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-850 hover:bg-zinc-900/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-900/60 text-zinc-400 text-xs font-mono font-semibold border border-zinc-850 group-hover:border-amber-500/35 group-hover:text-amber-400 transition-colors">
                    #{b.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white">{b.name}</p>
                      <span className="text-[8.5px] uppercase tracking-wider text-zinc-500 font-mono">({b.source})</span>
                    </div>
                    <p className="text-[10px] text-zinc-450 mt-0.5">{b.category}</p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-amber-400 font-mono">{b.value}</p>
                  </div>
                  <div className="rounded-lg p-1.5 border border-zinc-900 bg-[#080808]">
                    {b.trend === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Market Cap Dashboard Card */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/20 text-amber-400">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-light text-white">Top Global Companies</h2>
              <p className="text-[10px] text-zinc-555 uppercase tracking-widest font-mono">Market Cap Rankings</p>
            </div>
          </div>

          <div className="space-y-3">
            {companies.map((c) => (
              <div
                key={c.rank}
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-855 hover:bg-zinc-900/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-900/60 text-zinc-400 text-xs font-mono font-semibold border border-zinc-850 group-hover:border-amber-500/35 group-hover:text-amber-400 transition-colors">
                    #{c.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white">{c.name}</p>
                      <span className="text-[8.5px] uppercase tracking-wider text-zinc-500 font-mono">({c.ticker})</span>
                    </div>
                    <p className="text-[10px] text-zinc-450 mt-0.5">{c.category}</p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-amber-400 font-mono">{c.value}</p>
                  </div>
                  <div className="rounded-lg p-1.5 border border-zinc-900 bg-[#080808]">
                    {c.trend === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Info Warning Alert Banner */}
      <div className="flex items-start gap-4 rounded-2xl border border-zinc-850 bg-zinc-900/10 p-5 text-xs text-zinc-500 leading-relaxed max-w-4xl mx-auto">
        <Activity className="h-5 w-5 text-amber-500/70 flex-shrink-0 mt-0.5 animate-pulse" />
        <p>
          Datele de capitalizare bursieră și evaluare netă sunt compilate utilizând indicatorii de referință SEC, Bloomberg L.P., și rapoartele Forbes din 2026. Evaluările activelor non-publice pot fi bazate pe estimări algoritmice. Acest dashboard are rol exclusiv informațional și nu constituie recomandări de tranzacționare în piețele financiare.
        </p>
      </div>

    </div>
  );
}
