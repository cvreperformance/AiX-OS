export interface Article {
  id: string;
  slug?: string;
  title: string;
  source: string;
  sourceUrl: string;
  articleUrl: string;
  publishedAt: string;
  published_at?: string;
  country: string;
  category: string;
  summary: string;
  content?: string;
  aix_score?: number;
  score_explanation?: string;
  investment_insight?: string;
  image_url?: string | null;
}
