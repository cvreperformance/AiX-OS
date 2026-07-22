// src/lib/providers/newsRss.provider.ts

import Parser from "rss-parser";
import { IDataProvider } from "../dataHub/IDataProvider";
import { NewsItem } from "../types/news";
import { supabaseAdmin as supabase } from "../supabase/admin";
import { slugify } from "../utils";
import { computeNewsScore } from "../market/aiScoreEngine";

/**
 * NewsRssProvider fetches real RSS feeds, normalises them to `NewsItem`,
 * and upserts them into the Supabase `news` table.
 *
 * It de‑duplicates based on the `slug` field – if an article with the same slug
 * already exists, it will be ignored (Supabase upsert with `onConflict: 'slug'`).
 */
export class NewsRssProvider implements IDataProvider<NewsItem> {
  private parser: Parser;
  private feedUrl: string;

  constructor(feedUrl: string) {
    this.feedUrl = feedUrl;
    this.parser = new Parser({});
  }

  /** Fetch the RSS feed, transform items, and store them in Supabase */
  async fetchAndStore(): Promise<void> {
    try {
      const feed = await this.parser.parseURL(this.feedUrl);
      if (!feed?.items?.length) return;

      const records: Omit<NewsItem, "id">[] = [];

      for (const item of feed.items) {
        const title = item.title ?? "Untitled";
        const summary = item.contentSnippet ?? item.content ?? "";
        const categories = (item.categories ?? []).map(c => c.toLowerCase());

        // 1. Validation: Block generic test content
        if (/^(test\b|dummy\b|demo\b)/i.test(title.trim()) || /^(test\b|dummy\b|demo\b)/i.test(summary.trim())) {
          console.log(`[Ingest Filter] Skipped test article: "${title}"`);
          continue;
        }

        // 2. Reject explicit irrelevant categories
        const rejectCategories = ["sport", "fotbal", "monden", "divertisment", "lifestyle", "showbiz", "vedete", "horoscop", "timp liber", "auto", "politic", "politica", "alegeri", "guvern", "parlament", "justiție", "justitie", "externe", "internațional", "international"];
        if (categories.some(cat => rejectCategories.includes(cat))) {
          console.log(`[Ingest Filter] Skipped irrelevant category for: "${title}"`);
          continue;
        }

        // 3. Relevance check: must be connected to economics, finance, real estate, macro, etc.
        const combined = `${title} ${summary} ${categories.join(" ")}`.toLowerCase();
        
        // Strict list of positive relevance keywords (focused on real estate and property macro)
        const relevanceKeywords = [
          "imobiliar", "apartament", "casă", "case", "rezidențial", "clădire", "locuință",
          "dobândă", "dobânzi", "credit", "credite", "ipotecar", "robor", "ircc", "bnr",
          "dezvoltator", "construcții", "constructii", "asigurare", "asigurări",
          "chirie", "chirii", "teren", "terenuri", "birouri", "logistic", "industrial",
          "proprietat", "imobil", "euribor", "bce", "bancă", "banca", "creditare"
        ];

        const isRelevant = relevanceKeywords.some(keyword => combined.includes(keyword));
        
        // Also reject explicitly generic political, sports, and celebrity content
        const strictRejectKeywords = [
          "fotbal", "campionat", "semifinală", "sportiv", "liga 1", "tenis", "olimpiada", 
          "meci", "nicușor dan", "nicusor dan", "ciolacu", "ciucă", "iohannis", "alegeri", 
          "parlament", "guvern", "politic", "pnl", "psd", "usr", "aur", "sosoaca", 
          "șoșoacă", "bătălia", "crimă", "accident", "poliția", "vedetă", "divorț"
        ];
        const containsStrictReject = strictRejectKeywords.some(keyword => combined.includes(keyword));

        if (!isRelevant || containsStrictReject) {
          console.log(`[Ingest Filter] Skipped irrelevant content for: "${title}"`);
          continue;
        }

        const published = item.isoDate ?? item.pubDate ?? new Date().toISOString();
        const slug = slugify(title);

        // Determine category mapping
        let category = "Markets";
        if (combined.includes("imobiliar") || combined.includes("apartament") || combined.includes("locuință")) {
          category = "Real Estate";
        } else if (combined.includes("construc")) {
          category = "Construction";
        } else if (combined.includes("asigur")) {
          category = "Insurance";
        } else if (combined.includes("finan") || combined.includes("dobân") || combined.includes("robor") || combined.includes("ircc")) {
          category = "Finance";
        } else if (combined.includes("investi")) {
          category = "Investments";
        }

        // 4. Calculate AiX Score
        const scoreResult = computeNewsScore(title, summary);

        records.push({
          slug,
          title,
          summary,
          content: item.content ?? summary,
          category,
          source_url: item.link ?? "",
          published_at: published,
          aix_score: scoreResult.score,
          score_explanation: scoreResult.explanation,
          investment_insight: scoreResult.insight,
          status: "published"
        });
      }

      if (records.length === 0) {
        console.log("[Ingest] No relevant records to upsert.");
        return;
      }

      // Upsert – on conflict on `slug` we ignore/keep existing rows
      const { error } = await supabase.from("news").upsert(records, {
        onConflict: "slug",
        ignoreDuplicates: true,
      });

      if (error) {
        console.error("NewsRssProvider upsert error:", error);
      } else {
        console.log(`[Ingest] Successfully upserted ${records.length} relevant articles.`);
      }
    } catch (err) {
      console.error("NewsRssProvider fetch error:", err);
    }
  }

  /** IDataProvider implementation – reads all stored news */
  async fetchAll(): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(50);
    if (error) {
      console.error("NewsRssProvider fetchAll error:", error);
      return [];
    }
    return data ?? [];
  }

  async fetchById(id: string): Promise<NewsItem | null> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("NewsRssProvider fetchById error:", error);
      return null;
    }
    return data ?? null;
  }
}
