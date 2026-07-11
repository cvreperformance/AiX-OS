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
  History,
  Trash2,
  Compass,
  ArrowRight,
  Activity,
  Sparkles,
  Lock,
  Terminal,
  Shield,
  TrendingUp,
  Cpu,
  User,
  Zap
} from "lucide-react";
import Link from "next/link";

interface FavoriteItem {
  id: string | number;
  title: string;
  category: string;
  href: string;
  desc?: string;
}

interface UserDashboardProps {
  user: any;
  profile: any;
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

export default function UserDashboard({ user, profile }: UserDashboardProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"terminal" | "agents" | "saved" | "history">("terminal");
  
  // States
  const [properties, setProperties] = useState<FavoriteItem[]>([]);
  const [developers, setDevelopers] = useState<FavoriteItem[]>([]);
  const [books, setBooks] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<{ title: string; href: string; time: string }[]>([]);
  
  // Live Feed State
  const [liveFeed, setLiveFeed] = useState<{ id: number; text: string; time: string; type: "alert" | "info" | "success" }[]>([
    { id: 1, text: "AI detected: Luxury market activity increasing in Floreasca (+3.2% YoY)", time: "12:45:10", type: "success" },
    { id: 2, text: "Market signal updated: ROBOR 3M down to 6.85%", time: "12:44:32", type: "info" },
    { id: 3, text: "AI evaluated: Safety score index generated for Herăstrău Lake project (9.1/10)", time: "12:40:05", type: "alert" },
    { id: 4, text: "Concierge routing: Private helicopter request matched for Bucharest-Constanta corridor", time: "12:35:18", type: "info" },
    { id: 5, text: "Investment opportunity: Off-market penthouse listed in Primăverii", time: "12:30:11", type: "success" },
  ]);

  // Ecosystem Counters
  const [stats, setStats] = useState({
    propertiesAnalyzed: 14820,
    marketSignals: 842,
    investments: 89,
    luxuryAssets: 450,
    insights: 31450
  });

  // Load from localStorage & simulate live ticker updates
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
        { title: "GIS Spatial Terminal Map", href: "/market-radar", time: "2 mins ago" },
        { title: "AI Property Scanner", href: "/property-scanner", time: "10 mins ago" },
        { title: "Indici Piață & Macro BNR", href: "/market", time: "1 hour ago" },
      ];
      setHistory(getLocalJSON("aix-recent-history", mockHistory));
    } catch (e) {
      console.warn("localStorage loading failed, falling back to default lists", e);
    }
  }, []);

  // Live feed simulation
  useEffect(() => {
    const feeds = [
      { text: "AI detected: Premium residential demand shift in Cluj-Napoca (+4.1% pricing drift)", type: "info" as const },
      { text: "Market signal: Federal Reserve cut expectation rises to 82% probability", type: "success" as const },
      { text: "AI evaluated: Verified Location stamp granted to One Lake District layout", type: "success" as const },
      { text: "Ecosystem warning: High risk index detected for servitude access in Pipera-Nord plot", type: "alert" as const },
      { text: "Concierge routing: Super-yacht charter request matched in Monaco harbor", type: "info" as const }
    ];

    const interval = setInterval(() => {
      const randomFeed = feeds[Math.floor(Math.random() * feeds.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      setLiveFeed(prev => [
        { id: Date.now(), text: randomFeed.text, time: timeStr, type: randomFeed.type },
        ...prev.slice(0, 7)
      ]);

      // Randomly tweak stats slightly to look alive
      setStats(prev => ({
        propertiesAnalyzed: prev.propertiesAnalyzed + Math.floor(Math.random() * 3),
        marketSignals: prev.marketSignals + Math.floor(Math.random() * 2),
        investments: prev.investments + (Math.random() > 0.8 ? 1 : 0),
        luxuryAssets: prev.luxuryAssets + (Math.random() > 0.9 ? 1 : 0),
        insights: prev.insights + Math.floor(Math.random() * 5)
      }));
    }, 4500);

    return () => clearInterval(interval);
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
        badge="Command Center v5.2"
        title="AiX OS™ Live Terminal"
        subtitle={
          language === "ro"
            ? "Monitorul tău central de analiză imobiliară premium și semnale de tranzacționare în timp real."
            : "Your central cockpit for real-time premium real estate metrics and strategic transaction intelligence."
        }
      />

      {/* ─── LIVE STATISTICS GRID ─────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: language === "ro" ? "Proprietăți Scanate" : "Properties Analyzed", val: stats.propertiesAnalyzed, change: "+14 this hour", icon: Building },
          { label: language === "ro" ? "Semnale Piață" : "Market Signals", val: stats.marketSignals, change: "Active ticks", icon: Activity },
          { label: language === "ro" ? "Oportunități Corelate" : "Invest Opportunities", val: stats.investments, change: "Off-market", icon: TrendingUp },
          { label: language === "ro" ? "Active de Lux Monitorizate" : "Luxury Assets Monitored", val: stats.luxuryAssets, change: "24/7 scanning", icon: Sparkles },
          { label: language === "ro" ? "Rapoarte Generate" : "AI Insights Generated", val: stats.insights, change: "Real-time logs", icon: Cpu }
        ].map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md text-left space-y-2 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.01] blur-2xl rounded-full" />
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-amber-500/40" />
            </div>
            <p className="text-2xl font-light text-white font-mono">{stat.val.toLocaleString()}</p>
            <p className="text-[9px] text-amber-400/80 font-mono flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" />
              {stat.change}
            </p>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2.5 bg-zinc-950/60 p-2 rounded-2xl border border-zinc-850 justify-center max-w-lg mx-auto">
        {[
          { key: "terminal" as const, label: language === "ro" ? "Live Command" : "Live Terminal", icon: Terminal },
          { key: "agents" as const, label: language === "ro" ? "Agenți AI" : "AI Agents", icon: Cpu },
          { key: "saved" as const, label: language === "ro" ? "Saved Intel" : "Saved Intel", icon: Bookmark },
          { key: "history" as const, label: language === "ro" ? "Trail" : "Audit Trail", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
        
        {/* PANEL: LIVE TERMINAL COMMAND */}
        {activeTab === "terminal" && (
          <div className="space-y-6 text-left">
            <div className={`p-6 rounded-3xl border border-zinc-900 bg-[#080808]/85 backdrop-blur-xl relative overflow-hidden space-y-4`}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.02] blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 font-mono">LIVE INTELLIGENCE WALL</h3>
                </div>
                <span className="text-[9px] text-zinc-550 font-mono">Terminal Sync Status: ONLINE</span>
              </div>

              {/* Scrolling Wire Feed */}
              <div className="space-y-3 font-mono text-xs max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {liveFeed.map(feed => (
                  <div key={feed.id} className="flex items-start gap-4 p-2.5 rounded-lg bg-zinc-950/40 hover:bg-zinc-900/30 border border-zinc-900/60 transition-colors">
                    <span className="text-amber-500/80 shrink-0 text-[10px]">{feed.time}</span>
                    <span className="text-zinc-400 flex-1">{feed.text}</span>
                    <span className={`text-[8.5px] uppercase font-bold shrink-0 px-2 py-0.5 rounded border ${
                      feed.type === "success" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" :
                      feed.type === "alert" ? "border-rose-500/20 bg-rose-500/5 text-rose-400" :
                      "border-sky-500/20 bg-sky-500/5 text-sky-400"
                    }`}>
                      {feed.type}
                    </span>
                  </div>
                ))}
              </div>

              {/* Live telemetry metadata */}
              <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                <span>Feed updates dynamic • Powered by AiX Brain OS™</span>
                <span className="flex items-center gap-1 text-amber-500 hover:underline">
                  <Link href="/market-radar">Open Market Radar &rarr;</Link>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: AI AGENTS */}
        {activeTab === "agents" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { name: "Property Agent", status: "STANDBY", color: "text-amber-400 border-amber-500/20 bg-amber-500/5", desc: "Scans land registry assets and flags documentation gaps.", rate: "99.8% Accuracy" },
              { name: "Investment Agent", status: "ACTIVE", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", desc: "Analyzes yields, sub-market pricing spreads, and ROI thresholds.", rate: "Calculates live net yield" },
              { name: "Insurance Agent", status: "ONLINE", color: "text-sky-400 border-sky-500/20 bg-sky-500/5", desc: "Monitors safety indexes, structural risk, and mandatory PAD clauses.", rate: "Live PAD API connected" },
              { name: "Market Agent", status: "SYNCED", color: "text-rose-400 border-rose-500/20 bg-rose-500/5", desc: "Streams BNR rates, interbank indexes, and commodity curves.", rate: "30s refresh frequency" },
            ].map((agent, i) => (
              <div key={i} className={`p-5 rounded-2xl border ${agent.color} space-y-3`}>
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-white">{agent.name}</h4>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 border border-zinc-800 bg-zinc-950 rounded-full">{agent.status}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{agent.desc}</p>
                <div className="pt-2.5 border-t border-zinc-900/60 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Audit Frequency</span>
                  <span className="text-zinc-300 font-bold">{agent.rate}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PANEL: SAVED INTELLIGENCE */}
        {activeTab === "saved" && (
          <div className="space-y-4">
            {user ? (
              <div className="space-y-4">
                {/* Properties */}
                {properties.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 hover:bg-zinc-900/25 transition-all group"
                  >
                    <div className="space-y-1 text-left">
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
                        className="text-zinc-650 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:border-red-500/10 hover:bg-red-500/5 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Premium glass lock screen for unauthenticated users */
              <div className={`p-8 rounded-3xl border border-zinc-900 bg-[#080808]/75 backdrop-blur-xl text-center space-y-6 relative overflow-hidden`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-amber-500">
                  <Lock className="w-40 h-40" />
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white">{language === "ro" ? "Workspace Privat Securizat" : "Private Workspace Secured"}</h3>
                  <p className="text-xs text-zinc-450 max-w-sm mx-auto leading-relaxed">
                    {language === "ro"
                      ? "Pentru a monitoriza propriile favorite imobiliare și a salva analizele generat de AI, autentifică-te în cont."
                      : "To track personalized property bookmarks and log AI intelligence runs, authenticate into your dashboard workspace."}
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/login"
                    className="rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md"
                  >
                    {language === "ro" ? "Autentificare" : "Access Workspace"}
                  </Link>
                  <Link
                    href="/join"
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-6 py-2.5 text-xs text-zinc-300 transition-all"
                  >
                    {language === "ro" ? "Creează Cont" : "Register"}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL: AUDIT TRAIL */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-550 font-mono font-semibold px-2 mb-2">
              <span>{language === "ro" ? "Audit Tranzacții" : "Audit Trail"}</span>
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
                  <div className="space-y-1 text-left">
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
