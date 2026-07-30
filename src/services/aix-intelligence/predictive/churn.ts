import { PredictorOutput } from "./types";
import { JourneyEntry } from "../cross-app/journey-builder";

export class ChurnPredictor {
  /**
   * Estimates disengagement and churn risks based on behavioral drops and time-spans.
   */
  public static predict(journey: JourneyEntry[]): PredictorOutput<number> {
    try {
      if (!journey || journey.length === 0) {
        return {
          value: 100,
          confidence: 90,
          certainty: "High",
          evidence: ["Empty event logs"],
          supporting_signals: ["NO_ACTIVITY"],
        };
      }

      const lastEvent = journey[journey.length - 1];
      const now = Date.now();
      const lastActiveTime = new Date(lastEvent.timestamp).getTime();
      const inactivityHours = (now - lastActiveTime) / (1000 * 60 * 60);

      const formAbandoned = journey.filter(e => e.event_type === "form_abandoned").length;
      const formSubmitted = journey.filter(e => e.event_type === "form_submitted").length;
      const totalPageViews = journey.filter(e => e.event_type === "page_view").length;

      let value = 10;
      const evidence: string[] = [];
      const signals: string[] = [];

      // 1. Check absolute inactivity gaps
      if (inactivityHours > 72) {
        value += 50;
        evidence.push(`No platform activity in over 72 hours (${Math.round(inactivityHours)}h)`);
        signals.push("LONG_INACTIVITY_GAP");
      } else if (inactivityHours > 24) {
        value += 25;
        evidence.push(`Inactive for over 24 hours (${Math.round(inactivityHours)}h)`);
        signals.push("MEDIUM_INACTIVITY_GAP");
      }

      // 2. Form abandonment indicator
      if (formAbandoned > 0 && formSubmitted === 0) {
        value += 30;
        evidence.push("interrupted journey: abandoned input form without submit");
        signals.push("FORM_ABANDONMENT_DROP");
      }

      // 3. Single page bounce disengagement
      if (totalPageViews === 1 && journey.length <= 2) {
        value += 15;
        evidence.push("Single-page session bounce recorded");
        signals.push("BOUNCE_DISENGAGEMENT");
      }

      const confidence = Math.min(100, Math.round(value));
      const certainty = confidence > 75 ? "High" : confidence > 40 ? "Medium" : "Low";

      return {
        value: confidence,
        confidence,
        certainty,
        evidence,
        supporting_signals: signals,
      };
    } catch (e) {
      return {
        value: 50,
        confidence: 30,
        certainty: "Low",
        evidence: ["Error predicting churn metrics"],
        supporting_signals: ["ERROR_FALLBACK"],
      };
    }
  }
}
export default ChurnPredictor;
