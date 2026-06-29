import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ScoreCard } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { getProperty } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: "Proprietate negăsită" };
  return {
    title: property.title,
    description: property.description,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <Link
        href="/anunturi"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Înapoi la proprietăți
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {property.image_url && (
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={property.image_url}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
              <span className="uppercase tracking-wider">{property.property_type}</span>
              <span>·</span>
              <span>
                {property.location}, {property.city}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
              {property.title}
            </h1>
            <p className="text-3xl font-light text-amber-400">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>

          <div className="flex gap-6 text-sm text-zinc-400">
            {property.bedrooms && <span>{property.bedrooms} camere</span>}
            {property.bathrooms && <span>{property.bathrooms} băi</span>}
            {property.area_sqm && <span>{property.area_sqm} mp</span>}
          </div>

          <p className="text-zinc-300 leading-relaxed">{property.description}</p>

          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {property.features.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          <ScoreCard
            score={property.aix_score}
            explanation={property.score_explanation}
            insight={property.investment_insight}
          />

          <Link
            href="/contact"
            className="block w-full rounded-full bg-amber-500/90 py-4 text-center text-sm font-medium text-black hover:bg-amber-400 transition-all"
          >
            Solicită Consultație
          </Link>
        </div>
      </div>
    </div>
  );
}
