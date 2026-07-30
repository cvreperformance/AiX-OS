import { supabaseAdmin } from "@/lib/supabase/admin";

export interface AnalyticsSummary {
  totalEvents: number;
  uniqueVisitors: number;
  activeSessions: number;
  eventsByApplication: Record<string, number>;
  eventsByType: Record<string, number>;
  topPages: { page: string; count: number }[];
}

class AnalyticsService {
  /**
   * Aggregates event telemetry for the specified timeframe
   */
  public async getSummary(timeframeDays: number = 7): Promise<AnalyticsSummary> {
    const emptySummary: AnalyticsSummary = {
      totalEvents: 0,
      uniqueVisitors: 0,
      activeSessions: 0,
      eventsByApplication: {},
      eventsByType: {},
      topPages: [],
    };

    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - timeframeDays);

      const { data, error } = await supabaseAdmin
        .from("aix_events")
        .select("application, event_type, visitor_id, session_id, page")
        .gte("timestamp", thresholdDate.toISOString());

      if (error || !data) {
        console.error("[AiX Analytics Service] Error retrieving events:", error);
        return emptySummary;
      }

      const uniqueVisitors = new Set<string>();
      const activeSessions = new Set<string>();
      const eventsByApplication: Record<string, number> = {};
      const eventsByType: Record<string, number> = {};
      const pagesCount: Record<string, number> = {};

      data.forEach((row) => {
        if (row.visitor_id) uniqueVisitors.add(row.visitor_id);
        if (row.session_id) activeSessions.add(row.session_id);

        if (row.application) {
          eventsByApplication[row.application] = (eventsByApplication[row.application] || 0) + 1;
        }
        if (row.event_type) {
          eventsByType[row.event_type] = (eventsByType[row.event_type] || 0) + 1;
        }
        if (row.page) {
          pagesCount[row.page] = (pagesCount[row.page] || 0) + 1;
        }
      });

      const topPages = Object.entries(pagesCount)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalEvents: data.length,
        uniqueVisitors: uniqueVisitors.size,
        activeSessions: activeSessions.size,
        eventsByApplication,
        eventsByType,
        topPages,
      };
    } catch (error) {
      console.error("[AiX Analytics Service] Failed to generate summary:", error);
      return emptySummary;
    }
  }
}

export const analytics = new AnalyticsService();
export default analytics;
