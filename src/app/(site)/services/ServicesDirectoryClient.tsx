"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { SERVICES_DIRECTORY, ALL_SERVICES, type ServiceCategory } from "@/lib/services";
import { designSystem } from "@/styles/designSystem";

const CATEGORY_BG: Record<string, string> = {
  ai:                 "bg-violet-500/10 border-violet-500/20",
  "real-estate":      "bg-blue-500/10   border-blue-500/20",
  "market-intelligence": "bg-emerald-500/10 border-emerald-500/20",
  investments:        "bg-amber-500/10  border-amber-500/20",
  insurance:          "bg-rose-500/10   border-rose-500/20",
  "ro-law":           "bg-indigo-500/10 border-indigo-500/20",
  technology:         "bg-sky-500/10    border-sky-500/20",
  cybersecurity:      "bg-red-500/10    border-red-500/20",
  luxury:             "bg-yellow-500/10 border-yellow-500/20",
  education:          "bg-orange-500/10 border-orange-500/20",
  tools:              "bg-zinc-700/20   border-zinc-600/20",
  resources:          "bg-teal-500/10   border-teal-500/20",
};

function ServiceCard({ item, categoryColor }: { item: { href: string; label: string; desc: string; icon: React.ElementType }; categoryColor: string }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`group flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200 hover:border-amber-500/30 hover:bg-amber-500/3 ${designSystem.glass}`}
    >
      <div className={`flex-shrink-0 mt-0.5 rounded-lg p-2 border border-zinc-800/60 bg-zinc-900/60 ${categoryColor} transition-colors group-hover:border-amber-500/30`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors leading-snug">{item.label}</p>
        <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5 line-clamp-2">{item.desc}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
    </Link>
  );
}

function CategorySection({ category }: { category: ServiceCategory }) {
  const Icon = category.icon;
  const bgClass = CATEGORY_BG[category.id] ?? "bg-zinc-800/20 border-zinc-700/20";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl border ${bgClass}`}>
          <Icon className={`h-5 w-5 ${category.color}`} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">{category.title}</h2>
          <p className="text-[10px] text-zinc-500">{category.items.length} {category.items.length === 1 ? "service" : "services"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {category.items.map((item) => (
          <ServiceCard key={item.href} item={item} categoryColor={category.color} />
        ))}
      </div>
    </div>
  );
}

export default function ServicesDirectoryClient() {
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const filteredCategories = q
    ? SERVICES_DIRECTORY.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            cat.title.toLowerCase().includes(q)
        ),
      })).filter((cat) => cat.items.length > 0)
    : SERVICES_DIRECTORY;

  const totalVisible = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-14 animate-in">
      {/* Header */}
      <section className="space-y-5 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS · Complete Services Directory
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight tracking-tight">
          Everything AiX OS{" "}
          <span className="gradient-gold">offers.</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
          One platform. Twelve domains. Over {ALL_SERVICES.length} intelligent services covering real estate, investments, AI, cybersecurity, luxury, law, and everything in between.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 pt-2">
          {[
            { value: ALL_SERVICES.length.toString(), label: "Total Services" },
            { value: SERVICES_DIRECTORY.length.toString(), label: "Categories" },
            { value: "24/7", label: "AI Availability" },
            { value: "100%", label: "Free to Explore" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              <span className="text-xl font-light text-amber-400 font-mono">{stat.value}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Search */}
      <div className="max-w-xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, categories, features…"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 py-3 pl-11 pr-10 text-sm text-white placeholder-zinc-500 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-colors backdrop-blur-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results count when filtering */}
      {q && (
        <p className="text-xs text-zinc-500 -mt-8">
          Found <span className="text-amber-400 font-semibold">{totalVisible}</span> services matching &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Category Sections */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-14">
          {filteredCategories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className={`py-20 rounded-3xl ${designSystem.glass} flex flex-col items-center justify-center gap-4 text-center`}>
          <Search className="h-10 w-10 text-zinc-700" />
          <div>
            <p className="text-sm font-semibold text-white">No services found</p>
            <p className="text-xs text-zinc-500 mt-1">Try a different search term or browse by category below.</p>
          </div>
          <button
            onClick={() => setQuery("")}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-xs text-zinc-400 hover:text-white hover:border-amber-500/30 transition-all"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="rounded-3xl border border-amber-500/20 bg-[#080808]/70 backdrop-blur-xl p-10 text-center space-y-5 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-violet-500/5 blur-3xl rounded-full pointer-events-none" />
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80">Don&apos;t know where to start?</p>
        <h2 className="text-2xl md:text-3xl font-light text-white">
          Talk to an AiX advisor.
        </h2>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
          One conversation. We&apos;ll point you to the exact services that save you time, money and risk.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
            className="rounded-xl bg-amber-500 text-black px-8 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/15"
          >
            Start a Conversation
          </button>
          <Link
            href="/money-advisor"
            className="rounded-xl border border-zinc-700 text-zinc-300 px-8 py-3 text-xs font-semibold uppercase tracking-wider hover:border-amber-500/40 hover:text-white transition-all"
          >
            Try AI Advisor
          </Link>
        </div>
      </div>
    </div>
  );
}
