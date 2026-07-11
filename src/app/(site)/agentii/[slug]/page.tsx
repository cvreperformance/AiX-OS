import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { ScoreCard } from "@/components/ui";
import { getAgency } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgency(slug);
  if (!agency) return { title: "Agenție negăsită" };
  return { title: agency.name, description: agency.description };
}

export default async function AgencyDetailPage({ params }: Props) {
  const { slug } = await params;
  const agency = await getAgency(slug);
  if (!agency) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/agentii"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Agenții
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-light text-zinc-900 mb-2">{agency.name}</h1>
          <p className="text-zinc-400">
            {agency.city} · {agency.properties_count} proprietăți listate
          </p>
        </div>

        <p className="text-zinc-600 leading-relaxed">{agency.description}</p>

        <ScoreCard score={agency.aix_score} />

        <div className="rounded-xl border border-zinc-200 p-6 space-y-4 bg-zinc-50/30">
          <h3 className="text-sm uppercase tracking-wider text-zinc-400 font-medium">Contact & Detalii</h3>
          
          <div className="space-y-3">
            {agency.email && (
              <p className="flex items-center gap-3 text-zinc-600 text-sm">
                <Mail className="h-4 w-4 text-amber-500/70" /> {agency.email}
              </p>
            )}
            {agency.phone && (
              <p className="flex items-center gap-3 text-zinc-600 text-sm">
                <Phone className="h-4 w-4 text-amber-500/70" /> {agency.phone}
              </p>
            )}
            {agency.website && (
              <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-600 text-sm hover:text-amber-400 transition-colors w-fit">
                <Globe className="h-4 w-4 text-amber-500/70" /> {agency.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {agency.specializations && agency.specializations.length > 0 && (
            <div className="pt-4 border-t border-zinc-200/50">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-3">Specializări</h4>
              <div className="flex flex-wrap gap-2">
                {agency.specializations.map(spec => (
                  <span key={spec} className="px-2.5 py-1 rounded-full bg-zinc-100/50 border border-zinc-300/50 text-xs text-zinc-600">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {agency.collaboration_info && (
            <div className="pt-4 border-t border-zinc-200/50">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">Colaborare</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">{agency.collaboration_info}</p>
            </div>
          )}
        </div>

        <Link
          href="/contact"
          className="block w-full rounded-full bg-amber-500/90 py-4 text-center text-sm font-medium text-black hover:bg-amber-400 transition-all"
        >
          Contactează Agenția
        </Link>
      </div>
    </div>
  );
}
