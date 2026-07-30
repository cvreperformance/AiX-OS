import { JourneyEntry } from "./journey-builder";

export interface ConversionOpportunity {
  id: string;
  type: "high_intent_search" | "form_abandonment" | "cross_app_bounce" | "heavy_ai_research" | "comparison_buyer";
  title: string;
  description: string;
  status: "New" | "Active" | "Escalated" | "Converted" | "Expired" | "Dismissed";
  reasons: string[];
  created_at: string;
  last_updated: string;
}

export class OpportunityDetectionEngine {
  /**
   * Identifies conversion opportunities and lifecycle indicators from cross-app journeys.
   */
  public static detect(visitorId: string, journey: JourneyEntry[]): ConversionOpportunity[] {
    try {
      if (!journey || journey.length === 0) return [];

      const opportunities: ConversionOpportunity[] = [];
      const timestampIso = new Date().toISOString();

      const searchEvents = journey.filter((e) => e.event_type === "search");
      const propertyViews = journey.filter((e) => e.event_type === "property_opened");
      const formStarts = journey.filter((e) => e.event_type === "form_started");
      const formSubmitted = journey.filter((e) => e.event_type === "form_submitted");
      const formAbandoned = journey.filter((e) => e.event_type === "form_abandoned");
      const aiPrompts = journey.filter((e) => e.event_type === "ai_prompt_sent");
      const comparisonViews = journey.filter((e) => e.page.includes("/compare")).length;

      // 1. Detect Form Abandonment
      if (formAbandoned.length > 0 && formSubmitted.length === 0) {
        opportunities.push({
          id: `${visitorId}-abandonment`,
          type: "form_abandonment",
          title: "Abandoned Lead Form Recoverable",
          description: "Visitor started a contact/lead form but exited before completion.",
          status: "New",
          reasons: [
            `Started form '${formStarts[0]?.payload?.form_id || "contact"}'`,
            "Abandoned action registered on exit",
          ],
          created_at: timestampIso,
          last_updated: timestampIso,
        });
      }

      // 2. Detect Comparison Buyer
      if (comparisonViews >= 3 || propertyViews.length >= 8) {
        opportunities.push({
          id: `${visitorId}-comparison`,
          type: "comparison_buyer",
          title: "High-Volume Comparison Activity",
          description: "Visitor is actively comparing listing options side-by-side.",
          status: "Active",
          reasons: [
            `Viewed property compare page ${comparisonViews} times`,
            `Opened ${propertyViews.length} distinct listings`,
          ],
          created_at: timestampIso,
          last_updated: timestampIso,
        });
      }

      // 3. Detect Cross-App Bounce
      const appsVisited = new Set(journey.map((e) => e.application));
      if (appsVisited.size >= 2) {
        opportunities.push({
          id: `${visitorId}-cross-app`,
          type: "cross_app_bounce",
          title: "Cross-Application Journey Active",
          description: "Visitor bridged across multiple platform portals in a single path.",
          status: "New",
          reasons: [
            `Visited apps: ${Array.from(appsVisited).join(", ")}`,
            `Registered journey transitions`,
          ],
          created_at: timestampIso,
          last_updated: timestampIso,
        });
      }

      // 4. Detect Heavy AI Research
      if (aiPrompts.length >= 5) {
        opportunities.push({
          id: `${visitorId}-ai-research`,
          type: "heavy_ai_research",
          title: "Heavy AI Advisor Interaction",
          description: "Visitor is deeply consulting the AI Advisor about deals or metrics.",
          status: "Active",
          reasons: [
            `Submitted ${aiPrompts.length} questions to AI Assistant`,
            "Consulted yield calculations or market reports",
          ],
          created_at: timestampIso,
          last_updated: timestampIso,
        });
      }

      return opportunities;
    } catch (e) {
      return [];
    }
  }
}
export default OpportunityDetectionEngine;
