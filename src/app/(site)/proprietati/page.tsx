import type { Metadata } from "next";
import { getProperties } from "@/lib/data";
import { PropertyCard, PageHeader } from "@/components/ui";
import { getMarketIndicators } from "@/lib/data";
import { getRomanianMarketPulse } from "@/lib/market";
import { brandContent } from "@/lib/content/brand";
import Link from "next/link";
import { Filter, TrendingUp, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Proprietăți | AiX OS — Imobiliare Premium Evaluate",
  description:
    "Proprietăți imobiliare premium în București, Monaco și Dubai. Fiecare proprietate este analizată și evaluată cu sistemul proprietar AiX OS Score.",
};

const PROPERTY_TYPES = ["Toate", "Penthouse", "Vilă", "Apartament", "Studio"];
const LOCATIONS = ["Toate", "Floreasca", "Herăstrău", "Pipera", "Monaco", "Dubai"];

export default async function ProprietatiPage() {
  const [properties, pulse] = await Promise.all([
    getProperties(),
    Promise.resolve(getRomanianMarketPulse()),
  ]);

  const indicators = getMarketIndicators().slice(0, 4);
  const featured = properties.filter((p) => p.featured);
  const regular = properties.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      {/* Hero header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          badge="Proprietăți"
          title="Imobiliare Premium Evaluate"
          subtitle="Fiecare proprietate este analizată și evaluată cu AiX Score — un sistem proprietar de intelligence imobiliar."
        />
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <div className={`text-right`}>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Sentiment piață</p>
            <p className={`text-lg font-semibold ${pulse.color}`}>
              {pulse.emoji} {pulse.label}
            </p>
          </div>
          <Link
            href="/oportunitati"
            className="rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs text-amber-400 hover:bg-amber-500/20 transition-all"
          >
            Oportunități exclusive →
          </Link>
        </div>
      </div>

      {/* Micro market ticker */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {indicators.map((ind) => (
          <div key={ind.label} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-3">
            <p className="text-xs text-zinc-500 mb-1">{ind.label}</p>
            <p className="text-sm font-medium text-white">{ind.value}</p>
            {ind.change && (
              <p className={`text-xs mt-0.5 ${ind.trend === "up" ? "text-emerald-400" : ind.trend === "down" ? "text-red-400" : "text-zinc-400"}`}>
                {ind.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Filter bar (visual — server component) */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 pr-2 border-r border-zinc-800">
            <Filter className="h-3 w-3" /> Tip:
          </span>
          {PROPERTY_TYPES.map((t) => (
            <span key={t} className={`rounded-full px-3 py-1 text-xs border transition-colors cursor-default ${t === "Toate" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-zinc-800 text-zinc-500"}`}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 pr-2 border-r border-zinc-800">
            <MapPin className="h-3 w-3" /> Zonă:
          </span>
          {LOCATIONS.map((l) => (
            <span key={l} className={`rounded-full px-3 py-1 text-xs border transition-colors cursor-default ${l === "Toate" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-zinc-800 text-zinc-500"}`}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <h2 className="text-lg font-light text-white">Featured</h2>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs text-amber-400">
              {featured.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* All properties */}
      {regular.length > 0 && (
        <section className="mb-12">
          {featured.length > 0 && <h2 className="text-lg font-light text-white mb-6">Toate Proprietățile</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {properties.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <p className="text-zinc-500 text-lg">Nu există proprietăți active momentan.</p>
          <p className="text-zinc-600 text-sm">Contactează-ne pentru oferte off-market.</p>
          <a href={brandContent.contact.whatsappText} target="_blank" rel="noopener noreferrer"
            className="inline-flex rounded-full bg-amber-500/90 px-8 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all">
            WhatsApp →
          </a>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white mb-1">Nu ai găsit ce cauți?</p>
          <p className="text-sm text-zinc-400">
            Accesează lista de proprietăți off-market prin formularul dedicat sau contactează direct.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <a href={brandContent.urls.propertyForm} target="_blank" rel="noopener noreferrer"
            className="rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-2.5 text-sm text-amber-400 hover:bg-amber-500/20 transition-all">
            Formular cerere
          </a>
          <a href={brandContent.contact.whatsappText} target="_blank" rel="noopener noreferrer"
            className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm text-white hover:bg-emerald-500 transition-all">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
