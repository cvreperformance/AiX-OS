"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui";
import { BookOpen, User, Tag, Award, Sparkles, Star } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  category: "real estate" | "investing" | "psychology of money" | "wealth building";
  summary: string;
  relevance: number;
}

const BOOKS: Book[] = [
  {
    id: "b1",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    category: "investing",
    summary: "Reperul clasic al investițiilor în valoare (value investing). Învață investitorii cum să evite erorile fundamentale și să construiască strategii pe termen lung bazate pe siguranță.",
    relevance: 9.8,
  },
  {
    id: "b2",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "psychology of money",
    summary: "Explorează relația psihologică complexă pe care oamenii o au cu banii, demonstrând că deciziile financiare bune depind mai mult de comportament decât de inteligență sau IQ.",
    relevance: 9.6,
  },
  {
    id: "b3",
    title: "Real Estate Riches",
    author: "Dolf de Roos",
    category: "real estate",
    summary: "Prezintă de ce investițiile imobiliare sunt unele dintre cele mai sigure căi spre independență financiară și cum să identifici proprietăți cu cashflow pozitiv garantat.",
    relevance: 9.2,
  },
  {
    id: "b4",
    title: "The Millionaire Real Estate Investor",
    author: "Gary Keller",
    category: "real estate",
    summary: "Un ghid extrem de structurat care demistifică miturile despre investițiile imobiliare și prezintă modelele financiare exacte pentru a construi un portofoliu imobiliar masiv.",
    relevance: 9.5,
  },
  {
    id: "b5",
    title: "Principles: Life and Work",
    author: "Ray Dalio",
    category: "investing",
    summary: "Fondatorul Bridgewater Associates își împărtășește principiile unice de management și investiții, bazate pe meritocrație radicală și analiză istorică macro-economică.",
    relevance: 9.4,
  },
  {
    id: "b6",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "wealth building",
    summary: "O introducere fundamentală în educația financiară, evidențiind diferența dintre active și pasive și importanța construirii de fluxuri de venit pasiv recurente.",
    relevance: 8.9,
  },
  {
    id: "b7",
    title: "The Almanac of Naval Ravikant",
    author: "Eric Jorgenson",
    category: "wealth building",
    summary: "O culegere excelentă de eseuri și gânduri ale lui Naval Ravikant despre bogăție, fericire și modul de a folosi levierul (leverage) tehnologic și de capital pentru a obține libertatea.",
    relevance: 9.7,
  },
];

export default function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "real estate" | "investing" | "psychology of money" | "wealth building">("all");

  const filteredBooks = useMemo(() => {
    if (selectedCategory === "all") return BOOKS;
    return BOOKS.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

  const categories = [
    { key: "all", label: "Toate Cărțile" },
    { key: "real estate", label: "Imobiliare" },
    { key: "investing", label: "Investiții" },
    { key: "psychology of money", label: "Psihologia Banilor" },
    { key: "wealth building", label: "Creare Avere" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-12 animate-in">
      <PageHeader
        badge="Wealth Library"
        title="Cărți Recomandate de Investiții"
        subtitle="Biblioteca de elită recomandată de consilierii AiX. Cărți fundamentale despre imobiliare, economie și psihologia comportamentală."
      />

      {/* Category selector pills */}
      <div className="flex flex-wrap gap-2.5 bg-zinc-950/60 p-2 rounded-2xl border border-zinc-850 max-w-fit mx-auto justify-center">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key as any)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all ${
              selectedCategory === cat.key
                ? "bg-amber-500 text-black border-amber-500 shadow-md"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-zinc-850 bg-zinc-950/60 p-6 hover:border-amber-500/35 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 backdrop-blur-xl overflow-hidden"
          >
            {/* Visual Top Glow */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/30 via-amber-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-2.5 text-amber-500/85">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 bg-amber-500/5 border border-amber-500/20 px-2 py-1 rounded-lg text-amber-400 font-mono text-[10px] font-bold">
                  <Star className="h-3 w-3 fill-current" />
                  Score: {book.relevance}
                </div>
              </div>

              {/* Title & Author */}
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1 font-medium">
                  <User className="h-3.5 w-3.5 text-zinc-650" />
                  de {book.author}
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs text-zinc-400 leading-relaxed min-h-[64px]">
                {book.summary}
              </p>
            </div>

            {/* Footer Category Tag */}
            <div className="mt-6 pt-3.5 border-t border-zinc-900/60 flex items-center justify-between text-[9px] uppercase tracking-widest text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {book.category}
              </span>
              <span className="text-zinc-600">Recomandat de AiX</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
