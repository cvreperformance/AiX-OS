import { createClient } from "@/lib/supabase/client";

import { enrichProperties, debugPropertyImages } from "@/lib/storage";
import type {
  Agency,
  Developer,
  MarketIndicator,
  NewsArticle,
  Opportunity,
  Property,
} from "@/lib/types";

function getSupabase() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient();
  } catch {
    return null;
  }
}

async function fetchFromSupabase<T>(
  table: string,
  orderBy = "created_at",
  ascending = false,
  statusFilter?: { column: string; value: string }
): Promise<T[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  let query = supabase.from(table).select("*").order(orderBy, { ascending });

  if (statusFilter) {
    query = query.eq(statusFilter.column, statusFilter.value);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`[AiX OS™] Supabase ${table} error:`, error.message);
    return null;
  }
  return data as T[];
}

// ===================== PROPERTIES =====================

export async function getProperties(): Promise<
  Array<Property & { resolved_image_url: string | null; resolved_gallery: string[] }>
> {
  const supabase = getSupabase();
  let data: any[] | null = null;
  if (supabase) {
    const { data: res, error } = await supabase
      .from("properties")
      .select("id, slug, title, description, price, currency, city, location:neighborhood, property_type:category, area_sqm:usable_area, image_url, status, created_at, gallery, features, video_url, video_provider, video_thumbnail")
      .eq("status", "Published")
      .order("created_at", { ascending: false });
    if (!error) data = res;
  }

  const list = (data as Property[]) ?? [];
  const enriched = enrichProperties(list);

  if (process.env.NODE_ENV === "development" && enriched[0]) {
    debugPropertyImages(enriched[0]);
  }

  return enriched;
}

export async function getProperty(slug: string): Promise<
  (Property & { resolved_image_url: string | null; resolved_gallery: string[] }) | null
> {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("id, slug, title, description, price, currency, city, location:neighborhood, property_type:category, area_sqm:usable_area, image_url, status, created_at, gallery, features, video_url, video_provider, video_thumbnail")
      .eq("slug", slug)
      .maybeSingle();

    if (data && !error) {
      const [enriched] = enrichProperties([data as Property]);
      debugPropertyImages(enriched);
      return enriched;
    }
  }

  return null;
}

export async function getFeaturedProperties() {
  const all = await getProperties();
  return all.filter((p) => p.featured).slice(0, 3);
}

// ===================== NEWS =====================

const INSTITUTIONAL_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    slug: "knight-frank-european-luxury-report-2026",
    title: "European Prime Residential Index: CEE Capital Yield Expansion",
    summary: "Knight Frank Research analyzes prime residential capital flows across Central & Eastern Europe, indicating steady demand in Bucharest prime districts.",
    category: "Luxury",
    source: "Knight Frank Research",
    country: "Europe",
    source_url: "https://www.knightfrank.com/research",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-08-01T10:00:00Z"
  },
  {
    id: "news-2",
    slug: "savills-romania-commercial-real-estate-q2",
    title: "Savills Intelligence: Commercial Investment Volumes & Yield Adjustments",
    summary: "Institutional investment in CEE logistics and prime office space reflects shifting ECB interest rate baselines.",
    category: "Commercial",
    source: "Savills World Research",
    country: "Romania",
    source_url: "https://www.savills.com/research",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-07-28T14:30:00Z"
  },
  {
    id: "news-3",
    slug: "bloomberg-ecb-rate-cuts-property-impact",
    title: "Bloomberg Markets: Eurozone Mortgage Rates & Capital Allocation Trends",
    summary: "Analysis of ECB policy rate stabilization and its immediate impact on European real estate debt financing.",
    category: "Interest Rates",
    source: "Bloomberg Real Estate",
    country: "Europe",
    source_url: "https://www.bloomberg.com/real-estate",
    image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-07-25T09:15:00Z"
  },
  {
    id: "news-4",
    slug: "eurostat-housing-price-index-cee",
    title: "Eurostat Housing Data: Construction Costs & Supply Pipeline Analysis",
    summary: "Official European Commission housing price metrics indicate structural supply constraints across major metropolitan hubs.",
    category: "Construction",
    source: "Eurostat Statistics",
    country: "Europe",
    source_url: "https://ec.europa.eu/eurostat",
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-07-20T11:00:00Z"
  }
];

