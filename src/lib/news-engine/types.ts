// src/lib/news-engine/types.ts
// Production Real Estate News Engine Types for AiX OS™

export type TaxonomyCategory =
  | "MARKET"
  | "PRICES"
  | "TRANSACTIONS"
  | "RESIDENTIAL"
  | "LUXURY"
  | "COMMERCIAL"
  | "OFFICE"
  | "RETAIL"
  | "INDUSTRIAL"
  | "LOGISTICS"
  | "LAND"
  | "INVESTMENT"
  | "DEVELOPERS"
  | "CONSTRUCTION"
  | "MORTGAGES"
  | "FINANCING"
  | "TAX"
  | "VAT"
  | "URBANISM"
  | "INFRASTRUCTURE"
  | "RENTAL"
  | "REGULATION"
  | "MACROECONOMICS";

export interface ExtractedIntelligence {
  location?: {
    country?: string;
    city?: string;
    district?: string;
    neighborhood?: string;
  };
  property_segment?: string;
  market_segment?: string;
  developer?: string;
  company?: string;
  metrics?: {
    price_eur?: number | null;
    price_ron?: number | null;
    sqm_price_eur?: number | null;
    transaction_volume_eur?: number | null;
    num_transactions?: number | null;
    interest_rate_pct?: number | null;
    vat_pct?: number | null;
    rental_yield_pct?: number | null;
  };
  tags: string[];
}

export interface RealEstateNewsArticle {
  id?: string;
  source: string;
  source_name: string;
  source_url: string;
  canonical_url?: string | null;
  title: string;
  original_title?: string | null;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  summary?: string | null;
  image_url?: string | null;
  author?: string | null;
  published_at: string;
  discovered_at?: string;
  updated_at?: string;

  category: TaxonomyCategory;
  subcategory?: string | null;

  country?: string | null;
  city?: string | null;
  district?: string | null;
  neighborhood?: string | null;

  property_segment?: string | null;
  market_segment?: string | null;

  importance_score: number;
  relevance_score: number;
  credibility_score: number;
  aix_score: number;

  is_featured: boolean;
  is_breaking: boolean;
  is_published: boolean;
  is_archived: boolean;

  tags: string[];
  metadata: Record<string, any>;
  content_hash: string;
  created_at?: string;
}

export interface NewsSourceConfig {
  source_key: string;
  name: string;
  feed_url: string;
  website_url: string;
  category_default: TaxonomyCategory;
  credibility_score: number;
}

export interface IngestionResult {
  runAt: string;
  durationMs: number;
  articlesIngested: number;
  articlesRejected: number;
  articlesDeduplicated: number;
  status: "SUCCESS" | "DEGRADED" | "FAILURE";
  errors: string[];
}

export interface SourceHealthStatus {
  name: string;
  source_key: string;
  feed_url: string;
  website_url: string;
  credibility_score: number;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  last_successful_fetch: string | null;
  last_failed_fetch: string | null;
  failure_count: number;
  response_time_ms: number;
  articles_count: number;
}
