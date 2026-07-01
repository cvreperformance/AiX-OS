import { createClient } from "@/lib/supabase/client";

// ===================== PROPERTIES =====================

export async function getProperties() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*");

  console.log("PROPERTIES DATA:", data);
  console.log("PROPERTIES ERROR:", error);

  return data ?? [];
}

// ===================== SINGLE PROPERTY =====================

export async function getProperty(slug: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  return data ?? null;
}
export async function getFeaturedProperties() {
  const all = await getProperties();
  return all.filter((p: any) => p.featured).slice(0, 3);
}

export function getMarketIndicators() {
  return [];
}

export async function getNews() {
  const supabase = createClient();

  const { data } = await supabase
    .from("news")
    .select("*");

  return data ?? [];
}

export async function getOpportunities() {
  const supabase = createClient();

  const { data } = await supabase
    .from("opportunities")
    .select("*");

  return data ?? [];
}