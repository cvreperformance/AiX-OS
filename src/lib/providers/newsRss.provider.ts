// src/lib/providers/newsRss.provider.ts

import Parser from "rss-parser";
import { IDataProvider } from "../dataHub/IDataProvider";
import { NewsItem } from "../types/news";
import { supabaseAdmin as supabase } from "../supabase/admin";

/**
 * NewsRssProvider fetches real RSS feeds, normalises them to `NewsItem`,
 * and upserts them into the Supabase `news` table.
 *
 * It de‑duplicates based on the `url` field – if an article with the same URL
 * already exists, it will be ignored (Supabase upsert with `onConflict: 'url'`).
 */
export class NewsRssProvider implements IDataProvider<NewsItem> {
  private parser: Parser;
  private feedUrl: string;

  constructor(feedUrl: string) {
    this.feedUrl = feedUrl;
    this.parser = new Parser({
      // default options are fine; can increase timeout if needed
    });
  }

  /** Fetch the RSS feed, transform items, and store them in Supabase */
  async fetchAndStore(): Promise<void> {
    try {
      const feed = await this.parser.parseURL(this.feedUrl);
      if (!feed?.items?.length) return;

      const records: NewsItem[] = feed.items.map((item) => {
        // Normalise – some RSS fields may be missing; we provide fallbacks
        const published = item.isoDate ?? item.pubDate ?? new Date().toISOString();
        // Determine category from feed metadata or fallback to "general"
        const category = feed.title?.toLowerCase().includes("real estate")
          ? "Real Estate"
          : feed.title?.toLowerCase().includes("construction")
          ? "Construction"
          : "General";

        return {
          id: "", // let Supabase generate UUID via default
          title: item.title ?? "Untitled",
          url: item.link ?? "",
          source: feed.title ?? "RSS Feed",
          category,
          published_at: published,
          content: item.contentSnippet ?? item.content ?? undefined,
        } as NewsItem;
      });

      // Upsert – on conflict on `url` we keep existing rows (no duplicates)
      const { error } = await supabase.from("news").upsert(records, {
        onConflict: "url",
        ignoreDuplicates: true,
      });
      if (error) {
        console.error("NewsRssProvider upsert error:", error);
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