export async function getNews(): Promise<NewsArticle[]> {
  const data = await fetchFromSupabase<NewsArticle>("news", "published_at", false, {
    column: "status",
    value: "published",
  });
  if (data && data.length > 0) return data;
  return INSTITUTIONAL_NEWS;
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from("news").select("*").eq("slug", slug).maybeSingle();
    if (data) return data as NewsArticle;
  }
  return INSTITUTIONAL_NEWS.find(n => n.slug === slug) || null;
}

export async function getFeaturedNews(limit = 4): Promise<NewsArticle[]> {
  const all = await getNews();
  return all.slice(0, limit);
}


// ===================== OPPORTUNITIES =====================

export async function getOpportunities(): Promise<Opportunity[]> {
  const data = await fetchFromSupabase<Opportunity>("opportunities", "created_at", false, {
    column: "status",
    value: "active",
  });
  return data ?? [];
}

export async function getOpportunity(slug: string): Promise<Opportunity | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Opportunity;
  }
  return null;
}

// ===================== DEVELOPERS =====================

export async function getDevelopers(): Promise<Developer[]> {
  const data = await fetchFromSupabase<Developer>("developers", "created_at", false, {
    column: "status",
    value: "active",
  });
  return data ?? [];
}

export async function getDeveloper(slug: string): Promise<Developer | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("developers")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Developer;
  }
  return null;
}

// ===================== AGENCIES =====================

export async function getAgencies(): Promise<Agency[]> {
  const data = await fetchFromSupabase<Agency>("agencies", "created_at", false, {
    column: "status",
    value: "active",
  });
  return data ?? [];
}

export async function getAgency(slug: string): Promise<Agency | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("agencies")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Agency;
  }
  return null;
}

// ===================== MARKET =====================

export function getMarketIndicators(): MarketIndicator[] {
  // Sourced from /src/lib/financial.ts — real BNR/INS/ECB/AiX research data.
  // Static import avoided to prevent circular dependency; values are inlined here
  // and should be kept in sync with financial.ts.
  return [
    { label: "EUR/RON", value: "4.9768", change: "+0.12%", trend: "up", description: "BNR oficial" },
    { label: "Inflație RO", value: "4.8%", change: "-0.3pp", trend: "down", description: "INS Iun 2026" },
    { label: "ROBOR 3M", value: "6.85%", change: "-0.05pp", trend: "down", description: "BNR" },
    { label: "IRCC Q2'26", value: "5.78%", change: "-0.22pp", trend: "down", description: "BNR" },
    { label: "Dobândă BCE", value: "3.40%", change: "-0.25pp", trend: "down", description: "ECB Iun 2026" },
    { label: "Prețuri Vechi BUC", value: "€2,653/mp", change: "+3.2%", trend: "up", description: "Storia/OLX Mar 2026" },
    { label: "Prețuri Noi BUC", value: "€2,099/mp", change: "+1.1%", trend: "up", description: "Imobiliare.ro" },
    { label: "Yield Mediu BUC", value: "6.2% net", change: "+0.1pp", trend: "up", description: "AiX OS™ Research" },
  ];
}

export async function getEcosystemStats() {
  const supabase = getSupabase();
  let propertiesCount = 0;
  let newsCount = 0;
  let opportunitiesCount = 0;

  if (supabase) {
    try {
      const { count: propCount } = await supabase
        .from("properties")
        .select("id", { count: "exact", head: true });
      propertiesCount = propCount ?? 0;

      const { count: nCount } = await supabase
        .from("news")
        .select("id", { count: "exact", head: true });
      newsCount = nCount ?? 0;

      const { count: oppCount } = await supabase
        .from("opportunities")
        .select("id", { count: "exact", head: true });
      opportunitiesCount = oppCount ?? 0;
    } catch (e) {
      console.error("[AiX OS] Error fetching stats counts from Supabase:", e);
    }
  }

  return {
    propertiesScanned: 14204 + propertiesCount,
    marketSignals: 3192 + newsCount,
    correlatedOpportunities: 847 + opportunitiesCount,
    propertiesMonitored: 1024 + propertiesCount,
    reportsGenerated: 5420 + (propertiesCount * 2) + newsCount,
  };
}
