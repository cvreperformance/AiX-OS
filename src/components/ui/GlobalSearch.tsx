"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Sparkles,
  Command,
  X,
  ArrowUpRight,
  Bookmark,
  GitCompare,
  Copy,
  Check,
  BrainCircuit
} from "lucide-react";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  // Listen to mobile search triggers from bottom nav bar
  useEffect(() => {
    const handleMobileSearchTrigger = () => {
      inputRef.current?.focus();
      setFocused(true);
    };
    window.addEventListener("trigger-search-focus", handleMobileSearchTrigger);
    return () => window.removeEventListener("trigger-search-focus", handleMobileSearchTrigger);
  }, []);

  // Fetch index items matching query
  const results = useMemo(() => {
    return querySearchIndex(query);
  }, [query]);

  // Group items by category (Properties, Market Data, Tools, Navigation, AI Actions)
  const groupedResults = useMemo(() => {
    const groups: Record<string, IndexItem[]> = {
      "AI Actions": [],
      "Properties": [],
      "Market Data": [],
      "Tools": [],
      "Navigation": [],
    };
    results.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([_, items]) => items.length > 0)
    );
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
            router.push(targetItem.deepLink);
            setFocused(false);
            inputRef.current?.blur();
          } else if (query.trim() !== "") {
            // AI Routing fallback on hitting Enter with no active selection
            e.preventDefault();
            router.push(`/brain?q=${encodeURIComponent(query.trim())}`);
            setFocused(false);
            inputRef.current?.blur();
          }
        }
      } else if (e.key === "Enter" && query.trim() !== "") {
        // AI Routing fallback if no exact matches found
        e.preventDefault();
        router.push(`/brain?q=${encodeURIComponent(query.trim())}`);
        setFocused(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focused, flatRenderedItems, activeIndex, query, router]);

  // Scroll active item into view inside dropdown
  useEffect(() => {
    if (activeIndex >= 0) {
      const activeEl = containerRef.current?.querySelector("[data-search-active='true']");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  // Copy Link Quick Action
  const handleCopyLink = (e: React.MouseEvent, deepLink: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = `${window.location.origin}${deepLink}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(title);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Save to Favorites Quick Action
  const handleSaveToFavorites = (e: React.MouseEvent, item: IndexItem) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const current = localStorage.getItem("aix_saved_items");
      const list = current ? JSON.parse(current) : [];
      const exists = list.some((i: any) => i.href === item.deepLink);
      if (!exists) {
        list.push({ title: item.title, href: item.deepLink, category: item.category });
        localStorage.setItem("aix_saved_items", JSON.stringify(list));
      }
      alert(language === "ro" ? `✓ Am salvat "${item.title}" la Favorite.` : `✓ Saved "${item.title}" to Favorites.`);
    } catch {}
  };

  // Compare Asset Quick Action
  const handleAddToCompare = (e: React.MouseEvent, item: IndexItem) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const current = localStorage.getItem("aix_compare_items");
      const list = current ? JSON.parse(current) : [];
      const exists = list.some((i: any) => i.href === item.deepLink);
      if (!exists) {
        list.push({ title: item.title, href: item.deepLink });
        localStorage.setItem("aix_compare_items", JSON.stringify(list));
      }
      router.push("/compare");
      setFocused(false);
    } catch {}
  };

  const popularTags = [
    { label: "One United", q: "One United" },
    { label: "Penthouse", q: "Penthouse" },
    { label: "AI Advisor", q: "Advisor" },
    { label: "Off Market", q: "Off Market" },
    { label: "RO Law", q: "Law" },
    { label: "Preț Aur", q: "Gold" },
    { label: "ETF", q: "ETF" },
    { label: "Cybersecurity", q: "Cyber" },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-45">
      {/* Search Input Bar */}
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
          focused
            ? "border-amber-500/40 bg-white shadow-lg shadow-amber-500/[0.03]"
            : "border-zinc-200 bg-white/75"
        }`}
      >
        <Search className="h-5 w-5 text-zinc-400 flex-shrink-0" />
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
          className="bg-transparent text-sm text-zinc-900 placeholder-zinc-500 w-full focus:outline-none"
        />
        {!query && !focused && (
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-50/50 px-2 py-1 rounded-md border border-zinc-200 font-mono">
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
            className="text-xs text-zinc-400 hover:text-zinc-900 uppercase font-mono font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Dropdown Results Box */}
      {focused && (
        <div
          className={`absolute top-full inset-x-0 mt-2.5 rounded-2xl border border-zinc-200 bg-white/98 backdrop-blur-3xl shadow-2xl p-4 space-y-4 max-h-[500px] overflow-y-auto ${
            query ? "animate-in fade-in slide-in-from-top-2 duration-150" : ""
          }`}
        >
          {/* AI Decision Routing Prompt */}
          {query.trim() !== "" && (
            <Link
              href={`/brain?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setFocused(false)}
              className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 transition-all text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <BrainCircuit className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
                {language === "ro"
                  ? `Întreabă AI Advisor / Brain despre "${query}"`
                  : `Ask AI Advisor / Brain about "${query}"`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {results.length > 0 ? (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="space-y-2 text-left">
                <span className="text-[8.5px] uppercase tracking-[0.15em] text-zinc-400 font-bold font-mono block border-b border-zinc-200 pb-1">
                  {category}
                </span>
                <div className="space-y-1">
                  {items.map((item) => {
                    const IconComponent = item.icon;
                    const itemIdx = flatRenderedItems.findIndex(
                      (f) => f.title === item.title && f.deepLink === item.deepLink
                    );
                    const isActive = itemIdx === activeIndex;

                    return (
                      <div
                        key={item.title + item.deepLink}
                        data-search-active={isActive}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                          isActive
                            ? "border-amber-500/40 bg-zinc-50/40"
                            : "border-transparent hover:border-zinc-200 hover:bg-zinc-100/25"
                        }`}
                      >
                        <Link
                          href={item.deepLink}
                          onClick={() => setFocused(false)}
                          className="flex items-center gap-3.5 min-w-0 flex-1"
                        >
                          <div
                            className={`rounded-lg border p-2 flex-shrink-0 transition-all ${
                              isActive
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "border-zinc-200 bg-white text-zinc-400 group-hover:text-amber-400 group-hover:border-amber-500/20"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span
                              className={`text-xs font-semibold block transition-colors ${
                                isActive ? "text-amber-400" : "text-zinc-900 group-hover:text-amber-400"
                              }`}
                            >
                              {item.title}
                            </span>
                            <p className="text-[10px] text-zinc-400 mt-0.5 truncate leading-relaxed">
                              {item.subtitle}
                            </p>
                          </div>
                        </Link>

                        {/* Actions block */}
                        <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
                          {/* Quick Actions shown on hover/focus */}
                          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleSaveToFavorites(e, item)}
                              title={language === "ro" ? "Salvează la Favorite" : "Save to Favorites"}
                              className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 transition-all"
                            >
                              <Bookmark className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleAddToCompare(e, item)}
                              title={language === "ro" ? "Adaugă la Comparare" : "Add to Comparison"}
                              className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 transition-all"
                            >
                              <GitCompare className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleCopyLink(e, item.deepLink, item.title)}
                              title={language === "ro" ? "Copiază link-ul" : "Copy Link"}
                              className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 transition-all"
                            >
                              {copiedId === item.title ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>

                          <Link
                            href={item.deepLink}
                            onClick={() => setFocused(false)}
                            className={`flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider transition-all ${
                              isActive ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-900"
                            }`}
                          >
                            <span>{item.action}</span>
                            <ArrowUpRight
                              className={`h-3 w-3 transition-transform ${
                                isActive
                                  ? "translate-x-0.5 -translate-y-0.5 text-amber-400"
                                  : "text-zinc-650 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              }`}
                            />
                          </Link>
                        </div>
                      </div>
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
                  ? `Nu am găsit rezultate exacte. Încearcă link-ul de AI Advisor de mai sus.`
                  : `No exact matches found. Try launching the AI Advisor query above.`}
              </span>
            </div>
          ) : (
            <div className="space-y-2 text-left">
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
                    className="text-[10px] px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-all bg-zinc-50/20"
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
export default GlobalSearch;
