"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ArrowRight, Sparkles, Command, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { querySearchIndex, type IndexItem } from "@/lib/searchIndex";
import { useLanguage } from "@/context/LanguageContext";

export function GlobalSearch() {
  const { language } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Fetch index items matching query
  const results = useMemo(() => {
    return querySearchIndex(query);
  }, [query]);

  // Group items by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, IndexItem[]> = {};
    results.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [results]);

  // Flattened items in rendered order for keyboard navigation indexing
  const flatRenderedItems = useMemo(() => {
    return Object.values(groupedResults).flat();
  }, [groupedResults]);

  // Reset active index when query or focus changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query, focused]);

  // Handle keyboard events (Cmd+K, Escape, ArrowDown, ArrowUp, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Focus via Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
        return;
      }

      // Close on Escape
      if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
        return;
      }

      if (!focused) return;

      // Handle arrow keys & enter for item navigation
      if (flatRenderedItems.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev === -1) return 0;
            return (prev + 1) % flatRenderedItems.length;
          });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev === -1) return flatRenderedItems.length - 1;
            return (prev - 1 + flatRenderedItems.length) % flatRenderedItems.length;
          });
        } else if (e.key === "Enter") {
          if (activeIndex >= 0 && activeIndex < flatRenderedItems.length) {
            e.preventDefault();
            const targetItem = flatRenderedItems[activeIndex];
            router.push(targetItem.href);
            setFocused(false);
            inputRef.current?.blur();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focused, flatRenderedItems, activeIndex, router]);

  // Scroll active item into view inside dropdown
  useEffect(() => {
    if (activeIndex >= 0) {
      const activeEl = containerRef.current?.querySelector("[data-search-active='true']");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const popularTags = [
    { label: "One United", q: "One United" },
    { label: "Penthouse", q: "Penthouse" },
    { label: "Money Advisor", q: "Money" },
    { label: "Off-Market", q: "Off-Market" },
    { label: "RO Law", q: "Law" },
    { label: "Preț Aur", q: "Gold" },
    { label: "ETF", q: "ETF" },
    { label: "Cyber", q: "cyber" },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-45">
      {/* Search Input Bar */}
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
          focused
            ? "border-amber-500/40 bg-zinc-950 shadow-lg shadow-amber-500/[0.03]"
            : "border-zinc-800 bg-[#080808]/75"
        }`}
      >
        <Search className="h-5 w-5 text-zinc-500 flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={
            language === "ro"
              ? "Caută proprietăți, dezvoltatori, instrumente financiare..."
              : "Search properties, developers, investment tools..."
          }
          className="bg-transparent text-sm text-white placeholder-zinc-500 w-full focus:outline-none"
        />
        {!query && !focused && (
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded-md border border-zinc-800">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        )}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="text-xs text-zinc-500 hover:text-white uppercase font-mono font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Dropdown Results Box */}
      {focused && (
        <div
          className={`absolute top-full inset-x-0 mt-2.5 rounded-2xl border border-zinc-850 bg-[#080808]/98 backdrop-blur-3xl shadow-2xl p-4 space-y-4 max-h-[500px] overflow-y-auto ${
            query ? "animate-in fade-in slide-in-from-top-2 duration-150" : ""
          }`}
        >
          {results.length > 0 ? (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <span className="text-[8.5px] uppercase tracking-[0.15em] text-amber-500/80 font-bold font-mono block border-b border-zinc-900 pb-1">
                  {category}
                </span>
                <div className="space-y-1">
                  {items.map((item) => {
                    const IconComponent = item.icon;
                    // Find index in flattened rendered array
                    const itemIdx = flatRenderedItems.findIndex(
                      (f) => f.title === item.title && f.href === item.href
                    );
                    const isActive = itemIdx === activeIndex;

                    return (
                      <Link
                        key={item.title + item.href}
                        href={item.href}
                        data-search-active={isActive}
                        onClick={() => setFocused(false)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                          isActive
                            ? "border-amber-500/40 bg-zinc-900/40 text-amber-400"
                            : "border-transparent hover:border-zinc-850 hover:bg-zinc-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`rounded-lg border p-2 flex-shrink-0 transition-all ${
                              isActive
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "border-zinc-900 bg-zinc-950 text-zinc-400 group-hover:text-amber-400 group-hover:border-amber-500/20"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span
                              className={`text-xs font-semibold block transition-colors ${
                                isActive ? "text-amber-400" : "text-white group-hover:text-amber-400"
                              }`}
                            >
                              {item.title}
                            </span>
                            <p className="text-[10px] text-zinc-500 mt-0.5 truncate leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider transition-all flex-shrink-0 ${
                            isActive ? "text-amber-400" : "text-zinc-500 group-hover:text-white"
                          }`}
                        >
                          <span>{item.actionLabel ?? (language === "ro" ? "Deschide" : "Open")}</span>
                          <ArrowUpRight
                            className={`h-3 w-3 transition-transform ${
                              isActive
                                ? "translate-x-0.5 -translate-y-0.5 text-amber-400"
                                : "text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            }`}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : query ? (
            <div className="py-8 text-center text-xs text-zinc-550 flex flex-col gap-1.5 items-center">
              <Sparkles className="h-5 w-5 text-amber-500/40 animate-bounce" />
              <span>
                {language === "ro"
                  ? `Nu am găsit rezultate pentru "${query}". Încercați alte cuvinte.`
                  : `No results found matching "${query}". Try alternative keywords.`}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[8.5px] uppercase tracking-wider text-zinc-600 font-semibold font-mono">
                {language === "ro" ? "Căutări Populare" : "Popular Searches"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => {
                      setQuery(tag.q);
                      inputRef.current?.focus();
                    }}
                    className="text-[10px] px-3 py-1.5 rounded-lg border border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all bg-zinc-900/20"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
