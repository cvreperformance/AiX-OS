import type { Metadata } from "next";
import { NewsClientFeed } from "./NewsClientFeed";
import { RealEstateNewsArticle } from "@/lib/news-engine/types";
import { supabasePublic } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Real Estate Market Intelligence Feed | AiX OS™ Știri Imobiliare",
  description: "Monitorizare automată și analize sintetizate în timp real pentru piața imobiliară din România. RESIDENȚIAL, LUXURY, COMMERȚ, BIROURI, INDUSTRIAL.",
};

async function getLiveNewsArticles(): Promise<RealEstateNewsArticle[]> {
  try {
    const { data, error } = await supabasePublic
      .from("real_estate_news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Supabase news query error:", error);
      return [];
    }

    return (data || []) as RealEstateNewsArticle[];
  } catch (error) {
    console.error("Error fetching live news articles:", error);
    return [];
  }
}

export default async function NewsFeedPage() {
  const articles = await getLiveNewsArticles();

  const avgScore = articles.length > 0
    ? articles.reduce((acc, curr) => acc + (curr.aix_score || 8.0), 0) / articles.length
    : 8.4;

  const marketPulse = {
    label: "STABILITATE & CREȘTERE TEMPERATĂ",
    score: Number(avgScore.toFixed(1)),
    description: "Activitate susținută pe segmentul rezidențial de lux și cerere crescută pentru birouri clasa A.",
    emoji: "📈",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  };

  return <NewsClientFeed initialArticles={articles} marketPulse={marketPulse} />;
}