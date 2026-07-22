// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonLd = Record<string, any>;

import { headers } from "next/headers";

export async function getDynamicOrigin(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || headersList.get("x-forwarded-host");
    if (host) {
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      return `${protocol}://${host}`;
    }
  } catch (e) {
    // fallback for build/static generation
  }
  return "https://os.cristianvaduva.com";
}

/**
 * Builds a canonical URL for the site.
 */
export async function canonical(path: string): Promise<string> {
  const base = await getDynamicOrigin();
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
  url: "https://os.cristianvaduva.com",
  logo: "https://os.cristianvaduva.com/logo.png",
  description:
    "See market changes faster and make better decisions. Understand if a property is worth the asking price before buying.",
  sameAs: [
    "https://cristianvaduva.com",
    "https://os.aixluxury.com",
    "https://www.linkedin.com/in/cristianvăduva",
    "https://www.facebook.com/CristianVaduvaCV",
    "https://instagram.com/cristian_vaduva_cristianv",
    "https://youtube.com/@CristianVaduvaCV",
    "https://www.tiktok.com/@cristianvaduvacv",
    "https://t.me/capitalinvestcristianvaduva"
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
export async function buildPropertySchema(property: {
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  location: string;
  city: string;
  area_sqm?: number | null;
  image_url?: string | null;
  slug: string;
}): Promise<JsonLd> {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? property.title,
    url: await canonical(`/proprietati/${property.slug}`),
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
