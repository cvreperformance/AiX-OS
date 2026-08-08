// src/services/aix-intelligence/feedConfig.ts
/**
 * Configuration for Real Estate RSS feeds.
 * Each source is enabled only when its corresponding environment variable
 * (REAL_ESTATE_RSS_<SOURCE_ID>) is set to a real, publicly accessible feed URL.
 * No placeholder or fabricated URLs are added.
 */
export interface FeedSourceConfig {
  id: string; // matches the source id used in TRUSTED_REAL_ESTATE_SOURCES
  displayName: string;
  trustedDomains: string[]; // domains that are allowed for URLs from this source
  feedUrlEnv: string; // name of the env var that should contain the feed URL
  enabled: boolean; // true when the env var is defined and non‑empty
}

// Import the list of trusted sources to keep source IDs in sync.
import { TRUSTED_REAL_ESTATE_SOURCES } from "./sources";

export const FEED_CONFIG: FeedSourceConfig[] = TRUSTED_REAL_ESTATE_SOURCES.map((src) => {
  const envVar = `REAL_ESTATE_RSS_${src.id.toUpperCase()}`;
  const feedUrl = process.env[envVar];
  return {
    id: src.id,
    displayName: src.name,
    trustedDomains: src.domains ?? [],
    feedUrlEnv: envVar,
    enabled: Boolean(feedUrl && feedUrl.trim().length > 0),
  };
});
