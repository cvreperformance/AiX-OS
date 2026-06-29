import {
  agencies as demoAgencies,
  developers as demoDevelopers,
  marketIndicators as demoIndicators,
  newsArticles as demoNews,
  opportunities as demoOpportunities,
  properties as demoProperties,
} from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type {
  Agency,
  Developer,
  MarketIndicator,
  NewsArticle,
  Opportunity,
  Property,
} from "@/lib/types";

async function fetchFromSupabase<T>(
  table: string,
  orderBy = "created_at",
  ascending = false
): Promise<T[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderBy, { ascending });

  if (error) return null;
  return data as T[];
}

export async function getProperties(): Promise<Property[]> {
  const data = await fetchFromSupabase<Property>("properties");
  return data ?? demoProperties;
}

export async function getProperty(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) return data as Property;
  }
  return demoProperties.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const all = await getProperties();
  return all.filter((p) => p.featured).slice(0, 3);
}

export async function getNews(): Promise<NewsArticle[]> {
  const data = await fetchFromSupabase<NewsArticle>("news", "published_at");
  return data ?? demoNews;
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) return data as NewsArticle;
  }
  return demoNews.find((n) => n.slug === slug) ?? null;
}

export async function getDevelopers(): Promise<Developer[]> {
  const data = await fetchFromSupabase<Developer>("developers");
  return data ?? demoDevelopers;
}

export async function getDeveloper(slug: string): Promise<Developer | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("developers")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) return data as Developer;
  }
  return demoDevelopers.find((d) => d.slug === slug) ?? null;
}

export async function getAgencies(): Promise<Agency[]> {
  const data = await fetchFromSupabase<Agency>("agencies");
  return data ?? demoAgencies;
}

export async function getAgency(slug: string): Promise<Agency | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("agencies")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) return data as Agency;
  }
  return demoAgencies.find((a) => a.slug === slug) ?? null;
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const data = await fetchFromSupabase<Opportunity>("opportunities");
  return data ?? demoOpportunities;
}

export async function getOpportunity(slug: string): Promise<Opportunity | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) return data as Opportunity;
  }
  return demoOpportunities.find((o) => o.slug === slug) ?? null;
}

export function getMarketIndicators(): MarketIndicator[] {
  return demoIndicators;
}
