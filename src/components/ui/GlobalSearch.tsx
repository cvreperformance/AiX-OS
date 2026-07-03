"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ArrowRight, Building, Sparkles, Newspaper, Activity, Compass, Globe } from "lucide-react";
import Link from "next/link";

interface SearchItem {
  title: string;
  category: "Property" | "Developer" | "City" | "AI Tool" | "News" | "Market Data";
  desc: string;
  href: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Properties
  { title: "Penthouse Floreasca Lake", category: "Property", desc: "Penthouse de lux cu vedere panoramică spre lacul Floreasca", href: "/proprietati/penthouse-floreasca-lake" },
  { title: "Vila Premium Pipera", category: "Property", desc: "Vilă cu design minimalist și piscină exterioară", href: "/proprietati/vila-premium-pipera" },
  { title: "Apartament Dorobanți Glass", category: "Property", desc: "Reședință ultra-luxoasă cu fațadă integrală din sticlă", href: "/proprietati/apartament-dorobanti-glass" },
  
  // Developers
  { title: "One United Properties", category: "Developer", desc: "Liderul dezvoltărilor imobiliare verzi premium din România", href: "/dezvoltatori/one-united-properties" },
  { title: "Emaar Properties", category: "Developer", desc: "Constructorul Burj Khalifa și Downtown Dubai", href: "/dezvoltatori/emaar-properties" },
  { title: "Pastor Group Monaco", category: "Developer", desc: "Proprietăți ultraluxoase exclusive în Monte-Carlo", href: "/dezvoltatori/pastor-group" },
  { title: "DAMAC Properties", category: "Developer", desc: "Reședințe de marcă în colaborare cu case de modă", href: "/dezvoltatori/damac-properties" },

  // Cities
  { title: "București", category: "City", desc: "Capitala României, oportunități cu yield ridicat", href: "/map" },
  { title: "Monaco", category: "City", desc: "Safe haven absolut pentru capitaluri HNWI", href: "/map" },
  { title: "Dubai", category: "City", desc: "Metropolă globală cu randamente ridicate din chirii", href: "/map" },

  // AI Tools
  { title: "Money Advisor", category: "AI Tool", desc: "Consilier financiar personal pentru strategii de investiție", href: "/money-advisor" },
  { title: "AntiȚeapă AI", category: "AI Tool", desc: "Due diligence digital și scanare riscuri imobiliare", href: "/anti-teapa" },
  { title: "AI Valuation", category: "AI Tool", desc: "Evaluare instantă a valorii corecte pe metru pătrat", href: "/valuation" },
  { title: "Property Scanner", category: "AI Tool", desc: "Scanare și filtrare a ofertelor externe sub prețul pieței", href: "/proprietati" },

  // News
  { title: "Creșterea tranzacțiilor de lux", category: "News", desc: "Analiză imobiliară premium pe trimestrul 1 2026", href: "/stiri" },
  { title: "Dezvoltări sustenabile în Europa", category: "News", desc: "Standardele verzi devin obligatorii pentru activele premium", href: "/stiri" },

  // Market Data
  { title: "Stocks Market Pulse", category: "Market Data", desc: "Urmărește indicii S&P 500, Nasdaq și Dow", href: "/market" },
  { title: "Crypto Bitcoin (BTC)", category: "Market Data", desc: "Cotații Bitcoin, Ethereum și Solana alimentate live", href: "/market" },
  { title: "Preț Aur Spot (Gold)", category: "Market Data", desc: "Preț spot mărfuri și aur", href: "/market" },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.desc.toLowerCase().includes(lower)
    );
  }, [query]);

  const categoryIcons = {
    Property: Building,
    Developer: Compass,
    City: Globe,
    "AI Tool": Sparkles,
    News: Newspaper,
    "Market Data": Activity,
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-45">
      {/* Search Input Bar */}
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
        focused
          ? "border-amber-500/40 bg-zinc-950 shadow-lg shadow-amber-500/[0.03]"
          : "border-zinc-800 bg-[#080808]/75"
      }`}>
        <Search className="h-5 w-5 text-zinc-500 flex-shrink-0 animate-pulse" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Caută proprietăți, dezvoltatori, orașe, indici bursieri sau instrumente AI..."
          className="bg-transparent text-sm text-white placeholder-zinc-500 w-full focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-zinc-500 hover:text-white uppercase font-mono font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Dropdown Results Box */}
      {focused && (
        <div className={`absolute top-full inset-x-0 mt-2.5 rounded-2xl border border-zinc-850 bg-[#080808]/95 backdrop-blur-2xl shadow-2xl p-3 space-y-1 max-h-[360px] overflow-y-auto ${
          query ? "animate-in fade-in slide-in-from-top-2 duration-150" : ""
        }`}>
          {results.length > 0 ? (
            results.map((item) => {
              const IconComponent = categoryIcons[item.category] || Globe;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setFocused(false)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-transparent hover:border-zinc-850 hover:bg-zinc-900/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-2 text-zinc-400 group-hover:text-amber-400 group-hover:border-amber-500/20 transition-all flex-shrink-0">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-500 uppercase tracking-widest font-mono bg-zinc-900/40">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-650 group-hover:text-amber-500 group-hover:translate-x-1.5 transition-all flex-shrink-0" />
                </Link>
              );
            })
          ) : query ? (
            <div className="py-8 text-center text-xs text-zinc-550 flex flex-col gap-1.5 items-center">
              <Sparkles className="h-5 w-5 text-amber-500/40 animate-bounce" />
              <span>Nu am găsit rezultate pentru &ldquo;{query}&rdquo;. Încercați cu alte cuvinte cheie.</span>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <p className="text-[8.5px] uppercase tracking-wider text-zinc-600 font-semibold font-mono">Căutări populare</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "One United", href: "/dezvoltatori/one-united-properties" },
                  { label: "Penthouse", href: "/proprietati" },
                  { label: "Money Advisor", href: "/money-advisor" },
                  { label: "Dubai", href: "/map" },
                  { label: "Monaco", href: "/map" },
                  { label: "Preț Aur", href: "/market" },
                ].map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    onClick={() => setFocused(false)}
                    className="text-[10px] px-3 py-1.5 rounded-lg border border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all bg-zinc-900/20"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
