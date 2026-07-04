"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Heart,
  Bookmark,
  BookOpen,
  Building,
  Sliders,
  History,
  Trash2,
  Compass,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface FavoriteItem {
  id: string | number;
  title: string;
  category: string;
  href: string;
  desc?: string;
}

const DEFAULT_PROPERTIES = [
  { id: "penthouse-floreasca-lake", title: "Penthouse Floreasca Lake", category: "Properties", href: "/proprietati/penthouse-floreasca-lake", desc: "4.850.000 € · Floreasca" },
  { id: "vila-premium-pipera", title: "Vila Modernă Pipera", category: "Properties", href: "/proprietati/vila-premium-pipera", desc: "2.100.000 € · Pipera" },
];

const DEFAULT_DEVELOPERS = [
  { id: "one-united", title: "One United Properties", category: "Developers", href: "/dezvoltatori/one-united-properties", desc: "Verde & Sustenabil · București" },
];

const DEFAULT_BOOKS = [
  { id: "never-split-difference", title: "Never Split the Difference", category: "Books", href: "/books", desc: "Chris Voss · Negociere" },
];

export default function UserDashboard() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"properties" | "developers" | "books" | "history">("properties");
  
  // States
  const [properties, setProperties] = useState<FavoriteItem[]>([]);
  const [developers, setDevelopers] = useState<FavoriteItem[]>([]);
  const [books, setBooks] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<{ title: string; href: string; time: string }[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const getLocalJSON = (key: string, fallback: any) => {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      };

      setProperties(getLocalJSON("aix-fav-properties", DEFAULT_PROPERTIES));
      setDevelopers(getLocalJSON("aix-fav-developers", DEFAULT_DEVELOPERS));
      setBooks(getLocalJSON("aix-fav-books", DEFAULT_BOOKS));
      
      const mockHistory = [
        { title: "GIS Spatial Terminal Map", href: "/map", time: "2 mins ago" },
        { title: "Money Advisor Chat", href: "/money-advisor", time: "10 mins ago" },
        { title: "Indici Piață & Macro BNR", href: "/market", time: "1 hour ago" },
      ];
      setHistory(getLocalJSON("aix-recent-history", mockHistory));
    } catch (e) {
      console.warn("localStorage loading failed, falling back to default lists", e);
      setProperties(DEFAULT_PROPERTIES);
      setDevelopers(DEFAULT_DEVELOPERS);
      setBooks(DEFAULT_BOOKS);
    }
  }, []);

  const handleRemove = (tab: "properties" | "developers" | "books", id: string | number) => {
    let updated: FavoriteItem[] = [];
    if (tab === "properties") {
      updated = properties.filter((item) => item.id !== id);
      setProperties(updated);
      localStorage.setItem("aix-fav-properties", JSON.stringify(updated));
    } else if (tab === "developers") {
      updated = developers.filter((item) => item.id !== id);
      setDevelopers(updated);
      localStorage.setItem("aix-fav-developers", JSON.stringify(updated));
    } else if (tab === "books") {
      updated = books.filter((item) => item.id !== id);
      setBooks(updated);
      localStorage.setItem("aix-fav-books", JSON.stringify(updated));
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("aix-recent-history");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <PageHeader
        badge="Workspace Control Desk"
        title={language === "ro" ? "Panou Control Salvări" : "My Intelligence Control Center"}
        subtitle={
          language === "ro"
            ? "Accesează rapid proprietățile salvate, rapoartele imobiliare marcate ca favorite și istoricul recent."
            : "Quickly access bookmarked assets, developer watchlists, favorite literature, and recent reports."
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2.5 bg-zinc-950/60 p-2 rounded-2xl border border-zinc-850 justify-center max-w-md mx-auto">
        {[
          { key: "properties" as const, label: language === "ro" ? "Proprietăți" : "Properties", icon: Building },
          { key: "developers" as const, label: language === "ro" ? "Dezvoltatori" : "Developers", icon: Compass },
          { key: "books" as const, label: language === "ro" ? "Cărți" : "Books", icon: BookOpen },
          { key: "history" as const, label: language === "ro" ? "Istoric" : "History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "properties" && (
          <div className="space-y-4">
            {properties.length > 0 ? (
              properties.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 hover:bg-zinc-900/25 transition-all group"
                >
                  <div className="space-y-1">
                    <Link href={item.href} className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[10px] text-zinc-500 font-mono">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={item.href}
                      className="text-[10px] uppercase font-mono font-bold text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {language === "ro" ? "Detalii" : "Open"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleRemove("properties", item.id)}
                      className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:border-red-500/10 hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-550 text-xs">
                {language === "ro" ? "Nicio proprietate salvată." : "No bookmarked properties."}
              </div>
            )}
          </div>
        )}

        {activeTab === "developers" && (
          <div className="space-y-4">
            {developers.length > 0 ? (
              developers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 hover:bg-zinc-900/25 transition-all group"
                >
                  <div className="space-y-1">
                    <Link href={item.href} className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[10px] text-zinc-500 font-mono">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={item.href}
                      className="text-[10px] uppercase font-mono font-bold text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {language === "ro" ? "Raport" : "Audit"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleRemove("developers", item.id)}
                      className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:border-red-500/10 hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-550 text-xs">
                {language === "ro" ? "Niciun dezvoltator salvat." : "No watchlisted developers."}
              </div>
            )}
          </div>
        )}

        {activeTab === "books" && (
          <div className="space-y-4">
            {books.length > 0 ? (
              books.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 hover:bg-zinc-900/25 transition-all group"
                >
                  <div className="space-y-1">
                    <Link href={item.href} className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[10px] text-zinc-500 font-mono">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={item.href}
                      className="text-[10px] uppercase font-mono font-bold text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {language === "ro" ? "Vezi" : "Read Summary"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleRemove("books", item.id)}
                      className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:border-red-500/10 hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-550 text-xs">
                {language === "ro" ? "Nicio carte salvată." : "No bookmarked literature."}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-550 font-mono font-semibold px-2 mb-2">
              <span>{language === "ro" ? "Pagini Vizitate" : "Navigation Trail"}</span>
              {history.length > 0 && (
                <button onClick={handleClearHistory} className="hover:text-red-400 transition-colors">
                  {language === "ro" ? "Șterge Istoric" : "Clear Trail"}
                </button>
              )}
            </div>

            {history.length > 0 ? (
              history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 hover:bg-zinc-900/25 transition-all group"
                >
                  <div className="space-y-1">
                    <Link href={item.href} className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-[10px] text-zinc-550 font-mono">{item.href}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{item.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-550 text-xs">
                {language === "ro" ? "Nicio pagină vizitată recent." : "No recent navigation history."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
