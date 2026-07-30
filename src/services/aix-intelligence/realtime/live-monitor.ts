import { RealtimeConfigManager } from "./config";
import { eventBus } from "./event-bus";

export interface ActiveVisitor {
  visitor_id: string;
  session_id: string;
  application: string;
  device: string;
  browser: string;
  country: string;
  last_page: string;
  last_activity: string; // ISO String
  session_start: string; // ISO String
}

export class LiveSessionMonitor {
  private static instance: LiveSessionMonitor;
  private activeVisitors = new Map<string, ActiveVisitor>();
  
  // Cache and TTL bounds
  private maxCacheSize = 1000;
  private sessionTTLMs = 5 * 60 * 1000; // 5 minutes inactivity TTL

  private constructor() {
    // Periodically clean up stale sessions
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.evictStaleSessions(), 60000);
    }
  }

  public static getInstance(): LiveSessionMonitor {
    if (!this.instance) {
      this.instance = new LiveSessionMonitor();
    }
    return this.instance;
  }

  /**
   * Records a fresh telemetry event and updates active states.
   */
  public registerActivity(event: any): void {
    try {
      const flags = RealtimeConfigManager.getFlags();
      if (!flags.live_monitor) return;

      const { visitor_id, session_id, application, device, browser, country, page, timestamp } = event;
      if (!visitor_id || !session_id) return;

      const now = new Date().toISOString();
      const current = this.activeVisitors.get(session_id);

      const visitor: ActiveVisitor = {
        visitor_id,
        session_id,
        application: application || "aix-os",
        device: device || "desktop",
        browser: browser || "chrome",
        country: country || "RO",
        last_page: page || "/",
        last_activity: timestamp || now,
        session_start: current?.session_start || timestamp || now,
      };

      // Safeguard against memory leak bounds
      if (this.activeVisitors.size >= this.maxCacheSize && !this.activeVisitors.has(session_id)) {
        this.evictOldestSession();
      }

      this.activeVisitors.set(session_id, visitor);

      // Publish event internally for subscribers (e.g. Live Dashboard updates)
      eventBus.publish("realtime:activity", visitor);
    } catch (e) {
      // Fail silently
    }
  }

  public getActiveCount(): number {
    this.evictStaleSessions();
    return this.activeVisitors.size;
  }

  public getActiveVisitorsList(): ActiveVisitor[] {
    this.evictStaleSessions();
    return Array.from(this.activeVisitors.values()).sort(
      (a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
    );
  }

  public evictStaleSessions(): void {
    try {
      const now = Date.now();
      for (const [sessionId, visitor] of this.activeVisitors.entries()) {
        const lastActiveTime = new Date(visitor.last_activity).getTime();
        if (now - lastActiveTime > this.sessionTTLMs) {
          this.activeVisitors.delete(sessionId);
          eventBus.publish("realtime:session_ended", visitor);
        }
      }
    } catch (e) {}
  }

  private evictOldestSession(): void {
    try {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;

      for (const [key, val] of this.activeVisitors.entries()) {
        const time = new Date(val.last_activity).getTime();
        if (time < oldestTime) {
          oldestTime = time;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.activeVisitors.delete(oldestKey);
      }
    } catch (e) {}
  }
}

export const liveSessionMonitor = LiveSessionMonitor.getInstance();
export default liveSessionMonitor;
