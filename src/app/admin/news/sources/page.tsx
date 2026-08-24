"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

interface SourceStatus {
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
}

export default function AdminNewsSourcesPage() {
  const [sources, setSources] = useState<SourceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/news/health");
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources || []);
      }
    } catch (err) {
      console.error("Failed to fetch sources status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-8 p-6 md:p-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <Link href="/admin/news" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 mb-3">
            <ArrowLeft className="h-4 w-4" /> Înapoi la Control Center News
          </Link>
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white">
            Source Health Monitoring
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Statusul în timp real al tuturor surselor de date din pipeline.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh Status
        </button>
      </div>

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
                <th className="px-6 py-4">Eșecuri</th>
                <th className="px-6 py-4 text-right">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sources.map((src) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                    {src.failure_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <a
                      href={src.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Vizitează</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
