// src/lib/news-engine/sourceRegistry.ts
// Production Source Registry for AiX OS™ Real Estate News Engine

import { NewsSourceConfig } from "./types";

export const RECOMMENDED_NEWS_SOURCES: NewsSourceConfig[] = [
  {
    source_key: "zf_main",
    name: "Ziarul Financiar",
    feed_url: "https://www.zf.ro/rss",
    website_url: "https://www.zf.ro",
    category_default: "MARKET",
    credibility_score: 9.5,
  },
  {
    source_key: "economica_main",
    name: "Economica.net",
    feed_url: "https://www.economica.net/feed",
    website_url: "https://www.economica.net",
    category_default: "MARKET",
    credibility_score: 9.2,
  },
  {
    source_key: "financial_intelligence",
    name: "Financial Intelligence",
    feed_url: "https://financialintelligence.ro/feed",
    website_url: "https://financialintelligence.ro",
    category_default: "FINANCING",
    credibility_score: 9.3,
  },
  {
    source_key: "imobiliare_imoexpert",
    name: "Imobiliare.ro ImoExpert",
    feed_url: "https://www.imobiliare.ro/imoexpert/feed/",
    website_url: "https://www.imobiliare.ro/imoexpert",
    category_default: "RESIDENTIAL",
    credibility_score: 9.5,
  },
  {
    source_key: "news_ro",
    name: "News.ro",
    feed_url: "https://www.news.ro/rss",
    website_url: "https://www.news.ro",
    category_default: "MARKET",
    credibility_score: 8.8,
  },
  {
    source_key: "bursa_ro",
    name: "Bursa.ro",
    feed_url: "https://www.bursa.ro/rss",
    website_url: "https://www.bursa.ro",
    category_default: "INVESTMENT",
    credibility_score: 9.0,
  },
  {
    source_key: "g4media_ro",
    name: "G4Media Economie",
    feed_url: "https://www.g4media.ro/feed",
    website_url: "https://www.g4media.ro",
    category_default: "REGULATION",
    credibility_score: 8.8,
  },
];
