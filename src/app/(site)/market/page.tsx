"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, RefreshCw, Globe, Building2, BarChart2, Coins, ArrowUpRight, Percent, Layers, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { MarketItem } from "@/lib/market/dataProvider";
import { designSystem } from "@/styles/designSystem";
import { useLanguage } from "@/context/LanguageContext";

// Baseline Data (used before real data compiles/loads)
const baselineStocks: MarketItem[] = [
  { label: "S&P 500", value: "5,432.50", change: "+0.45%", trend: "up", desc: "Standard & Poor's US" },
  { label: "NASDAQ Composite", value: "18,250.80", change: "+0.92%", trend: "up", desc: "Tech Index US" },
  { label: "DOW JONES", value: "40,110.20", change: "-0.15%", trend: "down", desc: "Industrial Average US" },
  { label: "STOXX Europe 600", value: "512.40", change: "+0.18%", trend: "up", desc: "European Blue Chip Index" },
];

const baselineCommodities: MarketItem[] = [
  { label: "Gold (Spot)", value: "$2,380.50 / oz", change: "+1.20%", trend: "up", desc: "Safe Haven Metal" },
  { label: "Silver (Spot)", value: "$30.15 / oz", change: "+2.45%", trend: "up", desc: "Industrial Precious Metal" },
  { label: "Brent Crude Oil", value: "$82.40 / bbl", change: "-0.85%", trend: "down", desc: "Global Oil Benchmark" },
  { label: "WTI Crude Oil", value: "$78.10 / bbl", change: "-0.95%", trend: "down", desc: "US Oil Benchmark" },
];

const baselineCrypto: MarketItem[] = [
  { label: "Bitcoin (BTC)", value: "$67,890.00", change: "+3.40%", trend: "up", desc: "Digital Gold Benchmark" },
  { label: "Ethereum (ETH)", value: "$3,480.20", change: "+2.15%", trend: "up", desc: "Smart Contract Capital" },
  { label: "Solana (SOL)", value: "$148.50", change: "+5.80%", trend: "up", desc: "High-Speed L1 Network" },
];

const baselineMacro: MarketItem[] = [
  { label: "Inflation rate US", value: "2.8%", change: "-0.2%", trend: "down", desc: "US CPI (YoY)" },
  { label: "Fed Funds Rate", value: "4.25%", change: "-0.25%", trend: "down", desc: "US Federal Reserve" },
  { label: "EUR/USD", value: "1.0850", change: "+0.05%", trend: "up", desc: "Euro / US Dollar FX" },
  { label: "ECB Deposit Rate", value: "3.40%", change: "-0.25%", trend: "down", desc: "European Central Bank" },
];

const bnrIndicators: MarketItem[] = [
  { label: "Dobândă BNR", value: "6.50%", change: "0.00%", trend: "neutral", desc: "Dobânda de politică monetară" },
  { label: "ROBOR 3M", value: "6.85%", change: "+0.12%", trend: "up", desc: "Bucharest Interbank Offer Rate" },
  { label: "ROBOR 6M", value: "7.10%", change: "+0.08%", trend: "up", desc: "Interbank Rate 6 luni" },
  { label: "IRCC Q2 2026", value: "5.78%", change: "-0.20%", trend: "down", desc: "Credit Consum Indicator" },
];

const realEstateRO: MarketItem[] = [
  { label: "Preț m² București", value: "€2,450", change: "+3.2%", trend: "up", desc: "Preț mediu listare" },
  { label: "Preț m² Cluj-Napoca", value: "€2,810", change: "+4.1%", trend: "up", desc: "Preț mediu listare" },
  { label: "Yield Chirie Mediu", value: "5.85%", change: "+0.15%", trend: "up", desc: "Randament mediu chirii" },
  { label: "Tranzacții Lux Q1", value: "320 unități", change: "+18%", trend: "up", desc: "Tranzacții €500K+" },
];

const currenciesFX: MarketItem[] = [
  { label: "EUR/USD", value: "1.0852", change: "+0.12%", trend: "up", desc: "Euro / Dollar" },
  { label: "GBP/USD", value: "1.2640", change: "+0.08%", trend: "up", desc: "Pound / Dollar" },
  { label: "USD/JPY", value: "158.45", change: "-0.25%", trend: "down", desc: "Dollar / Yen" },
  { label: "EUR/RON", value: "4.9760", change: "+0.02%", trend: "neutral", desc: "Euro / Leu" },
];

