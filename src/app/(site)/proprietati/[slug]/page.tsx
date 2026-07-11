import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Ruler, BedDouble, Bath, Building2 } from "lucide-react";
import { PropertyGallery } from "@/components/ui/PropertyGallery";
import { ScoreCard } from "@/components/ui";
import { getProperty } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { buildPropertySchema } from "@/lib/seo";
import { brandContent } from "@/lib/content/brand";


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: "Proprietate negăsită" };
  return {
    title: property.title,
    description: property.description?.slice(0, 160),
    openGraph: property.resolved_image_url
      ? {
          images: [{ url: property.resolved_image_url }],
          title: property.title,
          description: property.description?.slice(0, 160),
          type: "website",
        }
      : undefined,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) notFound();

  const jsonLd = buildPropertySchema(property);

  const galleryImages =
    property.resolved_gallery.length > 0
      ? property.resolved_gallery
      : property.resolved_image_url
        ? [property.resolved_image_url]
        : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <Link
          href="/proprietati"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la proprietăți
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery — auto-discovers images from Supabase storage folder */}
          <PropertyGallery
            images={galleryImages}
            alt={property.title}
            storageFolder={slug}
            propertyType={property.property_type}
          />

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 text-sm text-zinc-400 mb-3">
                <span className="uppercase tracking-wider">{property.property_type}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.location}, {property.city}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-zinc-900 mb-4">
                {property.title}
              </h1>
              <p className="text-3xl font-light text-amber-400">
                {formatPrice(property.price, property.currency)}
              </p>
            </div>

            {/* Key facts */}
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              {property.area_sqm != null && (
                <span className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-zinc-400" />
                  {property.area_sqm} m²
                </span>
              )}
              {property.bedrooms != null && (
                <span className="flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-zinc-400" />
                  {property.bedrooms} camere
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-zinc-400" />
                  {property.bathrooms} băi
                </span>
              )}
              {property.property_type && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-zinc-400" />
                  {property.property_type}
                </span>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/30 p-5">
                <p className="text-zinc-600 leading-relaxed text-sm whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-400"
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

            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="block w-full rounded-full bg-amber-500/90 py-4 text-center text-sm font-medium text-black hover:bg-amber-400 transition-all"
              >
                Solicită Consultație Gratuită
              </Link>
              <a
                href={brandContent.contact.whatsappText}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full border border-zinc-300 py-3.5 text-center text-sm text-zinc-600 hover:border-amber-500/40 hover:text-zinc-900 transition-all animate-pulse"
              >
                💬 WhatsApp Direct
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
