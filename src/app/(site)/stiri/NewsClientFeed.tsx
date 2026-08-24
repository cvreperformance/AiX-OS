"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { RealEstateNewsArticle } from "@/lib/news-engine/types";
import {
  Radio,
  Search,
  ExternalLink,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  Tag,
  ChevronRight,
  ArrowUpRight,
  Filter,
  Sparkles,
} from "lucide-react";

interface Props {
  initialArticles: RealEstateNewsArticle[];
  marketPulse: {
    label: string;
    score: number;
    description: string;
    emoji: string;
    color: string;
  };
}

const CATEGORIES = [
  "Toate",
  "MARKET",
  "PRICES",
  "RESIDENTIAL",
  "LUXURY",
  "INVESTMENT",
  "DEVELOPERS",
  "TAX",
  "URBANISM",
  "MORTGAGES",
  "MACROECONOMICS",
];

export function NewsClientFeed({ initialArticles, marketPulse }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toate");

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((art) => {
      const matchesCategory =
        selectedCategory === "Toate" ||
        art.category.toUpperCase() === selectedCategory.toUpperCase();
      const matchesSearch =
        !searchQuery ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.summary && art.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        art.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.city && art.city.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  const leadStory = filteredArticles[0] || initialArticles[0];
  const secondaryStories = filteredArticles.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
      {/* Top Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400">
              REAL ESTATE INTELLIGENCE · LIVE
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Ultima actualizare: ACUM
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white">
            Piața Imobiliară în Timp Real
          </h1>
          <p className="text-base text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Analize economice, tranzacții și tendințe verificate din surse oficiale și publicații financiare de top. Evaluare automată prin AiX Score.
          </p>
        </div>

        {/* Live Search */}
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Caută știre, locație, dezvoltator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-amber-500/60 focus:outline-none backdrop-blur-md transition-all"
          />
        </div>
      </div>

      {/* Market Pulse Banner */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all pointer-events-none"></div>

        <div className="flex items-start sm:items-center gap-5">
          <div className="text-4xl p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex-shrink-0">
            {marketPulse.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                INDICATOR DE PIAȚĂ ROMÂNIA
              </span>
              <span className="text-xs text-zinc-400">· 2026</span>
            </div>
            <p className={`text-2xl font-semibold ${marketPulse.color}`}>
              {marketPulse.label}
            </p>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl font-light leading-relaxed">
              {marketPulse.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-8 flex-shrink-0">
          <div className="text-center">
            <span className="text-3xl font-light text-white font-mono">{marketPulse.score}</span>
            <span className="text-xs text-zinc-400 block mt-0.5">/ 100 AiX Pulse</span>
          </div>
          <Link
            href="/market"
            className="rounded-full bg-amber-500/10 border border-amber-500/30 px-5 py-2.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-all whitespace-nowrap"
          >
            Indicatori BNR & INS →
          </Link>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800/60">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? "border-amber-500/60 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-white"
            }`}
          >
            {cat === "Toate" ? "Toate Știrile" : cat}
          </button>
        ))}
      </div>

      {/* Main Editorial Content Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-zinc-800/80 bg-zinc-900/30">
          <p className="text-zinc-400 text-lg font-light">Nu am găsit știri pentru filtrul selectat.</p>
          <button
            onClick={() => {
              setSelectedCategory("Toate");
              setSearchQuery("");
            }}
            className="mt-4 rounded-full border border-amber-500/40 px-6 py-2 text-xs text-amber-400 hover:bg-amber-500/10 transition-all"
          >
            Resetează Filtrele
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* LEAD HERO ARTICLE */}
          {leadStory && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 overflow-hidden backdrop-blur-xl hover:border-zinc-700 transition-all group">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[440px] overflow-hidden bg-zinc-950">
                  <img
                    src={leadStory.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
                    alt={leadStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="rounded-full bg-amber-500/90 text-black px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                      {leadStory.category}
                    </span>
                    {leadStory.is_breaking && (
                      <span className="rounded-full bg-red-500/90 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider animate-pulse">
                        BREAKING
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 font-medium text-amber-400">
                        <ShieldCheck className="h-4 w-4" />
                        {leadStory.source_name}
                      </span>
                      <span>
                        {new Date(leadStory.published_at).toLocaleDateString("ro-RO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <Link href={`/stiri/${leadStory.slug}`}>
                      <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white group-hover:text-amber-400 transition-colors leading-snug">
                        {leadStory.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-zinc-400 line-clamp-4 font-light leading-relaxed whitespace-pre-line">
                      {leadStory.summary || leadStory.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">AiX Score:</span>
                      <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-sm font-bold text-amber-400">
                        {leadStory.aix_score ? leadStory.aix_score.toFixed(1) : "8.5"}
                      </span>
                    </div>

                    <Link
                      href={`/stiri/${leadStory.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white group-hover:text-amber-400 transition-colors"
                    >
                      <span>Citește Analiza Completă</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REAL ESTATE MARKET NOW — INTELLIGENCE PANEL */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-light text-white tracking-tight uppercase tracking-wider text-xs font-semibold text-zinc-400">
                REAL ESTATE MARKET NOW · INTELLIGENCE PULSE
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">Preț Mediu București</p>
                <p className="text-2xl font-light text-amber-400 font-mono">€2.653 / mp</p>
                <p className="text-xs text-zinc-400 mt-1">Apartamente vechi vs €2.099 noi (+27% ecart TVA)</p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">ROBOR 3M · BNR</p>
                <p className="text-2xl font-light text-emerald-400 font-mono">6.85%</p>
                <p className="text-xs text-zinc-400 mt-1">Tendință descendentă aliniată la deciziile BCE</p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">Randament Mediu Chirie</p>
                <p className="text-2xl font-light text-white font-mono">6.2% net / an</p>
                <p className="text-xs text-zinc-400 mt-1">Zone cheie: Herăstrău, Floreasca, Timpuri Noi</p>
              </div>
            </div>
          </div>

          {/* SECONDARY STORIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryStories.map((story) => (
              <article
                key={story.id || story.slug}
                className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all hover:-translate-y-1 duration-300 group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    <img
                      src={story.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-amber-400 uppercase tracking-wider">
                        {story.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="rounded-lg bg-zinc-950/90 border border-zinc-800 px-2 py-0.5 text-xs font-bold text-amber-400 font-mono">
                        Score: {story.aix_score ? story.aix_score.toFixed(1) : "8.0"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-medium text-zinc-300">{story.source_name}</span>
                      <span>
                        {new Date(story.published_at).toLocaleDateString("ro-RO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <Link href={`/stiri/${story.slug}`}>
                      <h3 className="text-lg font-light tracking-tight text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {story.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-zinc-400 line-clamp-3 font-light leading-relaxed">
                      {story.summary || story.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-zinc-800/40 flex items-center justify-between">
                  <a
                    href={story.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    <span>Sursă originală</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <Link
                    href={`/stiri/${story.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Detalii</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
