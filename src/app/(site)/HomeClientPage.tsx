"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Building2,
  FileText,
  ExternalLink,
  Award,
  Lock,
  Sparkles,
  Layers,
  HeartPulse,
  Coins,
  BadgeCheck
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Article } from "@/services/aix-intelligence/types";
import { isRealEstateArticle } from "@/services/aix-intelligence/validation";

interface HomeClientPageProps {
  featuredProperties: any[];
  featuredNews: Article[];
  stats?: {
    propertiesScanned?: number;
    marketSignals?: number;
    correlatedOpportunities?: number;
    propertiesMonitored?: number;
    reportsGenerated?: number;
    totalProperties?: number;
    activeInvestors?: number;
    marketUpdates?: number;
  };
}


export default function HomeClientPage({
  featuredNews = [],
  stats,
}: HomeClientPageProps) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const ecosystemNodes = [
    {
      id: "homefind",
      title: "HOME FIND",
      tagline: language === "ro" ? "Inteligență Imobiliară de Lux" : "Luxury Real Estate Intelligence",
      description:
        language === "ro"
          ? "Platformă privată de analiză imobiliară, verificare randamente și evaluare risc cadastral pentru active premium."
          : "Private real estate analytics, yield verification, and cadastral risk assessment platform for premium assets.",
      url: "https://homefind.cristianvaduva.com",
      category: "Real Estate",
      icon: Building2,
      metrics: "€1.4B+ Verified Assets",
      badge: "Real Estate"
    },
    {
      id: "insurance",
      title: "INSURANCE",
      tagline: language === "ro" ? "Protecție Riscuri Corporate & Private" : "Corporate & Private Risk Intelligence",
      description:
        language === "ro"
          ? "Consultanță strategică în administrarea riscurilor patrimoniale, asigurări corporate și audit de protecție financiară."
          : "Strategic risk management, corporate insurance structuring, and asset protection auditing for institutional clients.",
      url: "https://insurance.cristianvaduva.com",
      category: "Risk Protection",
      icon: Shield,
      metrics: "100% Policy Verification",
      badge: "Risk & Protection"
    },
    {
      id: "credite",
      title: "CREDITE",
      tagline: language === "ro" ? "Inteligență & Soluții Financiare" : "Financial Solutions & Debt Intelligence",
      description:
        language === "ro"
          ? "Structurare finanțări hipotecare, credite de investiții și optimizare de capital pentru achiziții strategice."
          : "Mortgage structuring, investment debt optimization, and capital advisory for high-net-worth acquisitions.",
      url: "https://credite.cristianvaduva.com",
      category: "Banking & Debt",
      icon: Coins,
      metrics: "ROIR / IRCC Realtime",
      badge: "Financial"
    },
    {
      id: "subventii",
      title: "SUBVENȚII",
      tagline: language === "ro" ? "Fonduri Nerambursabile & Grants" : "Government Funding & Grant Intelligence",
      description:
        language === "ro"
          ? "Monitorizare programe europene, ghiduri de finanțare nerambursabilă și consultanță în atragerea de capital public."
          : "EU grant monitoring, non-reimbursable capital structuring, and official government subsidy intelligence.",
      url: "https://subventii.cristianvaduva.com",
      category: "Government Capital",
      icon: Layers,
      metrics: "€250M+ Monitored Grants",
      badge: "Government"
    },
    {
      id: "aixmedia",
      title: "AiX MEDIA",
      tagline: language === "ro" ? "Jurnalism Economic & Market Insights" : "Business & Market Intelligence Journalism",
      description:
        language === "ro"
          ? "Analize editoriale, rapoarte de piață și știri verificat din surse instituționale europene de prim rang."
          : "Editorial market research, macro sector analysis, and institutional business journalism.",
      url: "https://aixmedia.cristianvaduva.com",
      category: "Media & Reports",
      icon: FileText,
      metrics: "Knight Frank & Savills Data",
      badge: "Media"
    },
    {
      id: "health",
      title: "HEALTH",
      tagline: language === "ro" ? "Inteligență & Servicii de Sănătate" : "Health Intelligence & Corporate Wellness",
      description:
        language === "ro"
          ? "Monitorizare servicii medicale, abonamente corporate de sănătate și tehnologie de prevenție pentru executive management."
          : "Corporate healthcare intelligence, executive preventative wellness, and medical asset allocation.",
      url: "https://health.cristianvaduva.com",
      category: "Health & Life",
      icon: HeartPulse,
      metrics: "Verified Health Nodes",
      badge: "Health"
    }
  ];

  const categories = ["All", "Romania", "Europe", "Luxury", "Investment", "Commercial", "Interest Rates", "Construction"];

  const filteredNews =
    selectedCategory === "All"
      ? featuredNews
      : featuredNews.filter(
          (n) => n.category === selectedCategory || n.country === selectedCategory
        );

  // Apply real‑estate validation filter
  const realEstateNews = filteredNews.filter(isRealEstateArticle);

  return (
    <div className="bg-[#050505] text-[#F5F5F7] min-h-screen font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Bloomberg Style Live Intelligence Ticker Header */}
      <div className="border-b border-zinc-800/80 bg-[#0B0B0D]/90 backdrop-blur-md sticky top-0 z-40 text-xs font-mono py-2.5 px-4 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 whitespace-nowrap">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-widest text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AiX Terminal Live
            </span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300">
              IRCC 3M: <strong className="text-emerald-400">5.86%</strong>
            </span>
            <span className="text-zinc-300">
              ROBOR 3M: <strong className="text-emerald-400">5.58%</strong>
            </span>
            <span className="text-zinc-300">
              EUR/RON: <strong className="text-amber-400">4.9765</strong>
            </span>
            <span className="text-zinc-300">
              Prime Yield (BCH): <strong className="text-amber-400">6.85%</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">

          </div>
        </div>
      </div>

      {/* Hero Section — Minimal Bloom Light & Editorial Serif Headline */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft Ambient Light Bloom */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-amber-300/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono tracking-widest uppercase shadow-lg shadow-amber-500/5">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Ecosystem Operating System
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#F5F5F7] tracking-tight leading-[1.05]">
            Romania’s Private <br className="hidden sm:inline" />
            <span className="italic font-light text-amber-400">Intelligence</span> Platform
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#A1A1A6] font-sans font-light leading-relaxed">
            Real estate, finance, insurance, funding, health, and market intelligence unified into one private operating ecosystem.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#ecosystem-nodes"
              className="px-8 py-4 rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-all duration-300 flex items-center gap-2 shadow-2xl shadow-amber-500/20 group"
            >
              Explore Intelligence Ecosystem
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/contact"
              className="px-8 py-4 rounded-full border border-zinc-800 bg-zinc-950/80 text-[#F5F5F7] text-xs font-semibold hover:border-amber-500/40 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Private Consultation
            </Link>
          </div>

          {/* Quick Ecosystem Node Nav Tickers */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-left font-mono text-xs">
            {ecosystemNodes.map((node) => (
              <a
                key={node.id}
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-[#0B0B0D] border border-zinc-800/80 hover:border-amber-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">{node.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <span className="text-[10px] text-[#A1A1A6] block truncate">{node.badge}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Nodes Architecture Section */}
      <section id="ecosystem-nodes" className="py-20 border-t border-zinc-800/60 bg-[#050505] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Connected Domain Network
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#F5F5F7]">
                Unified Ecosystem Platforms
              </h2>
            </div>
            <p className="text-sm text-[#A1A1A6] max-w-md font-light">
              Direct access to dedicated specialized intelligence platforms operating across property, capital, protection, and corporate health.
            </p>
          </div>

          {/* Ecosystem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemNodes.map((node) => {
              const Icon = node.icon;
              return (
                <a
                  key={node.id}
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-3xl bg-[#0B0B0D] border border-zinc-800/80 p-8 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-all">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
                        {node.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-2xl text-[#F5F5F7] group-hover:text-amber-400 transition-colors">
                          {node.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <p className="text-xs font-mono text-amber-400/90">{node.tagline}</p>
                      <p className="text-sm text-[#A1A1A6] font-light leading-relaxed pt-2">
                        {node.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">{node.metrics}</span>
                    <span className="text-amber-400 group-hover:underline inline-flex items-center gap-1">
                      Access Platform <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Romania Property Report Showcase Section */}
      <section className="py-20 border-t border-zinc-800/60 bg-gradient-to-b from-[#0B0B0D] to-[#050505] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              Institutional Macro Research
            </div>

            <h2 className="font-display text-4xl sm:text-5xl text-[#F5F5F7] tracking-tight leading-tight">
              Romania Property Report <br />
              <span className="italic text-amber-400 font-light">— August 2026</span>
            </h2>

            <p className="text-base text-[#A1A1A6] font-light leading-relaxed">
              Comprehensive real estate market intelligence analyzing ANCPI transactions, Bucharest prime residential index curves, regional capital yield movements, and executive buyer guidance.
            </p>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-zinc-500 block mb-1">Prime Yield Average</span>
                <span className="text-xl text-amber-400 font-semibold">6.85%</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-zinc-500 block mb-1">Capital Volume (H1)</span>
                <span className="text-xl text-[#F5F5F7] font-semibold">€1.42 Billion</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/romania-property-report"
                className="px-8 py-3.5 rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10 inline-flex items-center gap-2"
              >
                Read Full Report
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl bg-zinc-950 border border-zinc-800 p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                AiX OS™ Executive Briefing
              </span>
              <span className="text-xs font-mono text-zinc-500">PDF & Web Edition</span>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl text-[#F5F5F7]">
                Key Real Estate Market Vectors
              </h3>
              <ul className="space-y-3 text-xs font-mono text-[#A1A1A6]">
                <li className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                  <span>1. Bucharest Prime Residential</span>
                  <span className="text-emerald-400">€2,450 / m² (+4.2%)</span>
                </li>
                <li className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                  <span>2. Cluj-Napoca Tech Hub</span>
                  <span className="text-emerald-400">€2,720 / m² (+3.8%)</span>
                </li>
                <li className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                  <span>3. CEE Logistics Yield Spread</span>
                  <span className="text-amber-400">+210 bps vs Eurozone</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0B0D] border border-amber-500/20 text-xs text-amber-300 font-mono flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Verified dataset sourced from ANCPI registers & Eurostat metrics.</span>
            </div>
          </div>
        </div>
      </section>

      {/* European Real Estate Intelligence Section */}
      <section className="py-20 border-t border-zinc-800/60 bg-[#050505] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                European Real Estate Intelligence
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#F5F5F7]">
                European Real Estate Intelligence
              </h2>
            </div>
            <p className="text-sm text-[#A1A1A6] max-w-md font-light">
              Verified property and housing intelligence from Romania and European markets.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-black border-amber-500 font-semibold"
                    : "bg-zinc-950 border-zinc-800 text-[#A1A1A6] hover:border-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {realEstateNews.length === 0 ? (
              <p className="text-center text-[#A1A1A6]">No verified real estate intelligence is currently available.</p>
            ) : (
              realEstateNews.map((article) => (
                <article
                  key={article.id}
                  className="rounded-3xl bg-[#0B0B0D] border border-zinc-800/80 p-6 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {article.source}
                      </span>
                      <span className="text-zinc-500">{article.category}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl text-[#F5F5F7] group-hover:text-amber-400 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-sm text-[#A1A1A6] font-light leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                    </span>
                    {article.articleUrl && (
                      <a
                        href={article.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline inline-flex items-center gap-1"
                      >
                        READ ORIGINAL <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-amber-400 font-bold tracking-wider">AiX OS™ Institutional Ecosystem</span>
            <p className="text-[#A1A1A6] font-sans text-xs">
              Unified private operating system by Cristian Văduva.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#A1A1A6]">
            <Link href="/romania-property-report" className="hover:text-amber-400 transition-colors">
              Property Report
            </Link>
            <Link href="/proprietati" className="hover:text-amber-400 transition-colors">
              Listings
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">
              Private Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
