import type { Metadata } from "next";
import { getAgencies } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { brandContent } from "@/lib/content/brand";
import Link from "next/link";
import { MapPin, Phone, Mail, Globe, ExternalLink, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Agenții Imobiliare | AiX OS",
  description:
    "Agenții imobiliare evaluate cu AiX Score. Buyer representation, seller services și network internațional.",
};

export default async function AgentiiPage() {
  const agencies = await getAgencies();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Agenții Partenere"
        title="Rețea de Agenții Evaluate"
        subtitle="Fiecare agenție din ecosistemul AiX OS este evaluată transparent pe baza track record-ului, calității serviciilor și performanței pe piață."
      />

      {/* Featured agency — Cristian Văduva */}
      <div className="mb-10 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-zinc-900/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-3xl font-light text-amber-400">CV</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <p className="text-xs uppercase tracking-widest text-amber-500/80">Agenție Featured</p>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                ★ Partner Oficial
              </span>
            </div>
            <h2 className="text-xl font-medium text-white mb-1">Cristian Văduva Real Estate</h2>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed max-w-2xl">
              Buyer &amp; Seller Representation, Market Intelligence și acces la proprietăți off-market.
              Monaco · Dubai · București — parte din ecosistemul AiX OS.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href={`tel:${brandContent.contact.phoneRORaw}`}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors">
                <Phone className="h-3.5 w-3.5" />
                {brandContent.contact.phoneRO}
              </a>
              <a href={`mailto:${brandContent.contact.email}`}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors">
                <Mail className="h-3.5 w-3.5" />
                {brandContent.contact.email}
              </a>
              <a href={brandContent.urls.luxury} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors">
                <Globe className="h-3.5 w-3.5" />
                AiXLuxury.com
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <ScoreBadge score={9.5} size="lg" />
            <a href={brandContent.contact.whatsappText} target="_blank" rel="noopener noreferrer"
              className="rounded-full bg-amber-500/90 px-5 py-2.5 text-sm font-medium text-black hover:bg-amber-400 transition-all text-center">
              Contactează →
            </a>
          </div>
        </div>
      </div>

      {/* Agency grid */}
      {agencies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500">Nu există agenții active momentan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">AiX OS Network</p>
        <h3 className="text-2xl font-light text-white mb-3">Ești agent imobiliar?</h3>
        <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
          Intră în ecosistemul AiX OS și accesează un flux calificat de cumpărători cu putere de decizie.
        </p>
        <a
          href={brandContent.contact.whatsappText}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-8 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all"
        >
          Discută cu Cristian Văduva →
        </a>
      </div>
    </div>
  );
}

interface AgencyCardProps {
  agency: {
    id: string;
    slug: string;
    name: string;
    description: string;
    logo_url?: string;
    website?: string;
    phone?: string;
    email?: string;
    city?: string;
    aix_score?: number;
    properties_count?: number;
    status: string;
  };
}

function AgencyCard({ agency }: AgencyCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4 hover:border-amber-500/30 transition-all">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-14 w-14 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center overflow-hidden">
          {agency.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agency.logo_url} alt={agency.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-medium text-amber-400">
              {agency.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors truncate">
            {agency.name}
          </h3>
          {agency.city && (
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {agency.city}
            </p>
          )}
        </div>
        <ScoreBadge score={agency.aix_score} size="sm" />
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1">
        {agency.description}
      </p>

      {/* Stats row */}
      {agency.properties_count != null && (
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Star className="h-3 w-3 text-amber-500/60" />
          <span>{agency.properties_count} proprietăți gestionate</span>
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-2 pt-2 border-t border-zinc-800">
        {agency.phone && (
          <a href={`tel:${agency.phone.replace(/\s/g, "")}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-zinc-700 py-2 text-xs text-zinc-300 hover:border-amber-500/30 hover:text-white transition-all">
            <Phone className="h-3 w-3" />
            Sună
          </a>
        )}
        {agency.email && (
          <a href={`mailto:${agency.email}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-zinc-700 py-2 text-xs text-zinc-300 hover:border-amber-500/30 hover:text-white transition-all">
            <Mail className="h-3 w-3" />
            Email
          </a>
        )}
        {agency.website && (
          <a href={agency.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 rounded-full border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:border-amber-500/30 hover:text-white transition-all">
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {!agency.phone && !agency.email && (
          <Link href={`/agentii/${agency.slug}`}
            className="flex flex-1 items-center justify-center rounded-full border border-zinc-700 py-2 text-xs text-zinc-300 hover:border-amber-500/30 hover:text-white transition-all">
            Vezi profil →
          </Link>
        )}
      </div>
    </div>
  );
}