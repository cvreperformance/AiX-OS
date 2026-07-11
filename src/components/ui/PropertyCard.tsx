import Link from "next/link";
import { PropertyImage } from "./PropertyImage";
import { ScoreBadge } from "./ScoreBadge";
import { getPropertyImages } from "@/lib/storage";
import { formatPrice } from "@/lib/format";
import type { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Pick<
    Property,
    | "slug"
    | "title"
    | "location"
    | "city"
    | "property_type"
    | "price"
    | "currency"
    | "image_url"
    | "gallery"
    | "aix_score"
    | "bedrooms"
    | "area_sqm"
  > & {
    resolved_image_url?: string | null;
    resolved_gallery?: string[];
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const images =
    property.resolved_image_url != null
      ? {
          primary: property.resolved_image_url,
          gallery: property.resolved_gallery ?? [],
        }
      : getPropertyImages(property);

  const price = formatPrice(property.price, property.currency);

  return (
    <Link
      href={`/proprietati/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/30 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <PropertyImage
          src={images.primary}
          alt={property.title}
          sizes="(max-width: 768px) 100vw, 33vw"
          propertyType={property.property_type}
        />
        <div className="absolute top-3 right-3 z-10">
          <ScoreBadge score={property.aix_score} size="sm" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
          <p className="text-2xl font-light text-zinc-900">{price}</p>
        </div>
      </div>
      <div className="p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="uppercase tracking-wider">{property.property_type}</span>
          <span>·</span>
          <span>
            {property.location}, {property.city}
          </span>
        </div>
        <h3 className="font-medium text-zinc-100 line-clamp-2 group-hover:text-amber-400 transition-colors">
          {property.title}
        </h3>
        <div className="flex gap-4 text-xs text-zinc-400">
          {property.bedrooms != null && <span>{property.bedrooms} camere</span>}
          {property.area_sqm != null && <span>{property.area_sqm} mp</span>}
        </div>
      </div>
    </Link>
  );
}
