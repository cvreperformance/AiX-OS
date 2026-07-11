"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  Star,
  BookOpen,
  ExternalLink,
  ChevronRight,
  User,
  Tag,
  Filter,
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  BOOKS,
  CATEGORY_LABELS,
  type Book,
  type BookCategory,
} from "@/lib/books";
import { useLanguage } from "@/context/LanguageContext";
import type { Metadata } from "next";

// Note: metadata must be in a server component, but since this is "use client",
// we export it as a named constant and rely on layout-level metadata.
// The route's metadata is defined in layout or via a companion server component.

// ─── Category colour map ─────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<BookCategory, string> = {
  "real-estate":   "text-amber-400  bg-amber-500/10  border-amber-500/20",
  investments:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  finance:         "text-blue-400   bg-blue-500/10   border-blue-500/20",
  wealth:          "text-violet-400 bg-violet-500/10 border-violet-500/20",
  business:        "text-orange-400 bg-orange-500/10 border-orange-500/20",
  ai:              "text-cyan-400   bg-cyan-500/10   border-cyan-500/20",
  technology:      "text-sky-400    bg-sky-500/10    border-sky-500/20",
  cybersecurity:   "text-red-400    bg-red-500/10    border-red-500/20",
  psychology:      "text-pink-400   bg-pink-500/10   border-pink-500/20",
  negotiation:     "text-teal-400   bg-teal-500/10   border-teal-500/20",
  leadership:      "text-amber-300  bg-amber-500/10  border-amber-500/20",
  history:         "text-zinc-600   bg-zinc-500/10   border-zinc-500/20",
  economics:       "text-lime-400   bg-lime-500/10   border-lime-500/20",
  luxury:          "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};


type SelectedCategory = "all" | BookCategory;

