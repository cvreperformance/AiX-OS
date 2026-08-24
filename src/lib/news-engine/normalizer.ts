// src/lib/news-engine/normalizer.ts
// Production Normalizer for AiX OS™ Real Estate News Engine

import crypto from "crypto";

export function normalizeUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    // Remove tracking query parameters
    const params = new URLSearchParams(url.search);
    const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "oc", "fbclid", "gclid"];
    trackingKeys.forEach(k => params.delete(k));
    url.search = params.toString();
    return url.toString();
  } catch {
    return urlStr.trim();
  }
}

export function generateContentHash(title: string, sourceUrl: string): string {
  const cleanTitle = title.trim().toLowerCase().replace(/\s+/g, " ");
  const cleanUrl = normalizeUrl(sourceUrl).toLowerCase();
  const input = `${cleanTitle}|${cleanUrl}`;
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function slugifyTitle(title: string): string {
  const normalized = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized.slice(0, 100) || `stire-${Date.now()}`;
}

export function stripHtml(htmlStr: string): string {
  if (!htmlStr) return "";
  return htmlStr
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function parsePublishedDate(rawDate?: string | null): string {
  if (!rawDate) return new Date().toISOString();
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      // Do not allow future dates beyond 5 minutes drift
      const now = Date.now();
      if (d.getTime() > now + 300000) {
        return new Date(now).toISOString();
      }
      return d.toISOString();
    }
  } catch {
    // Fallback
  }
  return new Date().toISOString();
}
