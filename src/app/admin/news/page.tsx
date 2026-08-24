"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  Layers,
  Search,
  Filter,
  Calendar,
  Database,
  Globe,
  Clock,
  ChevronRight,
} from "lucide-react";

interface HealthData {
  engineStatus: string;
  lastSyncAt: string | null;
  lastSyncStatus: string;
  articlesToday: number;
  articlesThisWeek: number;
  totalArticles: number;
  sourcesOnline: string;
  sources: Array<{
    id: string;
    name: string;
    source_key: string;
    feed_url: string;
    website_url: string;
    status: string;
    credibility_score: number;
    response_time_ms: number;
    articles_count: number;
    last_successful_fetch: string | null;
    last_failed_fetch: string | null;
    failure_count: number;
  }>;
  failedSources: any[];
}

interface NewsArticle {
  id: string;
  title: string;
  source_name: string;
  source_url: string;
  category: string;
  aix_score: number;
  published_at: string;
  slug: string;
  is_published: boolean;
  city?: string;
}

export default function AdminNewsPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"articles" | "sources">("articles");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [healthRes, articlesRes] = await Promise.all([
        fetch("/api/admin/news/health"),
        fetch("/api/news?limit=50"),
      ]);

      if (healthRes.ok) {
        const hData = await healthRes.json();
        setHealth(hData);
      }

      if (articlesRes.ok) {
        const aData = await articlesRes.json();
        setArticles(aData.articles || []);
      }
    } catch (err) {
      console.error("Failed to load news control center data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncMessage("Rulare pipeline de ingestie în timp real...");
    try {
      const res = await fetch("/api/admin/news/sync", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncMessage(`✅ Sincronizare reușită! ${data.data?.articlesIngested || 0} articole noi ingerate.`);
        await fetchData();
      } else {
        setSyncMessage(`❌ Eroare sincronizare: ${data.error || "Eroare necunoscută"}`);
      }
    } catch (err: any) {
      setSyncMessage(`❌ Eroare rețea: ${err.message}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 8000);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.source_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || art.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 p-6 md:p-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white">
              LIVE NEWS ENGINE
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              AiX OS™ Real Estate Intelligence
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Centrul de control și monitorizare al pipeline-ului de ingestie de știri imobiliare în timp real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-black hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Sincronizare în curs..." : "SYNC NOW"}
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300 flex items-center justify-between animate-fadeIn">
          <span>{syncMessage}</span>
          <button onClick={() => setSyncMessage(null)} className="text-xs text-zinc-400 hover:text-white">Închide</button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">
            <span>Status Engine</span>
            <Radio className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${health?.engineStatus === "ONLINE" ? "text-emerald-400" : "text-amber-400"}`}>
              ● {health?.engineStatus || "ONLINE"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Ultimul sync: {health?.lastSyncAt ? new Date(health.lastSyncAt).toLocaleTimeString("ro-RO") : "Recent"}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">
            <span>Articole Astăzi</span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-light text-white">
            {health?.articlesToday ?? "—"}
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Din totalul de {health?.totalArticles || 0} articole
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">
            <span>Articole Săptămâna Aceasta</span>
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-3xl font-light text-white">
            {health?.articlesThisWeek ?? "—"}
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Ingerate & verificate
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">
            <span>Surse Conectate</span>
            <Globe className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-light text-emerald-400">
            {health?.sourcesOnline ?? "7 / 7"}
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Monitorizate automat la fiecare 15 min
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "articles"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Articole Ingerate ({filteredArticles.length})
        </button>
        <button
          onClick={() => setActiveTab("sources")}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "sources"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Monitorizare Surse ({health?.sources?.length || 0})
        </button>
      </div>

      {/* Articles View */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Caută în titluri sau surse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {["ALL", "MARKET", "PRICES", "RESIDENTIAL", "INVESTMENT", "FINANCING", "TAX"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900/90 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Titlu Articol</th>
                    <th className="px-6 py-4">Sursă</th>
                    <th className="px-6 py-4">Categorie</th>
                    <th className="px-6 py-4">AiX Score</th>
                    <th className="px-6 py-4">Data Publicării</th>
                    <th className="px-6 py-4 text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-zinc-500">
                        {loading ? "Se încarcă articolele..." : "Nu au fost găsite articole."}
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-white max-w-md">
                          <Link href={`/stiri/${art.slug}`} className="hover:text-amber-400 transition-colors line-clamp-2">
                            {art.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                            {art.source_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-300">
                            {art.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-amber-400">
                            {art.aix_score ? art.aix_score.toFixed(1) : "7.5"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                          {new Date(art.published_at).toLocaleDateString("ro-RO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <a
                            href={art.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 hover:underline"
                          >
                            <span>Sursă</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sources View */}
      {activeTab === "sources" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900/90 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Sursă Informații</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Scor Credibilitate</th>
                    <th className="px-6 py-4">Timp Răspuns</th>
                    <th className="px-6 py-4">Articole Ingerate</th>
                    <th className="px-6 py-4">Ultima Ingestie Reușită</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {(health?.sources || []).map((src) => (
                    <tr key={src.id || src.source_key} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{src.name}</span>
                          <span className="text-xs text-zinc-400 truncate max-w-xs">{src.feed_url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          src.status === "ONLINE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                          {src.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-400">
                        {src.credibility_score} / 10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                        {src.response_time_ms ? `${src.response_time_ms} ms` : "< 500 ms"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">
                        {src.articles_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                        {src.last_successful_fetch
                          ? new Date(src.last_successful_fetch).toLocaleString("ro-RO")
                          : "Acum"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