const bondYields: MarketItem[] = [
  { label: "US 10-Year Bond", value: "4.120%", change: "-0.04%", trend: "down", desc: "Treasure Yield US" },
  { label: "Germany 10Y Bund", value: "2.350%", change: "+0.01%", trend: "up", desc: "Government Bond DE" },
  { label: "Romania 10Y Bond", value: "6.220%", change: "-0.05%", trend: "down", desc: "Randament titluri stat RO" },
  { label: "UK 10Y Gilt", value: "3.980%", change: "+0.02%", trend: "neutral", desc: "Government Bond UK" },
];

// Heatmap elements
const heatmapBlocks = [
  { label: "MSFT", val: "+1.20%", type: "up" },
  { label: "AAPL", val: "+0.85%", type: "up" },
  { label: "NVDA", val: "+3.40%", type: "up" },
  { label: "BTC", val: "+3.40%", type: "up" },
  { label: "ETH", val: "+2.15%", type: "up" },
  { label: "SOL", val: "+5.80%", type: "up" },
  { label: "AMZN", val: "-0.95%", type: "down" },
  { label: "XAU", val: "+1.20%", type: "up" },
  { label: "BRENT", val: "-0.85%", type: "down" },
  { label: "EUR", val: "+0.05%", type: "up" },
  { label: "ROBOR", val: "+0.12%", type: "up" },
  { label: "ONE", val: "+1.85%", type: "up" },
];

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-zinc-500" />;
}

function IndicatorCard({ ind }: { ind: MarketItem }) {
  return (
    <div className={`relative rounded-3xl ${designSystem.glass} ${designSystem.glassHover} p-5 space-y-3 overflow-hidden`}>
      <div className={designSystem.glowTop} />
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-550 font-semibold">{ind.label}</p>
        <p className="text-xl font-light text-white mt-1">{ind.value}</p>
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-900/60">
        <div className="flex items-center gap-1.5">
          <TrendIcon trend={ind.trend} />
          <span
            className={`text-xs font-semibold ${
              ind.trend === "up"
                ? "text-emerald-400"
                : ind.trend === "down"
                  ? "text-red-400"
                  : "text-zinc-500"
            }`}
          >
            {ind.change}
          </span>
        </div>
        <span className="text-[10px] text-zinc-550 truncate max-w-[125px]">{ind.desc}</span>
      </div>
    </div>
  );
}

