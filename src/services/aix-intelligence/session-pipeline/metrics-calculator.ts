import { ReconstructedSession, SessionMetrics } from "./types";

export class MetricsCalculator {
  public static calculate(session: ReconstructedSession): SessionMetrics {
    const events = session.events;
    if (events.length === 0) {
      throw new Error("Cannot calculate metrics for an empty session");
    }

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];

    const start_time = firstEvent.timestamp;
    const end_time = lastEvent.timestamp;
    const duration_ms = lastEvent.normalized_timestamp - firstEvent.normalized_timestamp;

    let page_views = 0;
    const uniquePagesSet = new Set<string>();
    const searchTerms: string[] = [];
    const filtersUsed: string[] = [];
    const formsStarted: string[] = [];
    const formsSubmitted: string[] = [];
    const formsAbandoned: string[] = [];
    const propertiesViewed: string[] = [];

    let entry_page = "";
    let exit_page = "";
    let searches_count = 0;
    let ai_interactions_count = 0;
    let downloads_count = 0;
    let outbound_links_count = 0;
    let errors_count = 0;

    events.forEach((evt) => {
      const type = evt.event_type;
      const page = evt.page;

      if (type === "page_view") {
        page_views++;
        uniquePagesSet.add(page);
        if (!entry_page) entry_page = page;
        exit_page = page;
      }

      if (type === "search") {
        searches_count++;
        if (evt.payload?.query) {
          searchTerms.push(evt.payload.query);
        }
      }

      if (type === "filter_changed") {
        if (evt.payload?.filter) {
          filtersUsed.push(evt.payload.filter);
        }
      }

      if (type.startsWith("ai_prompt")) {
        ai_interactions_count++;
      }

      if (type === "form_started" && evt.payload?.form_id) {
        formsStarted.push(evt.payload.form_id);
      }

      if (type === "form_submitted" && evt.payload?.form_id) {
        formsSubmitted.push(evt.payload.form_id);
      }

      if (type === "form_abandoned" && evt.payload?.form_id) {
        formsAbandoned.push(evt.payload.form_id);
      }

      if (type === "download_started") {
        downloads_count++;
      }

      if (type === "outbound_link_click") {
        outbound_links_count++;
      }

      if (type === "property_opened" && evt.payload?.property_id) {
        propertiesViewed.push(evt.payload.property_id);
      }

      if (type === "error_event") {
        errors_count++;
      }
    });

    const unique_pages = Array.from(uniquePagesSet);
    const is_bounce = page_views <= 1 && duration_ms < 12000;

    return {
      start_time,
      end_time,
      duration_ms,
      page_views,
      unique_pages,
      entry_page: entry_page || firstEvent.page,
      exit_page: exit_page || lastEvent.page,
      referrer: firstEvent.referrer || "direct",
      campaign: firstEvent.campaign || "organic",
      country: firstEvent.country || "unknown",
      browser: firstEvent.browser_name || "unknown",
      device: firstEvent.device_category || "unknown",
      searches_count,
      search_terms: Array.from(new Set(searchTerms)),
      filters_used: Array.from(new Set(filtersUsed)),
      ai_interactions_count,
      forms_started: Array.from(new Set(formsStarted)),
      forms_submitted: Array.from(new Set(formsSubmitted)),
      forms_abandoned: Array.from(new Set(formsAbandoned)),
      downloads_count,
      outbound_links_count,
      properties_viewed: Array.from(new Set(propertiesViewed)),
      errors_count,
      is_bounce,
    };
  }
}
