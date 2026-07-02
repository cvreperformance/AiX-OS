import type { Metadata } from "next";
import { getOpportunities } from "@/lib/data";
import { OpportunityCard, PageHeader } from "@/components/ui";
import { brandContent } from "@/lib/content/brand";
import { TrendingUp, Lock, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Oportunități Investiții | AiX OS",
  description:
    "Oportunități imobiliare exclusive: off-market, dezvoltări, portofolii. Filtrate și evaluate cu AiX Score.",
};

export default async function OportunitatiPage() {
  const opportunities = await getOpportunities();

  const featured = opportunities.filter((o) => o.featured);
  const rest = opportunities.filter((o) => !o.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Oportunități Exclusive"
        title="Investiții Imobiliare Filtrate"
        subtitle="Oportunități rare: off-market, sub prețul pieței, yield ridicat sau potențial de apreciere accelerată. Evaluate și recomandate de Cristian Văduva."
      />

      {/* Why AiX bar */}
      <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Lock, label: "Off-Market", desc: "Listări nedisponibile public" },
          { icon: Shield, label: "Due Diligence", desc: "Verificate juridic" },
          { icon: TrendingUp, label: "AiX Scored", desc: "Analizate cu AI" },
          { icon: Clock, label: "Time-Sensitive", desc: "Disponibilitate limitată" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-medium text-white">{label}</p>
            </div>
            <p className="text-xs text-zinc-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Featured opportunities */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-light text-white">Featured</h2>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs text-amber-400">
              {featured.length} active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </section>
      )}

      {/* Other opportunities */}
      {rest.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-light text-white mb-6">Alte Oportunități</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {opportunities.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <div className="text-4xl">🔒</div>
          <p className="text-white text-xl font-light">Portofoliu în actualizare</p>
          <p className="text-zinc-500 max-w-md mx-auto">
            Oportunitățile off-market sunt disponibile pe bază de cerere directă.
            Contactează-ne pentru acces la lista privată.
          </p>
        </div>
      )}

      {/* Private access CTA */}
      <div className="mt-10 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-zinc-900/50 p-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-widest text-amber-500/80">Acces Privat</p>
          <h3 className="text-2xl font-light text-white">
            Lista completă off-market — disponibilă prin cerere
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Unele oportunități nu sunt afișate public. Investitori calificați cu minim €100K disponibil
            pot solicita acces la lista privată completă cu prețuri, locații și analize detaliate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={brandContent.urls.propertyForm}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-500/90 px-8 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all"
            >
              Solicită Lista Privată
            </a>
            <a
              href={brandContent.contact.whatsappText}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-700 px-8 py-3 text-sm text-zinc-300 hover:border-amber-500/30 hover:text-white transition-all"
            >
              WhatsApp Direct
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}