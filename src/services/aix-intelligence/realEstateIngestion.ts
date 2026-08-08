// src/services/aix-intelligence/realEstateIngestion.ts

import { supabaseAdmin } from "../../lib/supabase/admin";
import { NewsRssProvider } from "../../lib/providers/newsRss.provider";
import { isRealEstateArticle } from "./validation";
import { deriveSourceFromUrl } from "./source";
import { TRUSTED_REAL_ESTATE_SOURCES } from "./sources";
import { validateSupabaseEnv } from "./validateEnv";

/**
 * Ingestion pipeline for real‑estate intelligence.
 * Returns a summary object for CLI reporting.
 */
export interface IngestionStats {
  feedsConfigured: number;
  feedsUnavailable: number;
  articlesFetched: number;
  articlesRejected: number;
  urlsVerified: number;
  articlesStored: number;
  errors: string[];
}

export async function runRealEstateIngestion(): Promise<IngestionStats> {
  // Validate Supabase configuration first.
  try {
    validateSupabaseEnv();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { feedsConfigured: 0, feedsUnavailable: 0, articlesFetched: 0, articlesRejected: 0, urlsVerified: 0, articlesStored: 0, errors: [msg] };
  }

  let feedsConfigured = 0;
  let feedsUnavailable = 0;
  let totalFetched = 0;
  const errors: string[] = [];

  for (const src of TRUSTED_REAL_ESTATE_SOURCES) {
    const envVar = `REAL_ESTATE_RSS_${src.id.toUpperCase()}`;
    const feedUrl = process.env[envVar];
    if (!feedUrl) {
      console.warn(`[RealEstateIngestion] No RSS URL configured for ${src.name} (expected env ${envVar})`);
      feedsUnavailable++;
      continue;
    }
    feedsConfigured++;
    const provider = new NewsRssProvider(feedUrl);
    try {
      await provider.fetchAndStore();
      console.log(`[RealEstateIngestion] Fetched feed for ${src.name}`);
      totalFetched++;
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      console.error(`[RealEstateIngestion] Error fetching ${src.name}:`, err);
      errors.push(`Fetch error for ${src.name}: ${err}`);
    }
  }

  // Verify stored articles
  const { data: articles, error } = await supabaseAdmin
    .from("news")
    .select("id, source_url, title, summary, category, country, published_at, image_url");
  if (error) {
    const errMsg = error.message ?? "unknown";
    console.error("[RealEstateIngestion] Error fetching news for verification:", errMsg);
    errors.push(`Verification fetch error: ${errMsg}`);
    return { feedsConfigured, feedsUnavailable, articlesFetched: totalFetched, articlesRejected: 0, urlsVerified: 0, articlesStored: 0, errors };
  }
  if (!articles) {
    return { feedsConfigured, feedsUnavailable, articlesFetched: totalFetched, articlesRejected: 0, urlsVerified: 0, articlesStored: 0, errors };
  }

  let rejected = 0;
  let verified = 0;
  let urlVerifiedCount = 0;

  for (const a of articles) {
    const url = a.source_url as string;
    const sourceName = deriveSourceFromUrl(url ?? "");
    const isTrusted = sourceName !== null;
    let reachable = false;
    try {
      const res = await fetch(url, { method: "HEAD" });
      reachable = res.ok;
    } catch {
      reachable = false;
    }
    if (reachable) urlVerifiedCount++;
    const articleObj = {
      id: a.id,
      title: a.title,
      summary: a.summary,
      source_url: url,
      source: sourceName,
      category: a.category,
      country: a.country,
      published_at: a.published_at,
      image_url: a.image_url,
    } as any;
    const passes = reachable && isTrusted && isRealEstateArticle(articleObj);
    if (!passes) {
      rejected++;
      const { error: delErr } = await supabaseAdmin.from("news").delete().eq("id", a.id);
      if (delErr) {
        console.error(`[RealEstateIngestion] Failed to delete invalid article ${a.id}:`, delErr);
        errors.push(`Delete error for ${a.id}: ${delErr.message}`);
      } else {
        console.log(`[RealEstateIngestion] removed unverified article ${a.id}`);
      }
    } else {
      const { error: updErr } = await supabaseAdmin
        .from("news")
        .update({ verification_status: "verified", verified_at: new Date().toISOString() })
        .eq("id", a.id);
      if (updErr) {
        console.error(`[RealEstateIngestion] Failed to set verified status for ${a.id}:`, updErr);
        errors.push(`Verification update error for ${a.id}: ${updErr.message}`);
      } else {
        verified++;
      }
    }
  }

  return {
    feedsConfigured,
    feedsUnavailable,
    articlesFetched: totalFetched,
    articlesRejected: rejected,
    urlsVerified: urlVerifiedCount,
    articlesStored: verified,
    errors,
  };
}

