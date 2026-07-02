"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import {
  Brain,
  MessageSquare,
  Sparkles,
  PieChart,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Coins,
  Building,
  User,
} from "lucide-react";

interface PortfolioCard {
  id: string;
  title: string;
  risk: "Low" | "Medium" | "High";
  allocation: { asset: string; percentage: number }[];
  diversification: string;
  description: string;
  expectedReturn: string;
}

const RECOMMENDATIONS: Record<string, PortfolioCard[]> = {
  conservator: [
    {
      id: "p1",
      title: "Real Estate Core + Blue Chip Stocks",
      risk: "Low",
      allocation: [
        { asset: "Real Estate (Monaco & RO)", percentage: 60 },
        { asset: "Blue Chip Equities (S&P 500)", percentage: 25 },
        { asset: "Physical Gold", percentage: 10 },
        { asset: "Treasury Bonds", percentage: 5 },
      ],
      diversification: "9.2/10 (Excelentă)",
      description: "Ideal pentru conservarea capitalului de tip generational wealth în perioade de volatilitate. Concentrat pe active imobiliare tangibile în piețe sigure.",
      expectedReturn: "5% - 7% anual (inclusiv chirii)",
    },
  ],
  moderat: [
    {
      id: "p2",
      title: "Balanced Growth Portfolio",
      risk: "Medium",
      allocation: [
        { asset: "Real Estate (București Premium & Dubai Off-Plan)", percentage: 45 },
        { asset: "Tech Equities (NASDAQ / NVIDIA)", percentage: 35 },
        { asset: "Cryptocurrency (BTC / ETH)", percentage: 10 },
        { asset: "Cash & Yield Instruments", percentage: 10 },
      ],
      diversification: "8.5/10 (Ridicată)",
      description: "Sinergie între randamentul imobiliar din chirii în Dubai și aprecierea companiilor de AI din SUA, cu expunere controlată în active digitale.",
      expectedReturn: "10% - 12% anual",
    },
  ],
  agresiv: [
    {
      id: "p3",
      title: "Hyper-Growth & Alpha Generation",
      risk: "High",
      allocation: [
        { asset: "Dubai Off-Plan High-Yield Projects", percentage: 35 },
        { asset: "AI & Tech Stocks", percentage: 30 },
        { asset: "Cryptocurrency (BTC, ETH, SOL)", percentage: 25 },
        { asset: "Venture Capital / Seed Deals", percentage: 10 },
      ],
      diversification: "6.8/10 (Medie)",
      description: "Optimizat pentru multiplicarea accelerată a capitalului. Expunere directă în piața off-plan din Emirate, rețele blockchain de mare viteză și micro-cap stocks.",
      expectedReturn: "18% - 25% anual",
    },
  ],
};