// ─── Book Card ────────────────────────────────────────────────────────────────
function BookCard({ book }: { book: Book }) {
  const { language } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const colorCls = CATEGORY_COLOR[book.category];

  return (
    <div
      className={`group relative flex flex-col rounded-3xl overflow-hidden ${designSystem.glass} ${designSystem.glassHover} transition-all duration-300`}
    >
      {/* Top glow line */}
      <div className={designSystem.glowTop} />

      {/* Cover Image */}
      <div className="relative h-52 sm:h-60 w-full bg-zinc-50/70 flex items-center justify-center overflow-hidden shrink-0">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={`Coperta ${book.title}`}
            onError={() => setImgError(true)}
            className="h-full w-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-zinc-700">
            <BookOpen className="h-12 w-12" />
            <span className="text-[10px] font-mono uppercase tracking-widest">No Cover</span>
          </div>
        )}

        {/* AiX Score badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/70 backdrop-blur-md border border-amber-500/25 rounded-xl px-2.5 py-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-mono font-bold text-amber-400">{book.aixScore}</span>
        </div>

        {/* Category badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 border rounded-xl px-2.5 py-1 backdrop-blur-md bg-white/60 ${colorCls}`}>
          <span className="text-[9px] font-mono font-semibold uppercase tracking-wider">
            {CATEGORY_LABELS[book.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Title & Author */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
            {book.title}
          </h3>
          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <User className="h-3 w-3 text-zinc-600 shrink-0" />
            {book.author} · {book.year}
          </p>
        </div>

        {/* Summary */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 flex-1">
          {book.summary}
        </p>

        {/* Why Read (AiX Recommendation) */}
        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-3 space-y-1">
          <p className="text-[9px] uppercase tracking-widest font-mono text-amber-500/80 font-semibold">
            {language === "ro" ? "De ce o recomandăm" : "Why We Recommend It"}
          </p>
          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">
            {book.whyRead}
          </p>
        </div>

        {/* Footer CTA */}
        <div className="pt-2 border-t border-zinc-200/60">
          <a
            href={book.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors group/link"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover/link:text-amber-500 transition-colors" />
              {language === "ro" ? "Cumpără / Află mai multe" : "Buy / Learn More"}
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover/link:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BooksPage() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>("all");
  const [showFilters, setShowFilters] = useState(false);

  const allCategories = useMemo(
    () => [...new Set(BOOKS.map((b) => b.category))].sort() as BookCategory[],
    []
  );

  const dynamicStats = [
    { value: `${BOOKS.length}+`, label: language === "ro" ? "Cărți Curate" : "Curated Books" },
    { value: `${allCategories.length}`, label: language === "ro" ? "Categorii" : "Categories" },
    { value: "9.2", label: language === "ro" ? "Scor Mediu AiX" : "Avg AiX Score" },
    { value: "100%", label: language === "ro" ? "Verificate" : "Verified" },
  ];

  const filtered = useMemo(() => {
    let list = BOOKS;
    if (selectedCategory !== "all") {
      list = list.filter((b) => b.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          CATEGORY_LABELS[b.category].toLowerCase().includes(q)
      );
    }
    // Sort by score desc
    return [...list].sort((a, b) => b.aixScore - a.aixScore);
  }, [query, selectedCategory]);

  const totalByCategory = useMemo(() => {
    const map: Partial<Record<SelectedCategory, number>> = { all: BOOKS.length };
    allCategories.forEach((c) => {
      map[c] = BOOKS.filter((b) => b.category === c).length;
    });
    return map;
  }, [allCategories]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-14 animate-in">

      {/* Header */}
      <PageHeader
        badge={language === "ro" ? "Biblioteca AiX Wealth" : "AiX Wealth Library"}
        title={language === "ro" ? "Cărți Recomandate de AiX OS™" : "Recommended by AiX OS™"}
        subtitle={language === "ro" 
          ? "Biblioteca de elită curatoriată de consilierii AiX. Cărți fundamentale despre imobiliare, investiții, psihologie, AI, negociere și lifestyle HNWI."
          : "Core reading material recommended by our advisors: real estate, market intelligence, psychology, negotiation, and leadership."}
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {dynamicStats.map((s) => (
          <div
            key={s.label}
            className={`relative rounded-2xl ${designSystem.glass} p-4 text-center overflow-hidden`}
          >
            <div className={designSystem.glowTop} />
            <p className="text-xl font-light text-amber-400 font-mono">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === "ro" ? "Caută după titlu, autor sau categorie…" : "Search by title, author, or category…"}
              className="w-full rounded-2xl border border-zinc-200 bg-white/60 py-3 pl-11 pr-11 text-sm text-zinc-900 placeholder-zinc-500 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 backdrop-blur-sm transition-colors"
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

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
              showFilters || selectedCategory !== "all"
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-zinc-200 bg-white/60 text-zinc-400"
            }`}
          >
            <Filter className="h-4 w-4" />
            {selectedCategory !== "all" ? CATEGORY_LABELS[selectedCategory as BookCategory] : "Filter"}
          </button>
        </div>

        {/* Category pills — always visible on desktop, togglable on mobile */}
        <div className={`flex flex-wrap gap-2 ${showFilters ? "flex" : "hidden md:flex"}`}>
          {/* All */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all ${
              selectedCategory === "all"
                ? "border-amber-500 bg-amber-500 text-black"
                : "border-zinc-200 bg-white/40 text-zinc-400 hover:border-zinc-300 hover:text-zinc-900"
            }`}
          >
            Toate
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[8px] font-mono">
              {totalByCategory["all"]}
            </span>
          </button>

          {allCategories.map((cat) => {
            const active = selectedCategory === cat;
            const colorParts = CATEGORY_COLOR[cat].split(" ");
            const textColor = colorParts[0];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? `border-amber-500 bg-amber-500 text-black`
                    : `border-zinc-200 bg-white/40 text-zinc-400 hover:border-zinc-300 hover:text-zinc-900`
                }`}
              >
                <span className={active ? "" : textColor}>
                  {CATEGORY_LABELS[cat]}
                </span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[8px] font-mono">
                  {totalByCategory[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-400">
            {filtered.length === 0
              ? "Nicio carte găsită"
              : `${filtered.length} ${filtered.length === 1 ? "carte găsită" : "cărți găsite"}`}
            {selectedCategory !== "all" && (
              <span className="text-amber-500 ml-1">· {CATEGORY_LABELS[selectedCategory as BookCategory]}</span>
            )}
          </p>
          {(query || selectedCategory !== "all") && (
            <button
              onClick={() => { setQuery(""); setSelectedCategory("all"); }}
              className="text-[10px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors font-mono uppercase tracking-wider"
            >
              <X className="h-3 w-3" />
              Resetează
            </button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className={`py-20 rounded-3xl ${designSystem.glass} flex flex-col items-center justify-center gap-4 text-center`}>
          <BookOpen className="h-10 w-10 text-zinc-700" />
          <div>
            <p className="text-sm font-semibold text-zinc-900">Nicio carte nu corespunde filtrelor</p>
            <p className="text-xs text-zinc-400 mt-1">Încearcă o altă categorie sau modifică căutarea.</p>
          </div>
          <button
            onClick={() => { setQuery(""); setSelectedCategory("all"); }}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-900 hover:border-amber-500/30 transition-all"
          >
            Resetează filtrele
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className={`p-8 sm:p-10 rounded-3xl border border-amber-500/20 bg-white/70 backdrop-blur-xl text-center space-y-5 relative overflow-hidden`}>
        <div className="absolute -right-20 -top-20 w-44 h-44 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
        <BookOpen className="h-7 w-7 text-amber-500/40 mx-auto" />
        <div>
          <h2 className="text-xl sm:text-2xl font-light text-zinc-900">
            Recomandă o Carte
          </h2>
          <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            Ai citit o carte care ți-a schimbat perspectiva financiară? Trimite-ne sugestia — consilierii AiX o vor evalua pentru a fi inclusă în bibliotecă.
          </p>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
          className="rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
        >
          Trimite Sugestie
        </button>
      </div>

    </div>
  );
}
