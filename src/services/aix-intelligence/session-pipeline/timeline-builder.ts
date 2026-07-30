import { ReconstructedSession, TimelineItem, NormalizedEvent } from "./types";

export class TimelineBuilder {
  /**
   * Translates chronological normalized events into a readable timeline.
   */
  public static build(session: ReconstructedSession): TimelineItem[] {
    const events = session.events;
    if (events.length === 0) return [];

    const firstTimestamp = events[0].normalized_timestamp;

    return events.map((evt) => {
      const timeElapsed = evt.normalized_timestamp - firstTimestamp;

      return {
        timestamp: evt.timestamp,
        time_elapsed_ms: timeElapsed,
        event_type: evt.event_type,
        summary: this.getHumanReadableSummary(evt),
        metadata: evt.payload || {},
      };
    });
  }

  private static getHumanReadableSummary(event: NormalizedEvent): string {
    const type = event.event_type;
    const page = event.page;
    const p = event.payload || {};

    switch (type) {
      case "application_start":
        return `Application opened on ${page}`;
      case "page_view":
        return `Viewed page ${page}`;
      case "route_change":
        return `Navigated to ${page}`;
      case "internal_navigation":
        return `Navigated internally to ${page}`;
      case "scroll_depth":
        return `Scrolled ${p.depth_percentage}% of the page`;
      case "search":
        return `Searched for "${p.query || ""}"`;
      case "search_result_click":
        return `Clicked search result pointing to ${p.result_id || ""}`;
      case "ai_prompt_started":
        return `Opened Ask AiX™ Chatbot`;
      case "ai_prompt_sent":
        return `Asked AI: "${p.prompt || ""}"`;
      case "ai_prompt_received":
        return `AI Advisor responded successfully`;
      case "ai_prompt_error":
        return `AI Advisor encountered an error`;
      case "form_started":
        return `Started form "${p.form_id || ""}"`;
      case "form_submitted":
        return `Submitted form "${p.form_id || ""}"`;
      case "form_abandoned":
        return `Abandoned form "${p.form_id || ""}"`;
      case "download_started":
        return `Started download: ${p.filename || p.url || ""}`;
      case "download_completed":
        return `Completed download: ${p.url || ""}`;
      case "outbound_link_click":
        return `Clicked external link pointing to ${p.url || ""}`;
      case "property_opened":
        return `Opened property page for "${p.property_id || ""}"`;
      case "authentication_success":
        return `Successfully signed in (${p.email || ""})`;
      case "authentication_failure":
        return `Sign-in attempt failed: "${p.error || ""}"`;
      case "error_event":
        return `Application error: "${p.error_message || ""}"`;
      case "button_clicked":
        return `Clicked button "${p.text || p.id || ""}"`;
      default:
        return `Triggered action: ${type}`;
    }
  }
}
