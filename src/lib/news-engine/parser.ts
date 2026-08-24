// src/lib/news-engine/parser.ts
// Production RSS/Public Feed Parser for AiX OS™ Real Estate News Engine

import Parser from "rss-parser";
import { NewsSourceConfig } from "./types";
import { stripHtml } from "./normalizer";

export interface ParsedItem {
  title: string;
  sourceUrl: string;
  publishedAt?: string;
  content: string;
  excerpt: string;
  author?: string;
  imageUrl?: string;
}

export async function fetchAndParseFeed(source: NewsSourceConfig): Promise<{ items: ParsedItem[]; durationMs: number }> {
  const startTime = Date.now();

  const res = await fetch(source.feed_url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status} fetching ${source.feed_url}`);
  }

  const xmlText = await res.text();

  const parser = new Parser({
    customFields: {
      item: [
        ["media:content", "mediaContent", { keepArray: true }],
        ["enclosure", "enclosure"],
        ["dc:creator", "creator"],
      ],
    },
  });

  const feed = await parser.parseString(xmlText);
  const durationMs = Date.now() - startTime;

  if (!feed.items || feed.items.length === 0) {
    return { items: [], durationMs };
  }

  const items: ParsedItem[] = [];

  for (const item of feed.items) {
    const rawTitle = item.title?.trim();
    const sourceUrl = item.link?.trim();

    if (!rawTitle || !sourceUrl) continue;

    const contentRaw = item.contentSnippet || item.content || item.summary || "";
    const cleanContent = stripHtml(contentRaw);

    // Extract image URL if available
    let imageUrl: string | undefined;
    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith("image")) {
      imageUrl = item.enclosure.url;
    } else if (item.mediaContent && Array.isArray(item.mediaContent) && item.mediaContent[0]?.$.url) {
      imageUrl = item.mediaContent[0].$.url;
    } else if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1];
      }
    }

    items.push({
      title: rawTitle,
      sourceUrl,
      publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      content: cleanContent,
      excerpt: cleanContent.slice(0, 300),
      author: item.creator || item["dc:creator"] || source.name,
      imageUrl,
    });
  }

  return { items, durationMs };
}
