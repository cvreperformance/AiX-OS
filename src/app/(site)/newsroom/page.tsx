"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Newspaper,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Database,
  Layers,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface IntelligenceBrief {
  id: string;
  title: string;
  summary: string;
  category: "MACRO" | "PROPERTY" | "SUMMARY";
  categoryLabel: string;
  published: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export default function NewsroomPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"ALL" | "MACRO" | "PROPERTY" | "SUMMARY">("ALL");

  const BRIEFS: IntelligenceBrief[] = [
    {
      id: "brief-1",
      title: language === "ro" ? "Evoluția Randamentului Imobiliar în Core-ul Capitalei" : "Bucharest Core Yield Spread Shifts",
      summary: language === "ro"
        ? "Analiza datelor tranzacționale relevă o convergență rapidă a randamentelor între Floreasca și Pipera. Unitățile finalizate din segmentul premium atrag un yield net mediu de 6.2%, determinând investitorii să realoce capitalul către apartamente finalizate."
        : "Transactional metrics show yield margins between Floreasca and Pipera are narrowing. Completed high-value residential blocks yield a net 6.2%, directing HNWI capital allocations towards completed primary units.",
      category: "PROPERTY",
      categoryLabel: language === "ro" ? "Proprietăți" : "Property Intel",
      published: language === "ro" ? "acum 3 min" : "3 mins ago",
      priority: "HIGH"
    },
    {
      id: "brief-2",
      title: language === "ro" ? "Indexul CPI și Deciziile de Dobândă BNR" : "CPI Inflation & BNR Rate Projections",
      summary: language === "ro"
        ? "Indicatorul inflației CPI indică o stabilizare în Q2 2026. Consiliul de administrație al BNR preconizează menținerea dobânzii de politică monetară la 6.50% în Q3, ceea ce va stabiliza cotațiile ROBOR."
        : "Live CPI metrics suggest stabilization in Q2 2026. Central bank directors project keeping policy interest rates at 6.50% through Q3, establishing a structural support level for ROBOR interbank rates.",
      category: "MACRO",
      categoryLabel: language === "ro" ? "Macroeconomie" : "Macro Economy",
      published: language === "ro" ? "acum 18 min" : "18 mins ago",
      priority: "HIGH"
    },
    {
      id: "brief-3",
      title: language === "ro" ? "Rezumat AI: Digitalizarea Extraselor ANCPI" : "AI Summary: ANCPI Land Registry Digitization",
      summary: language === "ro"
        ? "Oficiul de Cadastru accelerează tranziția digitală. Timpul necesar verificării ipotecilor și a servituților active s-a redus cu 60%. Ecosistemul AiX OS™ poate compila acum rapoartele de risc cadastral în sub 30 de secunde."
        : "Cadastre bureaus are accelerating cloud database synchronizations. Time parameters for verifying mortgages and easements dropped by 60%. AiX OS™ core servers can now parse and return risk audits in under 30 seconds.",
      category: "SUMMARY",
      categoryLabel: language === "ro" ? "Rezumat AI" : "AI Summaries",
      published: language === "ro" ? "acum 1 oră" : "1 hour ago",
      priority: "MEDIUM"
    },
    {
      id: "brief-4",
      title: language === "ro" ? "Cotațiile Aurului și hedgingul de Portofoliu" : "Gold Spot Indices & Hedging Ratios",
      summary: language === "ro"
        ? "Cotația Spot XAU indică o apreciere de 1.2% pe fondul tensiunilor geopolitice. Recomandăm alocarea a 5-10% din portofoliul total în rezerve lichide de metale prețioase pentru a atenua riscurile inflaționiste."
        : "Live Spot XAU indices climbed 1.2% under regional geopolitical frictions. Portfolio simulation matrices advise holding 5-10% in liquid metal spots as a hedge against inflation index volatility.",
      category: "MACRO",
      categoryLabel: language === "ro" ? "Macroeconomie" : "Macro Economy",
      published: language === "ro" ? "acum 2 ore" : "2 hours ago",
      priority: "LOW"
    }
  ];

  const filteredBriefs = activeTab === "ALL" ? BRIEFS : BRIEFS.filter(b => b.category === activeTab);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-12 animate-in text-left">
      <PageHeader
        badge="API Sync Platform"
        title="AiX Intelligence Newsroom"
        subtitle={
          language === "ro"
            ? "Flux automatizat de semnale economice, analize și rezumate generate de AI, gata pentru integrare RSS."
            : "Live automated stream routing macroeconomic updates, property intelligence briefs, and AI summaries."
        }
      />

      {/* API Telemetry Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sync Status", val: "CONNECTED", detail: "RSS/API Ready", color: "text-emerald-400 border-emerald-500/15 bg-emerald-500/5" },
          { label: "Scanned Registries", val: "42 active", detail: "ANCPI, BNR, ECB, Fed", color: "text-zinc-600 border-zinc-200 bg-white/40" },
          { label: "Scan Frequency", val: "120 / min", detail: "Autopilot scanning", color: "text-zinc-600 border-zinc-200 bg-white/40" },
          { label: "AI Summarizer", val: "Active v5.0", detail: "Semantic parsing", color: "text-amber-400 border-amber-500/15 bg-amber-500/5" }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${item.color} font-mono text-xs text-left`}>
            <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">{item.label}</p>
            <p className="text-sm font-semibold mt-1">{item.val}</p>
            <p className="text-[9px] text-zinc-550 mt-0.5">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 pb-3 overflow-x-auto scrollbar-none">
        {[
          { key: "ALL" as const, label: language === "ro" ? "Toate Semnalele" : "All Feeds" },
          { key: "MACRO" as const, label: language === "ro" ? "Macroeconomie" : "Macro Economy" },
          { key: "PROPERTY" as const, label: language === "ro" ? "Proprietăți" : "Property Intel" },
          { key: "SUMMARY" as const, label: language === "ro" ? "Rezumate AI" : "AI Summaries" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === tab.key
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400 font-bold"
                : "border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feeds List */}
      <div className="space-y-4">
        {filteredBriefs.map((brief) => (
          <div
            key={brief.id}
            className={`p-6 rounded-3xl ${designSystem.glass} border-zinc-200/60 text-left space-y-4`}
          >
            <div className="flex justify-between items-center border-b border-zinc-200/60 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[8.5px] font-bold font-mono px-2 py-0.5 border rounded-full ${
                  brief.category === "MACRO" ? "border-sky-500/25 bg-sky-500/5 text-sky-400" :
                  brief.category === "PROPERTY" ? "border-amber-500/25 bg-amber-500/5 text-amber-400" :
                  "border-rose-500/25 bg-rose-500/5 text-rose-400"
                }`}>
                  {brief.categoryLabel}
                </span>
                <span className="text-[10px] text-zinc-550 font-mono">{brief.published}</span>
              </div>
              
              <span className={`text-[8.5px] font-bold font-mono px-2 py-0.5 border rounded ${
                brief.priority === "HIGH" ? "border-rose-500/20 bg-rose-500/5 text-rose-400" :
                "border-zinc-200 bg-white text-zinc-400"
              }`}>
                {brief.priority} priority
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-900 leading-snug">{brief.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">{brief.summary}</p>
            </div>

            <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-550">
              <span className="flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                API Source Synced
              </span>
              
              <Link href="/market-radar" className="text-amber-500 hover:underline flex items-center gap-0.5">
                <span>Investigate Signal</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
