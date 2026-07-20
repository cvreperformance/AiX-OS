export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  image_url?: string;
  aix_score?: number;
  score_explanation?: string;
  investment_insight?: string;
  source_url?: string;
  status: string;
  published_at?: string;
}
