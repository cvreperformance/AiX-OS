import { aix } from "@aix/intelligence-sdk";

export interface AppHealthStats {
  heartbeat: string;
  latency_ms: number;
  failed_requests: number;
  dropped_events: number;
  queue_size: number;
  sdk_version: string;
  events_today: number;
  active_visitors: number;
  retries: number;
}

export class ConnectorHealth {
  private static healthData = new Map<string, AppHealthStats>();
  private static visitorsCache = new Map<string, Set<string>>();

  public static updateStats(
    appId: string,
    stats: Partial<AppHealthStats> & { visitor_id?: string }
  ): void {
    try {
      const current = this.healthData.get(appId) || {
        heartbeat: new Date().toISOString(),
        latency_ms: 0,
        failed_requests: 0,
        dropped_events: 0,
        queue_size: 0,
        sdk_version: "2.0.0",
        events_today: 0,
        active_visitors: 0,
        retries: 0,
      };

      let todayCount = current.events_today;
      if (stats.events_today !== undefined) {
        todayCount += stats.events_today;
      }

      let activeVisitors = current.active_visitors;
      if (stats.visitor_id) {
        let visitorsSet = this.visitorsCache.get(appId);
        if (!visitorsSet) {
          visitorsSet = new Set<string>();
          this.visitorsCache.set(appId, visitorsSet);
        }
        visitorsSet.add(stats.visitor_id);
        activeVisitors = visitorsSet.size;
      }

      this.healthData.set(appId, {
        ...current,
        ...stats,
        events_today: todayCount,
        active_visitors: activeVisitors,
        heartbeat: new Date().toISOString(),
      });
    } catch (e) {}
  }

  public static getStats(appId: string): AppHealthStats {
    try {
      aix.track("connector_health_check", {}, { application_id: appId });
    } catch (e) {}
    return (
      this.healthData.get(appId) || {
        heartbeat: new Date().toISOString(),
        latency_ms: 0,
        failed_requests: 0,
        dropped_events: 0,
        queue_size: 0,
        sdk_version: "2.0.0",
        events_today: 0,
        active_visitors: 0,
        retries: 0,
      }
    );
  }
}
export default ConnectorHealth;
