"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowUpRight, Search, X, Sparkles } from "lucide-react";
import { ALL_SERVICES_REGISTRY, type ServiceItem } from "@/config/services.config";
import { navigationCategories } from "@/config/navigation.config";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORY_BG: Record<string, string> = {
  "buy-sell":        "bg-blue-500/10 border-blue-500/20 text-blue-400",
  "invest-protect":  "bg-rose-500/10 border-rose-500/20 text-rose-400",
  "learn-research":  "bg-amber-500/10 border-amber-500/20 text-amber-400",
  "tools":           "bg-teal-500/10 border-teal-500/20 text-teal-400",
  "ai-system":       "bg-violet-500/10 border-violet-500/20 text-violet-400",
  "luxury-travel":   "bg-sky-500/10 border-sky-500/20 text-sky-400",
};

export default function ServicesDirectoryClient() {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const q = query.toLowerCase().trim();

  // Filter categories and their nested services dynamically
  const filteredCategories = useMemo(() => {
    return navigationCategories
      .map((cat) => {
        // Filter elements in this category by query
        const filteredItems = cat.items.filter((item) => {
          const matchesQuery =
            item.label.toLowerCase().includes(q) ||
            item.labelEn.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.descEn.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.toLowerCase().includes(q));
          return matchesQuery;
        });

        return {
          ...cat,
          items: filteredItems,
        };
      })
      .filter((cat) => {
        // If a specific category filter is chosen, match the ID
        if (selectedCategory && cat.id !== selectedCategory) {
          return false;
        }
        return cat.items.length > 0;
      });
  }, [q, selectedCategory]);

  const totalVisible = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-12 animate-in text-left">
      
      {/* Page Header */}
      <section className="space-y-4 max-w-3xl">
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 border border-amber-500/20 rounded-full px-4 py-1.5 bg-amber-500/5">
          AiX OS &bull; Directory
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight tracking-tight">
          {language === "ro" ? "Centrul de Servicii" : "System Control Hub"}
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
          {language === "ro"
            ? "Catalogul complet de servicii AiX OS. Accesează direct orice modul decizional: imobiliare premium, transport VIP, indicatori macro și asistenți AI."
            : "Central directory catalog. Route directly to any sandboxed decision module: premium real estate, VIP transport, macro indicators, or AI advisors."}
        </p>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-zinc-900/60 max-w-xl">
          {[
            { value: ALL_SERVICES_REGISTRY.length.toString(), label: language === "ro" ? "Servicii active" : "Services Registered" },
            { value: navigationCategories.length.toString(), label: language === "ro" ? "Categorii" : "Categories" },
            { value: "Instant", label: "Latency" },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-amber-400 font-mono">{stat.value}</span>
              <span className="text-[10px] text-zinc-550 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Control panel: Category filters */}
      <div className="space-y-4 max-w-4xl">

        {/* Category Pills Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-xl border text-[10.5px] font-semibold transition-all ${
              selectedCategory === null
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-zinc-850 bg-zinc-950/20 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            {language === "ro" ? "Toate" : "All Categories"}
          </button>
          {navigationCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const title = language === "ro" ? cat.title : cat.titleEn;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl border text-[10.5px] font-semibold transition-all ${
                  isActive
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-zinc-850 bg-zinc-950/20 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter status */}
      {q && (
        <p className="text-[11px] text-zinc-500">
          {language === "ro"
            ? `Am găsit ${totalVisible} servicii potrivite cu "${query}"`
            : `Found ${totalVisible} modules matching query "${query}"`}
        </p>
      )}

      {/* Grouped Category Grids with Visual Cards */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-12">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const title = language === "ro" ? category.title : category.titleEn;
            const bgClass = CATEGORY_BG[category.id] ?? "bg-zinc-800/10 border-zinc-800/20 text-zinc-400";

            return (
              <div key={category.id} className="space-y-4">
                {/* Section title */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${bgClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xs uppercase font-bold tracking-widest text-white font-mono">{title}</h2>
                    <p className="text-[10px] text-zinc-550 font-medium">
                      {category.items.length} {category.items.length === 1 ? "modul" : "module"}
                    </p>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    const label = language === "ro" ? item.label : item.labelEn;
                    const desc = language === "ro" ? item.desc : item.descEn;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="group flex flex-col justify-between p-5 rounded-2xl border border-zinc-850 bg-zinc-950/20 hover:border-amber-500/20 hover:bg-amber-500/[0.01] transition-all duration-200"
                      >
                        <div className="space-y-3">
                          <div className="p-2 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-500 group-hover:text-amber-400 group-hover:border-amber-500/10 w-fit transition-colors">
                            <ItemIcon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors block">
                              {label}
                            </span>
                            <p className="text-[10.5px] text-zinc-500 leading-relaxed mt-1 line-clamp-3">
                              {desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-zinc-550 group-hover:text-amber-400 transition-colors mt-5 pt-3 border-t border-zinc-900/60">
                          <span>{language === "ro" ? item.actionLabel || "Deschide" : item.actionLabelEn || "Open"}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-zinc-550 border border-dashed border-zinc-800 rounded-3xl space-y-2 max-w-xl">
          <p className="font-semibold text-white">Nu am găsit servicii potrivite</p>
          <p>Reîncearcă folosind alți termeni sau resetează filtrul de căutare.</p>
          <button
            onClick={() => {
              setQuery("");
              setSelectedCategory(null);
            }}
            className="text-amber-400 font-bold hover:underline pt-2 block mx-auto text-[10px] uppercase tracking-wider"
          >
            Resetează filtrele
          </button>
        </div>
      )}
    </div>
  );
}
