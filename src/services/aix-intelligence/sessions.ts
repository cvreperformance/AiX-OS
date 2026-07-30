import { supabaseAdmin } from "@/lib/supabase/admin";
import { SessionPipeline } from "./session-pipeline/pipeline";
import { RawEvent, SessionModel } from "./session-pipeline/types";

export interface SessionQueryFilters {
  application?: string;
  visitor_id?: string;
  session_id?: string;
  page?: string;
  event_type?: string;
  country?: string;
  browser?: string;
  device?: string;
  campaign?: string;
  referrer?: string;
  dateFrom?: string;
  dateTo?: string;
  pageIndex?: number;
  pageSize?: number;
}

export class SessionService {
  /**
   * Retrieves events and compiles them dynamically into paginated SessionModels.
   */
  public async getSessions(filters: SessionQueryFilters = {}): Promise<{
    sessions: SessionModel[];
    totalCount: number;
  }> {
    try {
      const pageIndex = filters.pageIndex ?? 0;
      const pageSize = filters.pageSize ?? 10;
      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;

      let query = supabaseAdmin
        .from("aix_events")
        .select("*", { count: "exact" });

      // Direct filters mapped to database index triggers
      if (filters.application) query = query.eq("application", filters.application);
      if (filters.visitor_id) query = query.eq("visitor_id", filters.visitor_id);
      if (filters.session_id) query = query.eq("session_id", filters.session_id);
      if (filters.page) query = query.ilike("page", `%${filters.page}%`);
      if (filters.event_type) query = query.eq("event_type", filters.event_type);
      if (filters.country) query = query.eq("country", filters.country);
      if (filters.browser) query = query.ilike("browser", `%${filters.browser}%`);
      if (filters.device) query = query.eq("device", filters.device);
      if (filters.campaign) query = query.eq("campaign", filters.campaign);
      if (filters.referrer) query = query.ilike("referrer", `%${filters.referrer}%`);
      if (filters.dateFrom) query = query.gte("timestamp", filters.dateFrom);
      if (filters.dateTo) query = query.lte("timestamp", filters.dateTo);

      // Order by timestamp
      query = query.order("timestamp", { ascending: false });

      // Range check to protect memory
      const { data, error, count } = await query.range(from, to);

      if (error || !data) {
        console.error("[AiX Sessions Service] Error querying database:", error);
        return { sessions: [], totalCount: 0 };
      }

      const rawEvents: RawEvent[] = data.map((d: any) => ({
        id: d.id,
        application: d.application,
        sdk_version: d.sdk_version,
        event_version: d.event_version,
        timestamp: d.timestamp,
        session_id: d.session_id,
        visitor_id: d.visitor_id,
        event_type: d.event_type,
        page: d.page,
        referrer: d.referrer,
        device: d.device,
        browser: d.browser,
        country: d.country,
        campaign: d.campaign,
        metadata: d.metadata,
        payload: d.payload,
      }));

      // Group events by session_id and build session models
      // To ensure that metrics and timestamps are computed accurately,
      // we query session groups. Since our db pagination might split sessions across pages,
      // we do a secondary query to fetch full sessions for these IDs to build solid SessionModels.
      const sessionIds = Array.from(new Set(rawEvents.map((r) => r.session_id)));
      if (sessionIds.length === 0) {
        return { sessions: [], totalCount: count ?? 0 };
      }

      // Fetch all events for the session IDs in this page view
      const { data: fullSessionData, error: sessionFetchError } = await supabaseAdmin
        .from("aix_events")
        .select("*")
        .in("session_id", sessionIds)
        .order("timestamp", { ascending: true });

      if (sessionFetchError || !fullSessionData) {
        console.error("[AiX Sessions Service] Full session retrieve failure:", sessionFetchError);
        return { sessions: [], totalCount: count ?? 0 };
      }

      const fullRawEvents: RawEvent[] = fullSessionData.map((d: any) => ({
        id: d.id,
        application: d.application,
        sdk_version: d.sdk_version,
        event_version: d.event_version,
        timestamp: d.timestamp,
        session_id: d.session_id,
        visitor_id: d.visitor_id,
        event_type: d.event_type,
        page: d.page,
        referrer: d.referrer,
        device: d.device,
        browser: d.browser,
        country: d.country,
        campaign: d.campaign,
        metadata: d.metadata,
        payload: d.payload,
      }));

      const sessions = SessionPipeline.process(fullRawEvents);

      return {
        sessions,
        totalCount: count ?? 0,
      };
    } catch (e) {
      console.error("[AiX Sessions Service] Failed to fetch paginated sessions:", e);
      return { sessions: [], totalCount: 0 };
    }
  }

  /**
   * Resolves full details for a single session.
   */
  public async getSessionDetails(sessionId: string): Promise<SessionModel | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("aix_events")
        .select("*")
        .eq("session_id", sessionId)
        .order("timestamp", { ascending: true });

      if (error || !data || data.length === 0) return null;

      const rawEvents: RawEvent[] = data.map((d: any) => ({
        id: d.id,
        application: d.application,
        sdk_version: d.sdk_version,
        event_version: d.event_version,
        timestamp: d.timestamp,
        session_id: d.session_id,
        visitor_id: d.visitor_id,
        event_type: d.event_type,
        page: d.page,
        referrer: d.referrer,
        device: d.device,
        browser: d.browser,
        country: d.country,
        campaign: d.campaign,
        metadata: d.metadata,
        payload: d.payload,
      }));

      const sessions = SessionPipeline.process(rawEvents);
      return sessions.length > 0 ? sessions[0] : null;
    } catch (e) {
      return null;
    }
  }
}

export const sessions = new SessionService();
export default sessions;
