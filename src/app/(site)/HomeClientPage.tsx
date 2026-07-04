"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  Sparkles,
  Shield,
  Activity,
  BookOpen,
  Wrench,
  ChevronRight,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";

interface HomeClientPageProps {
  featuredProperties: any[];
  featuredNews: any[];
}

export default function HomeClientPage({ featuredProperties, featuredNews }: HomeClientPageProps) {
  const { language, t } = useLanguage();

  const QUICK_GRID = [
    {
      title: language === "ro" ? "Cumpără & Vinde" : "Buy & Sell",
      desc: language === "ro" ? "Proprietăți premium, profile dezvoltatori și consultanță exclusivă." : "Premium units, builder audits, and exclusive buyer representation.",
      icon: Building2,
      color: "text-blue-400 border-blue-500/10 hover:bg-blue-500/[0.02]",
      href: "/proprietati"
    },
    {
      title: language === "ro" ? "Investește & Protejează" : "Invest & Protect",
      desc: language === "ro" ? "Market Pulse, dobânzi BNR active, portofolii și asigurări active." : "Macro ticker metrics, tax guidelines, asset allocations, and home insurance.",
      icon: Shield,
      color: "text-rose-400 border-rose-500/10 hover:bg-rose-500/[0.02]",
      href: "/stiri"
    },
    {
      title: language === "ro" ? "Învață & Cercetează" : "Learn & Research",
      desc: language === "ro" ? "Biblioteca de cărți, checklist-uri, cursuri practice și cuvântul zilei." : "Business reading list, document templates, investor guides, and the daily word.",
      icon: BookOpen,
      color: "text-amber-400 border-amber-500/10 hover:bg-amber-500/[0.02]",
      href: "/learning"
    },
    {
      title: language === "ro" ? "Instrumente" : "Tools",
      desc: language === "ro" ? "Calculatoare credite imobiliare, randament yield și convertoare." : "Mortgage interest estimators, cash flow ROI sheets, and currency values.",
      icon: Wrench,
      color: "text-teal-400 border-teal-500/10 hover:bg-teal-500/[0.02]",
      href: "/calculators"
    },
    {
      title: language === "ro" ? "Sistem AI" : "AI System",
      desc: language === "ro" ? "Nucleul central AiX Brain și asistentul tău financiar AI Advisor." : "The central decision cockpit routing queries across registries.",
      icon: Brain,
      color: "text-violet-400 border-violet-500/10 hover:bg-violet-500/[0.02]",
      href: "/brain"
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 space-y-24 text-center animate-in">
      
      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="space-y-6 max-w-2xl mx-auto py-6">
        <div className="flex justify-center mb-4">
          <div className="rounded-3xl bg-amber-500/10 p-5 border border-amber-500/25 w-fit shrink-0 animate-pulse">
            <Brain className="h-12 w-12 text-amber-500" />
          </div>
        </div>
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 border border-amber-500/20 rounded-full px-4 py-1.5 bg-amber-500/5">
          AiX OS &bull; Decision intelligence
        </span>
        <h1 className="text-5xl sm:text-6xl font-light text-white tracking-tight leading-none">
          AiX OS
        </h1>
        <p className="text-2xl sm:text-3xl font-light text-zinc-300">
          {language === "ro" ? "Creierul tău imobiliar secundar. Gândește mai rapid." : "Your second brain. Think faster."}
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
          {language === "ro" 
            ? "Economisește timp, evită capcanele de due-diligence și optimizează-ți plasamentele financiare cu sistemul nostru decizional."
            : "Save time, mitigate transactional friction, and allocate your property capital using automated risk logs."}
        </p>
        <div className="pt-4">
          <Link
            href="/join"
            className="inline-block rounded-xl bg-amber-500 text-black px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-98"
          >
            {language === "ro" ? "Alătură-te Waitlist" : "Join Waitlist"}
          </Link>
        </div>
      </section>

      {/* ─── QUICK ACCESS GRID (5 CATEGORIES ONLY) ─────────────────────────── */}
      <section className="space-y-6 text-left">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">
          {language === "ro" ? "Categorii de Lucru" : "Quick Access Workspace"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {QUICK_GRID.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`p-6 rounded-2xl border bg-zinc-950/20 backdrop-blur-md transition-all duration-300 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 ${item.color}`}
              >
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl border border-zinc-900 bg-zinc-950 w-fit shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-[11px] text-zinc-500 leading-normal line-clamp-3">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-4">
                  <span>{language === "ro" ? "Deschide" : "Open"}</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── MARKET SNAPSHOT (AIX SCORE + MARKET PULSE PREVIEW) ───────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
        
        {/* AiX Score rating widget */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl border border-zinc-900 bg-zinc-950/30 backdrop-blur-xl relative overflow-hidden space-y-4 min-h-[220px]">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/[0.02] blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-amber-500" />
            <span className="text-[10px] uppercase font-bold font-mono text-zinc-400">Score Tracker</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">AiX Score Simulator</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              {language === "ro"
                ? "Scorul de siguranță al tranzacției. Evaluăm 14 variabile cadastrale, fiscale și juridice înainte de a recomanda un activ imobiliar."
                : "Transaction safety index. We audit 14 cadastre, tax, and legal coordinates prior to matching any listing."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/aix-score"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              {language === "ro" ? "Calculează AiX Score" : "Run AiX Score Simulator"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Market Pulse preview widget */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-zinc-900 bg-zinc-950/30 backdrop-blur-xl relative overflow-hidden space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-rose-500" />
            <span className="text-[10px] uppercase font-bold font-mono text-zinc-400">Market Pulse</span>
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-white">
              {language === "ro" ? "Analize macroeconomice active" : "Active Macroeconomic Analysis"}
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              {language === "ro"
                ? "Urmărește evoluția pieței imobiliare, deciziile de dobândă ale BNR și indicii inflației CPI."
                : "Monitor real estate shifts, BNR monetary interest rulings, and CPI inflation logs."}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-900/60">
            {featuredNews.slice(0, 2).map((n) => (
              <Link
                key={n.slug}
                href={`/stiri/${n.slug}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors border border-zinc-900/40"
              >
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-zinc-300 truncate max-w-sm">{n.title}</p>
                  <p className="text-[9.5px] text-zinc-650 mt-0.5">{new Date(n.published_at || n.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-550" />
              </Link>
            ))}
          </div>

          <div className="pt-1">
            <Link
              href="/stiri"
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              {language === "ro" ? "Vezi toate analizele" : "View all market pulse logs"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
