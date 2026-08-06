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
    "https://homefind.cristianvaduva.com",
    "https://insurance.cristianvaduva.com",
    "https://credite.cristianvaduva.com",
    "https://subventii.cristianvaduva.com",
    "https://aixmedia.cristianvaduva.com",
    "https://health.cristianvaduva.com",
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
 * Default Person schema.
 */
export const personSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Cristian Vaduva",
  "url": "https://cristianvaduva.com",
  "jobTitle": "Founder & Principal Investor",
  "worksFor": {
    "@type": "Organization",
    "name": "AiX OS™"
  },
  "sameAs": [
    "https://www.linkedin.com/in/cristianvăduva",
    "https://www.facebook.com/CristianVaduvaCV",
    "https://instagram.com/cristian_vaduva_cristianv"
  ]
};

/**
 * SoftwareApplication schema.
 */
export const softwareApplicationSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AiX OS™",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  }
};

/**
 * WebApplication schema.
 */
export const webApplicationSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AiX OS™ Private Portal",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "browserRequirements": "Requires JavaScript. Requires HTML5."
};

/**
 * BreadcrumbList builder.
 */
export function buildBreadcrumbSchema(items: { name: string; item: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": it.name,
      "item": it.item
    }))
  };
}

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
  video_url?: string | null;
  video_provider?: string | null;
  video_thumbnail?: string | null;
}): Promise<JsonLd> {
  const propertyCanonicalUrl = await canonical(`/proprietati/${property.slug}`);

  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? property.title,
    url: propertyCanonicalUrl,
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

  if (property.video_url) {
    schema.subjectOf = {
      "@type": "VideoObject",
      name: `${property.title} — Virtual Video Tour`,
      description: property.description ?? property.title,
      thumbnailUrl: property.video_thumbnail ? [property.video_thumbnail] : undefined,
      embedUrl: property.video_url,
      contentUrl: property.video_url,
      uploadDate: "2026-08-01T08:00:00+00:00",
    };
  }

  return schema;
}
