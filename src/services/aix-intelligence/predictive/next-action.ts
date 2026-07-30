import { PredictorOutput } from "./types";
import { JourneyEntry } from "../cross-app/journey-builder";

export class NextActionPredictor {
  /**
   * Estimates the visitor's next likely navigation or interaction behavior.
   */
  public static predict(journey: JourneyEntry[]): PredictorOutput<string> {
    try {
      if (!journey || journey.length === 0) {
        return {
          value: "leave_site",
          confidence: 50,
          certainty: "Low",
          evidence: ["Empty visitor session history"],
          supporting_signals: ["NO_TELEMETRY"],
        };
      }

      const lastEvent = journey[journey.length - 1];
      const pageViews = journey.filter(e => e.event_type === "page_view").length;
      const aiPrompts = journey.filter(e => e.event_type === "ai_prompt_sent").length;
      const compareViews = journey.filter(e => e.page.includes("/compare")).length;

      let value = "open_property";
      let confidence = 40;
      const evidence: string[] = [];
      const signals: string[] = [];

      // 1. Rule: Heavy AI chatting
      if (aiPrompts >= 2 && lastEvent.event_type.startsWith("ai")) {
        value = "ask_ai";
        confidence = 75;
        evidence.push(`Exchanged ${aiPrompts} prompts in active conversation`);
        signals.push("AI_ACTIVE_INTERACTION_PATH");
      }
      // 2. Rule: Comparison behaviors
      else if (compareViews > 0 || lastEvent.page.includes("compare")) {
        value = "compare_listings";
        confidence = 80;
        evidence.push("Actively opened property comparison modules");
        signals.push("COMPARISON_BUYER_PATH");
      }
      // 3. Rule: Form started
      else if (lastEvent.event_type === "form_started") {
        value = "start_contact_form";
        confidence = 85;
        evidence.push("Began filling contact or inquiry form");
        signals.push("FORM_ENGAGED");
      }
      // 4. Rule: Multi-page viewing
      else if (pageViews > 4) {
        value = "open_property";
        confidence = 65;
        evidence.push(`Browsed ${pageViews} listings in single journey`);
        signals.push("ACTIVE_RESEARCHER");
      }
      // 5. Default: bounce disengagement
      else {
        value = "leave_site";
        confidence = 55;
        evidence.push("Low session engagement volume");
        signals.push("INACTIVE_BOUNCE_RISK");
      }

      const certainty = confidence > 70 ? "High" : confidence > 45 ? "Medium" : "Low";

      return {
        value,
        confidence,
        certainty,
        evidence,
        supporting_signals: signals,
      };
    } catch (e) {
      return {
        value: "leave_site",
        confidence: 30,
        certainty: "Low",
        evidence: ["Error predicting next likely action"],
        supporting_signals: ["ERROR_FALLBACK"],
      };
    }
  }
}
export default NextActionPredictor;
