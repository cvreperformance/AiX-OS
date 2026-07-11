"use client";

import { PageHeader } from "@/components/ui";
import { Cpu, Shield, Activity, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function AIAgentsPage() {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-16 animate-in text-left">
      <PageHeader
        badge="AiX OS™ Intelligence"
        title="AiX OS™ AI Agents"
        subtitle={
          language === "ro"
            ? "Rețeaua noastră de agenți autonomi analizează piața 24/7."
            : "Our network of autonomous agents analyzing the market 24/7."
        }
      />

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
          { name: "Property Agent", status: "STANDBY", color: "text-amber-400 border-amber-500/20 bg-amber-500/5", desc: "Scans land registry assets and flags documentation gaps.", rate: "99.8% Accuracy", icon: Shield },
          { name: "Investment Agent", status: "ACTIVE", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", desc: "Analyzes yields, sub-market pricing spreads, and ROI thresholds.", rate: "Calculates live net yield", icon: TrendingUp },
          { name: "Insurance Agent", status: "ONLINE", color: "text-sky-400 border-sky-500/20 bg-sky-500/5", desc: "Monitors safety indexes, structural risk, and mandatory PAD clauses.", rate: "Live PAD API connected", icon: Shield },
          { name: "Market Agent", status: "SYNCED", color: "text-rose-400 border-rose-500/20 bg-rose-500/5", desc: "Streams BNR rates, interbank indexes, and commodity curves.", rate: "30s refresh frequency", icon: Activity },
        ].map((agent, i) => (
          <div key={i} className={`p-8 rounded-3xl border ${agent.color} space-y-4`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <agent.icon className={`h-6 w-6 ${agent.color.split(' ')[0]}`} />
                <h4 className="text-lg font-semibold text-zinc-900">{agent.name}</h4>
              </div>
              <span className="text-[10px] font-bold font-mono px-3 py-1 border border-zinc-200 bg-white rounded-full">{agent.status}</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{agent.desc}</p>
            <div className="pt-4 border-t border-zinc-200/60 flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>Audit Frequency</span>
              <span className="text-zinc-600 font-bold">{agent.rate}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link href="/dashboard" className="px-6 py-3 rounded-full bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
          {language === "ro" ? "Deschide Command Center" : "Open Command Center"}
        </Link>
      </div>
    </div>
  );
}
