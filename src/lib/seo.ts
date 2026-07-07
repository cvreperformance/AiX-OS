// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonLd = Record<string, any>;

/**
 * Builds a canonical URL for the site.
 */
export function canonical(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aixos.ro";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/**
 * Builds OpenGraph image object from a URL.
 */
export function ogImage(url: string | null | undefined) {
  if (!url) return undefined;
  return [{ url, width: 1200, height: 630 }];
}

/**
 * Default site-level JSON-LD Organization schema.
 */
export const organizationSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AiX OS™",
  url: "https://aixos.ro",
  logo: "https://aixos.ro/logo.png",
  description:
    "AI-powered real estate operating system for investors. Market intelligence, buyer/seller representation, and investment analysis.",
  sameAs: [
    "https://cristianvaduva.com",
    "https://aixluxury.com",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Romanian", "English"],
  },
};

/**
 * Real estate listing JSON-LD schema builder.
 */
export function buildPropertySchema(property: {
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  location: string;
  city: string;
  area_sqm?: number | null;
  image_url?: string | null;
  slug: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? property.title,
    url: canonical(`/proprietati/${property.slug}`),
    image: property.image_url ? [property.image_url] : undefined,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.location,
      addressCountry: "RO",
    },
    floorSize: property.area_sqm
      ? { "@type": "QuantitativeValue", value: property.area_sqm, unitCode: "MTK" }
      : undefined,
  };
}