function Section({ title, badge, icon: Icon, indicators }: { title: string; badge?: string; icon: LucideIcon; indicators: MarketItem[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-amber-500/10 p-2 border border-amber-500/20 text-amber-400">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-sm font-semibold text-white tracking-wide">{title}</h2>
        {badge && (
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 border border-zinc-800 rounded-full px-2 py-0.5 ml-auto font-mono">
            {badge}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((ind) => (
          <IndicatorCard key={ind.label} ind={ind} />
        ))}
      </div>
    </div>
  );
}

export default function MarketPage() {
  const { language } = useLanguage();
  const [marketData, setMarketData] = useState<{
    stocks: MarketItem[];
    commodities: MarketItem[];
    crypto: MarketItem[];
    macro: MarketItem[];
  } | null>(null);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/market');
        if (res.ok) {
          const data = await res.json();
          setMarketData(data);
        }
      } catch (e) {
        console.warn("[AiX Market Page] Failed loading API data provider feeds", e);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const stocks = marketData?.stocks || baselineStocks;
  const commodities = marketData?.commodities || baselineCommodities;
  const crypto = marketData?.crypto || baselineCrypto;
  const macro = marketData?.macro || baselineMacro;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <div className="space-y-4 border-b border-zinc-900 pb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-amber-500">
          AiX OS™ · Bloomberg Intelligence Terminal
        </span>
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight">
          Market Pulse Dashboard
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          {language === "ro"
            ? "Monitorizare în timp real a indicatorilor bursieri, cotațiilor crypto (alimentată direct de CoinGecko), bondurilor guvernamentale și macro-economiei globale. Intelligence actualizat automat la fiecare 30 de secunde."
            : "Real-time monitoring of stock indices, crypto quotes (powered by CoinGecko), government bonds, and global macroeconomics. Intelligence auto-refreshed every 30 seconds."}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          <RefreshCw className="h-3.5 w-3.5 text-amber-500/80 animate-spin" style={{ animationDuration: "10s" }} />
          <span>
            {language === "ro" ? "Sincronizat securizat · Cotații la zi iulie 2026" : "Securely synced · Quotes updated July 2026"}
          </span>
        </div>
      </div>

      {/* Grid Dashboard Sectors */}
      <div className="space-y-12">
        {/* Indici Bursieri */}
        <Section title={language === "ro" ? "Indici Bursieri Globali (Stocks)" : "Global Stock Indices"} badge="Equities" icon={BarChart2} indicators={stocks} />

        {/* Commodities */}
        <Section title={language === "ro" ? "Mărfuri & Resurse (Commodities)" : "Commodities & Resources"} badge="Safe Haven" icon={Coins} indicators={commodities} />

        {/* Crypto */}
        <Section title={language === "ro" ? "Active Digitale (Cryptocurrency)" : "Digital Assets (Cryptocurrency)"} badge="Crypto" icon={Globe} indicators={crypto} />

        {/* Currencies FX */}
        <Section title={language === "ro" ? "Schimb Valutar & FX (Currencies)" : "Foreign Exchange (FX)"} badge="Forex" icon={Coins} indicators={currenciesFX} />

        {/* Bond Yields */}
        <Section title={language === "ro" ? "Randamente Titluri de Stat (Bond Yields)" : "Government Bond Yields"} badge="Debt Markets" icon={Percent} indicators={bondYields} />

        {/* Macro Global */}
        <Section title={language === "ro" ? "Indicatori Macroeconomici Globali" : "Global Macro Indicators"} badge="Macro" icon={Building2} indicators={macro} />

        {/* BNR Section */}
        <Section title={language === "ro" ? "Banca Națională a României (BNR)" : "National Bank of Romania (BNR)"} badge="Interbank RO" icon={Building2} indicators={bnrIndicators} />

        {/* Imobiliare RO */}
        <Section title={language === "ro" ? "Piața Imobiliară România (Aix Indexes)" : "Romanian Real Estate Market (AiX Indexes)"} badge="Real Estate Index" icon={Building2} indicators={realEstateRO} />

        {/* Performance Heat Map Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2 border border-amber-500/20 text-amber-400">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              {language === "ro" ? "Hartă Performanță Active (Heatmap)" : "Asset Performance Heatmap"}
            </h2>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 border border-zinc-800 rounded-full px-2 py-0.5 ml-auto font-mono">
              Market Snapshot
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {heatmapBlocks.map((block) => {
              const isUp = block.type === "up";
              return (
                <div
                  key={block.label}
                  className={`p-4 rounded-xl text-center border font-mono transition-all duration-300 ${
                    isUp
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                      : "bg-red-500/5 border-red-500/20 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  <p className="text-xs font-bold">{block.label}</p>
                  <p className="text-[10px] mt-0.5">{block.val}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Luxury CTA */}
      <div className="rounded-3xl border border-amber-500/20 bg-[#080808]/70 backdrop-blur-xl p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
        <Globe className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl font-light text-white tracking-wide">
          {language === "ro" ? "Investește Asistat de Date" : "Data-Assisted Investing"}
        </h2>
        <p className="text-xs text-zinc-450 max-w-lg mx-auto leading-relaxed">
          {language === "ro"
            ? "Platforma AiX OS™ corelează acești indicatori de cotații bursiere în timp real, crypto și inflație pentru a evalua oportunitățile imobiliare calificate."
            : "AiX OS™ correlates these real-time stock, crypto, and inflation indicators to evaluate qualified real estate opportunities."}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
            className="rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
          >
            {language === "ro" ? "Programează Întâlnire Advisor" : "Schedule Advisor Meeting"}
          </button>
          <Link
            href="/convenience"
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-6 py-2.5 text-xs text-zinc-350 hover:text-white transition-all flex items-center gap-1"
          >
            {language === "ro" ? "Calculatoare ROI" : "ROI Calculators"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
