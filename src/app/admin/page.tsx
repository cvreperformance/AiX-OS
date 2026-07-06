import { Building2, Newspaper, Star, TrendingUp, Users } from "lucide-react";
import {
  agencies as demoAgencies,
  developers as demoDevelopers,
  newsArticles,
  opportunities,
  properties,
} from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure user is admin (Double check, even if middleware handles it)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const stats = [
    { label: "Proprietăți", value: properties.length, icon: Building2, href: "/admin/properties" },
    { label: "Market Pulse", value: newsArticles.length, icon: Newspaper, href: "/admin/news" },
    { label: "Oportunități", value: opportunities.length, icon: Star, href: "/admin/opportunities" },
    { label: "Dezvoltatori", value: demoDevelopers.length, icon: TrendingUp, href: "/admin/developers" },
    { label: "Agenții", value: demoAgencies.length, icon: Users, href: "/admin/agencies" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light text-white mb-2">Dashboard</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Panou de administrare AiX OS — gestionează conținutul platformei.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-amber-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-5 w-5 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
              <span className="text-2xl font-light text-white">{s.value}</span>
            </div>
            <p className="text-sm text-zinc-400">{s.label}</p>
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3">
        <h2 className="text-sm font-medium text-amber-400">Setup Supabase</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Site-ul funcționează acum cu date demo. Pentru administrare reală (add/edit/delete),
          conectează Supabase gratuit — vezi README.md pentru pașii exacti.
        </p>
        <ol className="text-sm text-zinc-500 space-y-1 list-decimal list-inside">
          <li>Creează cont pe supabase.com (free)</li>
          <li>Rulează <code className="text-amber-400/80">supabase/schema.sql</code></li>
          <li>Copiază URL + anon key în <code className="text-amber-400/80">.env.local</code></li>
          <li>Creează cont admin și setează role = admin în profiles</li>
        </ol>
      </div>
    </div>
  );
}
