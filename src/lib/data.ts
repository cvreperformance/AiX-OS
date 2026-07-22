import { createClient } from "@/lib/supabase/client";
import {
  agencies as demoAgencies,
  developers as demoDevelopers,
  newsArticles as demoNews,
  opportunities as demoOpportunities,
  properties as demoProperties,
} from "@/lib/demo-data";
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
    const { data: res, error } = await supabase.from("properties").select("id, slug, title, description, price, currency, city, location:neighborhood, property_type:category, area_sqm:usable_area, image_url, status, created_at, gallery, features").eq("status", "Published").order("created_at", { ascending: false });
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
      .select("id, slug, title, description, price, currency, city, location:neighborhood, property_type:category, area_sqm:usable_area, image_url, status, created_at, gallery, features")
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

export async function getNews(): Promise<NewsArticle[]> {
  const data = await fetchFromSupabase<NewsArticle>("news", "published_at", false, {
    column: "status",
    value: "published",
  });
  return data ?? demoNews;
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from("news").select("*").eq("slug", slug).maybeSingle();
    if (data) return data as NewsArticle;
  }
  return demoNews.find((n) => n.slug === slug) ?? null;
}

export async function getFeaturedNews(limit = 3): Promise<NewsArticle[]> {
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
  return data ?? demoDevelopers;
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
  return demoDevelopers.find((d) => d.slug === slug) ?? null;
}

// ===================== AGENCIES =====================

export async function getAgencies(): Promise<Agency[]> {
  const data = await fetchFromSupabase<Agency>("agencies", "created_at", false, {
    column: "status",
    value: "active",
  });
  return data ?? demoAgencies;
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
  return demoAgencies.find((a) => a.slug === slug) ?? null;
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
