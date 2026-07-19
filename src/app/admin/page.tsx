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
      <h1 className="text-2xl font-light text-zinc-900 mb-2">Dashboard</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Panou de administrare AiX OS™ — gestionează conținutul platformei.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="rounded-xl border border-zinc-200 bg-zinc-50/30 p-6 hover:border-amber-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-5 w-5 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
              <span className="text-2xl font-light text-zinc-900">{s.value}</span>
            </div>
            <p className="text-sm text-zinc-400">{s.label}</p>
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3">
        <h2 className="text-sm font-medium text-amber-400">Admin Settings</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Dashboard-ul este funcțional cu date demo. Pentru configurare completă, urmează ghidul de producție.
        </p>
        <ol className="text-sm text-zinc-400 space-y-1 list-decimal list-inside">
          <li>Configurează conexiunea la baza de date în fișierul de configurare.</li>
          <li>Actualizează variabilele de mediu pentru autentificare.</li>
          <li>Setează rolurile utilizatorilor în sistemul de gestionare a accesului.</li>
        </ol>
      </div>
    </div>
  );
}
