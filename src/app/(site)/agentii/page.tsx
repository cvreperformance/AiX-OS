import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { PageHeader, ScoreBadge } from "@/components/ui";
import { getAgencies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Agenții Imobiliare",
  description: "Agenții imobiliare din ecosistemul AiX OS.",
};

export default async function AgentiiPage() {
  const agencies = await getAgencies();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Agenții"
        title="Ecosistem AiX OS"
        subtitle="Agenții partenere evaluate și integrate în platforma de intelligence."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agencies.map((a) => (
          <Link
            key={a.id}
            href={`/agentii/${a.slug}`}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-light text-white group-hover:text-amber-400 transition-colors">
                {a.name}
              </h3>
              <ScoreBadge score={a.aix_score} size="sm" />
            </div>
            <p className="text-sm text-zinc-400 line-clamp-3 mb-4">{a.description}</p>
            <div className="space-y-2 text-xs text-zinc-500">
              <p>{a.city} · {a.properties_count} proprietăți</p>
              {a.email && (
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> {a.email}
                </p>
              )}
              {a.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {a.phone}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
