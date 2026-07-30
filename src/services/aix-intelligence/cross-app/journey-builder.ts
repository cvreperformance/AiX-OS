import { supabaseAdmin } from "@/lib/supabase/admin";
import { RawEvent } from "../session-pipeline/types";

export interface JourneyEntry {
  event_id: string;
  application: string;
  timestamp: string;
  event_type: string;
  page: string;
  details: string;
  visitor_id: string;
  payload?: any;
  metadata?: any;
}

export class JourneyBuilder {
  /**
   * Compiles event history from the primary visitor and all resolved identity graph links
   * to build a unified chronological journey map.
   */
  public static async buildJourney(visitorId: string, linkedVisitorIds: string[] = []): Promise<JourneyEntry[]> {
    try {
      const allVisitorIds = [visitorId, ...linkedVisitorIds];
      
      const { data: eventsData, error } = await supabaseAdmin
        .from("aix_events")
        .select("*")
        .in("visitor_id", allVisitorIds)
        .order("timestamp", { ascending: true });

      if (error || !eventsData || eventsData.length === 0) {
        return [];
      }

      return eventsData.map((d: any) => {
        let details = `Visited page ${d.page}`;
        if (d.event_type === "search" && d.payload?.query) {
          details = `Searched query: "${d.payload.query}"`;
        } else if (d.event_type === "property_opened" && d.payload?.property_id) {
          details = `Opened property: ${d.payload.property_id}`;
        } else if (d.event_type === "ai_prompt_sent" && d.payload?.prompt) {
          details = `Asked AI Advisor: "${d.payload.prompt}"`;
        } else if (d.event_type === "form_submitted" && d.payload?.form_id) {
          details = `Submitted form: ${d.payload.form_id}`;
        } else if (d.event_type === "form_abandoned" && d.payload?.form_id) {
          details = `Abandoned form: ${d.payload.form_id}`;
        } else if (d.event_type === "download_started" && d.payload?.filename) {
          details = `Downloaded file: ${d.payload.filename}`;
        }

        return {
          event_id: d.id,
          application: d.application,
          timestamp: d.timestamp,
          event_type: d.event_type,
          page: d.page,
          details,
          visitor_id: d.visitor_id,
          payload: d.payload,
          metadata: d.metadata,
        };
      });
    } catch (e) {
      return [];
    }
  }
}
export default JourneyBuilder;
