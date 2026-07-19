// src/lib/types/news.ts

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  category: string;
  published_at: string; // ISO date string
  content?: string;
}
