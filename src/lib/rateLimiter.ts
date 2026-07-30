import { headers } from 'next/headers';

/**
 * Simple in‑memory rate limiter per IP.
 * Allows `RATE_LIMIT_MAX` attempts within `RATE_LIMIT_WINDOW_MS`.
 */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  // Remove timestamps older than the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitMap.set(ip, recent);

  if (recent.length > RATE_LIMIT_MAX) {
    return { allowed: false, reason: 'Rate limit exceeded' };
  }
  return { allowed: true };
}

/**
 * For testing/debugging – clear all rate‑limit data.
 */
export function resetRateLimits() {
  rateLimitMap.clear();
}
