// src/lib/providers/news.provider.ts

import { IDataProvider } from "../dataHub/IDataProvider";
import { NewsItem } from "../types/news";
import { supabaseAdmin as supabase } from "../supabase/admin";

/**
 * NewsProvider fetches news items from Supabase `news` table.
 * It isolates the data source from UI and can be extended to call external APIs.
 */
export class NewsProvider implements IDataProvider<NewsItem> {
  async fetchAll(): Promise<NewsItem[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(50);
    if (error) {
      console.error("NewsProvider fetchAll error:", error);
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
      console.error("NewsProvider fetchById error:", error);
      return null;
    }
    return data ?? null;
  }
}
