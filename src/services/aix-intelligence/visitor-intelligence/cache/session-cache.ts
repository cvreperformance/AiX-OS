import { VisitorIntelligence } from "../index";

export class SessionIntelligenceCache {
  private static cacheMap = new Map<string, { intelligence: VisitorIntelligence; cachedAt: number }>();
  private static TTL_MS = 10 * 60 * 1000; // 10 minutes TTL

  public static getCacheKey(sessionId: string, lastTimestamp: string): string {
    return `${sessionId}:${lastTimestamp}`;
  }

  public static get(sessionId: string, lastTimestamp: string): VisitorIntelligence | null {
    if (!sessionId || !lastTimestamp) return null;
    const key = this.getCacheKey(sessionId, lastTimestamp);
    const entry = this.cacheMap.get(key);
    if (!entry) return null;

    if (Date.now() - entry.cachedAt > this.TTL_MS) {
      this.cacheMap.delete(key);
      return null;
    }

    return entry.intelligence;
  }

  public static set(sessionId: string, lastTimestamp: string, intelligence: VisitorIntelligence): void {
    if (!sessionId || !lastTimestamp) return;
    const key = this.getCacheKey(sessionId, lastTimestamp);
    this.cacheMap.set(key, {
      intelligence,
      cachedAt: Date.now()
    });

    // Cleanup cache size if it exceeds 1000 entries
    if (this.cacheMap.size > 1000) {
      const firstKey = this.cacheMap.keys().next().value;
      if (firstKey) this.cacheMap.delete(firstKey);
    }
  }

  public static clear(): void {
    this.cacheMap.clear();
  }
}
