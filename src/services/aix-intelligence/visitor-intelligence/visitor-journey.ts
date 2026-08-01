export interface JourneyStep {
  label: string;
  timestamp: string;
  icon?: string;
}

export class VisitorJourneyBuilder {
  public static build(sessionEvents: any[]): { steps: JourneyStep[]; formattedJourney: string } {
    if (!sessionEvents || sessionEvents.length === 0) {
      return {
        steps: [{ label: "Landing Page", timestamp: new Date().toISOString() }],
        formattedJourney: "Landing Page"
      };
    }

    const steps: JourneyStep[] = [];
    const seenLabels = new Set<string>();

    sessionEvents.forEach((evt) => {
      const type = (evt.event_type || "").toLowerCase().trim().replace(/[ -]/g, "_");
      const page = evt.page || "/";
      const payload = evt.payload || {};
      const metadata = evt.metadata || {};
      const ts = new Date(evt.timestamp || evt.created_at || Date.now()).toISOString();

      let label = "";

      if (type === "session_start" || type === "app_start") {
        label = "Landing Page";
      } else if (type.includes("property_opened") || type.includes("property_view")) {
        const title = payload.property_title || metadata.property_title || payload.title || "Luxury Property";
        label = `Opened Property (${title})`;
      } else if (type.includes("search")) {
        label = "Search";
      } else if (type.includes("filter")) {
        label = "Filter Applied";
      } else if (type.includes("download") || type.includes("guide")) {
        label = "Guide Download";
      } else if (type.includes("ai_prompt") || type.includes("ai_interaction")) {
        label = "AI Conversation";
      } else if (type.includes("buyer_request")) {
        label = "Buyer Request";
      } else if (type.includes("seller_request")) {
        label = "Seller Request";
      } else if (type.includes("quote_submit") || type.includes("quote_start")) {
        label = "Insurance Quote";
      } else if (type.includes("callback")) {
        label = "Callback Request";
      } else if (type.includes("contact_submit") || type.includes("form_submit")) {
        label = "Contact Submit";
      }

      if (label && (!seenLabels.has(label) || label.includes("Opened Property"))) {
        seenLabels.add(label);
        steps.push({ label, timestamp: ts });
      }
    });

    if (steps.length === 0) {
      steps.push({ label: "Landing Page", timestamp: new Date().toISOString() });
    }

    const formattedJourney = steps.map((s) => s.label).join("\n↓\n");

    return {
      steps,
      formattedJourney
    };
  }
}
