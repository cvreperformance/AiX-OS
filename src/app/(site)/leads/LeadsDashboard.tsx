"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Inbox,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Sliders,
  Filter,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LeadItem {
  id: string | number;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  budget: string | null;
  message: string | null;
  source: string;
  page: string | null;
  created_at: string;
  status: "new" | "in_progress" | "contacted" | "closed";
}

const FALLBACK_LEADS: LeadItem[] = [
  {
    id: 1,
    name: "Mihai Popescu",
    phone: "0722334455",
    email: "mihai.popescu@gmail.com",
    subject: "Penthouse Floreasca Lake",
    budget: "€4,850,000",
    message: "Doresc o vizionare privată vinerea aceasta la ora 14:00.",
    source: "contact-form",
    page: "/proprietati/penthouse-floreasca-lake",
    created_at: "2026-07-04T12:30:00.000Z",
    status: "new",
  },
  {
    id: 2,
    name: "Elena Vasilescu",
    phone: "0733445566",
    email: "elena@vasilescu-partners.ro",
    subject: "Asigurare Locuință Facultativă",
    budget: null,
    message: "Solicitare cotație pentru vilă în Pipera, valoare reconstrucție 850k.",
    source: "insurance-form",
    page: "/insurance",
    created_at: "2026-07-04T10:15:00.000Z",
    status: "in_progress",
  },
  {
    id: 3,
    name: "Radu Georgescu",
    phone: "0744556677",
    email: "radu.g@capital.com",
    subject: "One United Properties",
    budget: "€1,200,000",
    message: "Vreau informații despre listările off-market disponibile.",
    source: "popup",
    page: "/dezvoltatori/one-united-properties",
    created_at: "2026-07-03T18:45:00.000Z",
    status: "contacted",
  },
];

export default function LeadsDashboard() {
  const { language } = useLanguage();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leads");
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      if (data && data.length > 0) {
        setLeads(data as LeadItem[]);
      } else {
        setLeads(FALLBACK_LEADS);
      }
    } catch (e) {
      console.warn("API leads fetch failed, serving fallback leads", e);
      setLeads(FALLBACK_LEADS);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string | number, nextStatus: LeadItem["status"]) => {
    // Update local state first
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: nextStatus } : l))
    );

    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (e) {
      console.warn("Failed to update status on API", e);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone.includes(query) ||
        (lead.email && lead.email.toLowerCase().includes(query.toLowerCase())) ||
        (lead.subject && lead.subject.toLowerCase().includes(query.toLowerCase()));

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, query, statusFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const isNew = leads.filter((l) => l.status === "new").length;
    const progress = leads.filter((l) => l.status === "in_progress").length;
    const closed = leads.filter((l) => l.status === "closed" || l.status === "contacted").length;

    return { total, isNew, progress, closed };
  }, [leads]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <PageHeader
          badge="Leads Control Panel"
          title={language === "ro" ? "Panou de Control Leads" : "Internal Leads Control Center"}
          subtitle={language === "ro" ? "Administrarea solicitărilor primite prin formulare." : "Manage user lead captures, status flows, and inquiries."}
        />
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="rounded-xl border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900/60 p-3 text-zinc-400 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-amber-500" : ""}`} />
          {language === "ro" ? "Actualizează" : "Refresh"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: language === "ro" ? "Total Leads" : "Total Leads", value: stats.total, icon: Inbox, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { label: language === "ro" ? "Leads Noi" : "New Inquiries", value: stats.isNew, icon: AlertCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { label: language === "ro" ? "În Curs" : "In Progress", value: stats.progress, icon: Clock, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
          { label: language === "ro" ? "Contactat / Închis" : "Closed / Contacted", value: stats.closed, icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`p-5 rounded-3xl ${designSystem.glass} border relative flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono font-semibold">{s.label}</span>
                <p className="text-2xl font-light text-white font-mono">{s.value}</p>
              </div>
              <div className={`rounded-xl border p-2.5 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === "ro" ? "Caută după nume, telefon, subiect..." : "Search leads by name, phone, or subject..."}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 py-3 pl-11 pr-4 text-xs text-white placeholder-zinc-500 focus:border-amber-500/40 focus:outline-none backdrop-blur-sm transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "new", "in_progress", "contacted", "closed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                statusFilter === status
                  ? "bg-amber-500 border-amber-500 text-black"
                  : "border-zinc-800 text-zinc-450 bg-zinc-950/20 hover:text-white"
              }`}
            >
              {status === "all" ? (language === "ro" ? "Toate" : "All") : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className={`rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-950/30 backdrop-blur-md`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[9px] uppercase tracking-wider bg-black/40">
                <th className="p-4 font-semibold">{language === "ro" ? "Dată" : "Date"}</th>
                <th className="p-4 font-semibold">{language === "ro" ? "Contact" : "Client Info"}</th>
                <th className="p-4 font-semibold">{language === "ro" ? "Subiect" : "Interest"}</th>
                <th className="p-4 font-semibold">{language === "ro" ? "Mesaj" : "Message"}</th>
                <th className="p-4 font-semibold">{language === "ro" ? "Sursă" : "Source"}</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-xs">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead: LeadItem) => (
                  <tr key={lead.id} className="hover:bg-zinc-900/10 transition-colors">
                    <td className="p-4 text-zinc-450 font-mono">
                      {new Date(lead.created_at).toLocaleString(language === "ro" ? "ro-RO" : "en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{lead.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{lead.phone}</p>
                      {lead.email && <p className="text-[10px] text-zinc-550">{lead.email}</p>}
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-white">{lead.subject ?? "N/A"}</span>
                      {lead.budget && (
                        <span className="block text-[10px] text-amber-400 font-mono font-semibold mt-0.5">
                          {lead.budget}
                        </span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs truncate text-zinc-300" title={lead.message ?? ""}>
                      {lead.message ?? "-"}
                    </td>
                    <td className="p-4">
                      <span className="text-[9px] px-2 py-0.5 border border-zinc-900 bg-zinc-950/50 text-zinc-500 rounded-md font-mono uppercase tracking-wider">
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadItem["status"])}
                        className={`rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-[10.5px] font-semibold font-mono focus:outline-none cursor-pointer ${
                          lead.status === "new"
                            ? "text-amber-400"
                            : lead.status === "in_progress"
                            ? "text-sky-400"
                            : lead.status === "contacted"
                            ? "text-indigo-400"
                            : "text-emerald-400"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-550 text-xs">
                    {language === "ro" ? "Nicio solicitare găsită." : "No leads matching these filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