export default function MoneyAdvisorPage() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; portfolios?: PortfolioCard[] }>>([
    {
      sender: "ai",
      text: "Bună ziua. Sunt consilierul dvs. de investiții AiX Money Advisor. Alegeți profilul de risc dorit sau introduceți suma pe care doriți să o investiți pentru a genera o recomandare de portofoliu personalizată.",
    },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRiskSelect = (riskKey: "conservator" | "moderat" | "agresiv") => {
    setLoading(true);
    const userMsg = `Doresc o recomandare de portofoliu cu risc ${riskKey.toUpperCase()}`;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);

    setTimeout(() => {
      const aiReply = `Am analizat indicatorii de piață, prețurile imobiliare din portofoliul AiX OS, indicii bursieri și cotațiile crypto. Pe baza profilului de risc ales, vă recomand următoarea structură de alocare a activelor:`;
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiReply, portfolios: RECOMMENDATIONS[riskKey] },
      ]);
      setLoading(false);
    }, 900);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const userQuery = query;
    setMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setQuery("");

    setTimeout(() => {
      // Analyze text for keywords to suggest portfolio
      let selectedClass: "conservator" | "moderat" | "agresiv" = "moderat";
      if (userQuery.toLowerCase().includes("risc mic") || userQuery.toLowerCase().includes("sigur") || userQuery.toLowerCase().includes("conservator")) {
        selectedClass = "conservator";
      } else if (userQuery.toLowerCase().includes("agresiv") || userQuery.toLowerCase().includes("mare") || userQuery.toLowerCase().includes("randament")) {
        selectedClass = "agresiv";
      }

      const aiReply = `Analiză finalizată pentru solicitarea "${userQuery}". Datele noastre sugerează că opțiunea ideală de diversificare pentru profilul descris constă într-un portofoliu de clasă ${selectedClass.toUpperCase()}:`;

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiReply, portfolios: RECOMMENDATIONS[selectedClass] },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-12 animate-in">
      <PageHeader
        badge="AI Wealth Advisor"
        title="Money Advisor OS"
        subtitle="Sistem inteligent asistat de inteligență artificială care corelează datele imobiliare cu indicatorii macroeconomici pentru a genera sugestii de portofoliu."
      />

      {/* Profile selector quick pills */}
      <div className="flex flex-wrap items-center gap-3 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-850 max-w-fit mx-auto justify-center">
        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider px-2">Alege profil risc:</span>
        <button
          onClick={() => handleRiskSelect("conservator")}
          className="px-4 py-2 text-xs font-semibold uppercase rounded-xl border border-zinc-800 text-zinc-400 hover:border-amber-500/40 hover:text-white transition-all bg-zinc-900/10"
        >
          Conservator (Risc Scăzut)
        </button>
        <button
          onClick={() => handleRiskSelect("moderat")}
          className="px-4 py-2 text-xs font-semibold uppercase rounded-xl border border-zinc-800 text-zinc-400 hover:border-amber-500/40 hover:text-white transition-all bg-zinc-900/10"
        >
          Moderat (Risc Mediu)
        </button>
        <button
          onClick={() => handleRiskSelect("agresiv")}
          className="px-4 py-2 text-xs font-semibold uppercase rounded-xl border border-zinc-800 text-zinc-400 hover:border-amber-500/40 hover:text-white transition-all bg-zinc-900/10"
        >
          Agresiv (Risc Ridicat)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Chat Component */}
        <div className="md:col-span-7 rounded-3xl border border-zinc-850 bg-zinc-950/40 backdrop-blur-xl p-5 sm:p-6 space-y-6 shadow-2xl flex flex-col h-[520px] justify-between">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-3 flex-shrink-0">
            <Brain className="h-5 w-5 text-amber-500" />
            <h2 className="text-sm font-semibold text-white">AiX Agent Core v2.4</h2>
            <span className="ml-auto flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`rounded-xl p-2.5 border ${
                  msg.sender === "user"
                    ? "border-amber-500/20 bg-amber-500/5 text-amber-400"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-300"
                }`}>
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                </div>
                
                <div className="space-y-4 max-w-[85%]">
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-amber-500/10 text-white rounded-tr-none border border-amber-500/10"
                      : "bg-zinc-900/20 text-zinc-300 rounded-tl-none border border-zinc-900"
                  }`}>
                    {msg.text}
                  </div>

                  {/* Portfolios inline inside chat flow */}
                  {msg.portfolios && (
                    <div className="space-y-4">
                      {msg.portfolios.map((portfolio) => (
                        <div
                          key={portfolio.id}
                          className="rounded-2xl border border-amber-500/20 bg-[#080808]/90 p-5 space-y-4 shadow-xl"
                        >
                          <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold ${
                                portfolio.risk === "Low"
                                  ? "bg-emerald-550/10 text-emerald-400 border border-emerald-500/20"
                                  : portfolio.risk === "Medium"
                                    ? "bg-sky-550/10 text-sky-400 border border-sky-500/20"
                                    : "bg-red-550/10 text-red-400 border border-red-500/20"
                              }`}>
                                Risc {portfolio.risk}
                              </span>
                              <h3 className="text-xs font-semibold text-white mt-1.5">{portfolio.title}</h3>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Yield Estimat</p>
                              <p className="text-xs font-bold text-amber-400">{portfolio.expectedReturn}</p>
                            </div>
                          </div>

                          <p className="text-[11px] text-zinc-400 leading-relaxed">{portfolio.description}</p>

                          {/* Allocation Chart Representation */}
                          <div className="space-y-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                              <PieChart className="h-3 w-3 text-amber-500" />
                              Alocare Active Procentuală
                            </p>
                            <div className="space-y-1.5 text-[10px]">
                              {portfolio.allocation.map((item, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between text-zinc-300">
                                    <span>{item.asset}</span>
                                    <span className="font-semibold text-white">{item.percentage}%</span>
                                  </div>
                                  <div className="w-full bg-zinc-900 rounded-full h-1 relative overflow-hidden">
                                    <div
                                      className="bg-amber-500 h-1 rounded-full"
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Specs footer */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-zinc-900 text-zinc-500">
                            <div>
                              <span>Diversificare: </span>
                              <span className="text-white font-medium">{portfolio.diversification}</span>
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
                                className="text-amber-500 hover:underline font-semibold"
                              >
                                Discută Portofoliu
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono italic">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-spin" />
                Sistemul procesează datele de portofoliu...
              </div>
            )}
          </div>

          {/* Form input field */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-shrink-0 pt-3 border-t border-zinc-900">
            <input
              type="text"
              placeholder="Ex: Am 200k EUR, doresc un portofoliu imobiliar cu randament ridicat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-5 py-2.5 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="h-4 w-4" />
              Trimite
            </button>
          </form>
        </div>

        {/* Sidebar Info & Risk Analysis */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-3xl border border-zinc-850 bg-zinc-950/40 p-6 sm:p-7 space-y-5 shadow-2xl">
            <h3 className="text-base font-light text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
              <ShieldAlert className="h-5 w-5 text-amber-500/80" />
              Sinergia Diversificării
            </h3>

            <div className="space-y-4 text-xs leading-relaxed text-zinc-400">
              <div className="space-y-2">
                <p className="font-semibold text-white flex items-center gap-2">
                  <Building className="h-4 w-4 text-amber-500/80" />
                  1. Imobiliare de Lux (Stabilitate)
                </p>
                <p>
                  Imobiliarele din zonele premium (Monaco, Floreasca, Herăstrău) oferă o protecție excepțională împotriva inflației și o conservare netă superioară a valorii comparativ cu numerarul.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-500/80" />
                  2. Piețe Globale (Apreciere)
                </p>
                <p>
                  Expunerea pe companii de tehnologie de mari dimensiuni (NVIDIA, Apple) permite captarea creșterii din sectorul tehnologic global, menținând portofoliul extrem de lichid.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-white flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-500/80" />
                  3. Aur & Digital Crypto (Hedge)
                </p>
                <p>
                  Aurul fizic conservă valoarea pe termen lung, iar BTC și SOL acționează ca instrumente de randament asimetric în piețele taurine (bull market).
                </p>
              </div>
            </div>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
              className="w-full rounded-xl bg-amber-500 text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              Configurează Portofoliul la Notar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
