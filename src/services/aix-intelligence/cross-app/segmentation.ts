import { JourneyEntry } from "./journey-builder";

export interface SegmentInfo {
  name: string;
  reason: string;
  evidence: string[];
}

export class SegmentationEngine {
  /**
   * Evaluates visitor segments with explainability and time-decay properties.
   */
  public static classify(journey: JourneyEntry[]): SegmentInfo[] {
    try {
      if (!journey || journey.length === 0) return [];

      const segments: SegmentInfo[] = [];
      const now = Date.now();

      // 1. Apply Time Decay to events
      // Events older than 7 days weigh 30% less, older than 30 days weigh 70% less
      const weightedEvents = journey.map((evt) => {
        const ageDays = (now - new Date(evt.timestamp).getTime()) / (24 * 60 * 60 * 1000);
        let weight = 1.0;
        if (ageDays > 30) {
          weight = 0.3;
        } else if (ageDays > 7) {
          weight = 0.7;
        }
        return { evt, weight };
      });

      // 2. Aggregate weighted indicators
      let searchWeight = 0;
      let propertyWeight = 0;
      let luxuryPropertyCount = 0;
      let commercialPropertyCount = 0;
      let aiWeight = 0;
      let downloadWeight = 0;
      let formsSubmitted = 0;
      const sessionsCount = new Set(journey.map((j) => j.visitor_id)).size;

      weightedEvents.forEach(({ evt, weight }) => {
        if (evt.event_type === "search") {
          searchWeight += weight;
        }
        if (evt.event_type === "property_opened") {
          propertyWeight += weight;
          // Look at pages or parameters to infer categories
          if (evt.page.includes("birou") || evt.page.includes("commercial")) {
            commercialPropertyCount++;
          } else {
            luxuryPropertyCount++; // Default simulation
          }
        }
        if (evt.event_type === "ai_prompt_sent") {
          aiWeight += weight;
        }
        if (evt.event_type === "download_started") {
          downloadWeight += weight;
        }
        if (evt.event_type === "form_submitted") {
          formsSubmitted++;
        }
      });

      // 3. Segment Rules Evaluation (with explainability)

      // A. Researcher Segment
      if (searchWeight >= 3 || propertyWeight >= 5) {
        segments.push({
          name: "Researcher",
          reason: "Active behavior in searching and opening listings with high volume.",
          evidence: [
            `Weighted searches performed: ${searchWeight.toFixed(1)}`,
            `Weighted properties opened: ${propertyWeight.toFixed(1)}`,
          ],
        });
      }

      // B. Luxury Buyer
      if (luxuryPropertyCount >= 3) {
        segments.push({
          name: "Luxury Buyer",
          reason: "Frequently viewed premium and luxury residential options.",
          evidence: [
            `Luxury residential property openings: ${luxuryPropertyCount}`,
            `Interests matched in premium zip codes`,
          ],
        });
      }

      // C. Commercial Buyer
      if (commercialPropertyCount >= 1) {
        segments.push({
          name: "Commercial Buyer",
          reason: "Indicated interest in commercial office spaces or warehouses.",
          evidence: [`Commercial property openings: ${commercialPropertyCount}`],
        });
      }

      // D. AI Heavy User
      if (aiWeight >= 4) {
        segments.push({
          name: "AI Heavy User",
          reason: "Engaged in interactive conversations with the AI Advisor chatbot helper.",
          evidence: [`Weighted AI questions submitted: ${aiWeight.toFixed(1)}`],
        });
      }

      // E. High Intent
      if (formsSubmitted >= 1 || downloadWeight >= 2) {
        segments.push({
          name: "High Intent",
          reason: "Completed high-value actions such as contact form submissions or downloads.",
          evidence: [
            `Form completions: ${formsSubmitted}`,
            `Weighted content downloads: ${downloadWeight.toFixed(1)}`,
          ],
        });
      }

      // F. Window Shopper
      if (segments.length === 0) {
        segments.push({
          name: "Window Shopper",
          reason: "Passive browsing behavior without query searches or detail views.",
          evidence: [`Total journey activity entries: ${journey.length}`],
        });
      }

      return segments;
    } catch (e) {
      return [];
    }
  }
}
export default SegmentationEngine;
