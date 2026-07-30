import { EventContract } from "./types";

export class EventRegistry {
  private static contracts = new Map<string, EventContract>();

  static {
    // Register baseline behaviors (Milestone 2 telemetry events)
    const baseEvents = [
      { name: "application_start", category: "lifecycle" },
      { name: "session_start", category: "lifecycle" },
      { name: "session_end", category: "lifecycle" },
      { name: "page_view", category: "navigation" },
      { name: "page_leave", category: "navigation" },
      { name: "route_change", category: "navigation" },
      { name: "scroll_depth", category: "interaction" },
      { name: "outbound_link_click", category: "interaction" },
      { name: "internal_navigation", category: "navigation" },
      { name: "search", category: "search" },
      { name: "search_result_click", category: "search" },
      { name: "ai_prompt_started", category: "ai" },
      { name: "ai_prompt_sent", category: "ai" },
      { name: "ai_prompt_received", category: "ai" },
      { name: "ai_prompt_error", category: "ai" },
      { name: "dashboard_opened", category: "dashboard" },
      { name: "dashboard_module_opened", category: "dashboard" },
      { name: "button_clicked", category: "interaction" },
      { name: "form_started", category: "conversion" },
      { name: "form_abandoned", category: "conversion" },
      { name: "form_submitted", category: "conversion" },
      { name: "property_opened", category: "property" },
      { name: "property_shared", category: "property" },
      { name: "property_saved", category: "property" },
      { name: "download_started", category: "interaction" },
      { name: "download_completed", category: "interaction" },
      { name: "authentication_success", category: "auth" },
      { name: "authentication_failure", category: "auth" },
      { name: "error_event", category: "system" },
    ];

    baseEvents.forEach((evt) => {
      this.contracts.set(evt.name, {
        name: evt.name,
        category: evt.category,
        version: "1.0.0",
        requiredFields: ["application", "sdk_version", "event_version", "timestamp", "visitor_id", "session_id", "event_type", "page"],
        optionalFields: ["referrer", "device", "browser", "country", "campaign", "metadata", "payload"],
        description: `Ecosystem standard telemetry event for ${evt.name}`,
        deprecated: false,
      });
    });

    // Example of a deprecated legacy event configuration
    this.contracts.set("legacy_click_event", {
      name: "legacy_click_event",
      category: "interaction",
      version: "0.1.0",
      requiredFields: [],
      optionalFields: [],
      description: "Old click tracking format",
      deprecated: true,
    });
  }

  public static getContract(name: string): EventContract | null {
    return this.contracts.get(name) || null;
  }

  public static isRegistered(name: string): boolean {
    return this.contracts.has(name);
  }

  public static listContracts(): EventContract[] {
    return Array.from(this.contracts.values());
  }
}
export default EventRegistry;
