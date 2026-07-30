import { RealtimeConfigManager } from "./config";

export interface VisitorLiveScores {
  interest_score: number;       // 0 - 100 scale
  buying_intent: number;        // 0 - 100 scale
  selling_intent: number;       // 0 - 100 scale
  luxury_interest: boolean;
  commercial_interest: boolean;
  ai_engagement: number;        // 0 - 100 scale
  research_level: number;       // 0 - 100 scale
  return_probability: number;   // 0 - 100 scale
}

export class ActivityScoreCalculator {
  /**
   * Evaluates scores incrementally for a visitor based on received event streams.
   */
  public static calculate(events: any[]): VisitorLiveScores {
    try {
      const flags = RealtimeConfigManager.getFlags();
      if (!flags.activity_scoring || !events || events.length === 0) {
        return this.getDefaultScores();
      }

      const totalEvents = events.length;
      
      const searchEvents = events.filter((e) => e.event_type === "search");
      const propertyViews = events.filter((e) => e.event_type === "property_opened");
      const propertyShares = events.filter((e) => e.event_type === "property_shared");
      const propertySaves = events.filter((e) => e.event_type === "property_saved");
      const aiPrompts = events.filter((e) => e.event_type === "ai_prompt_sent");
      const formsSubmitted = events.filter((e) => e.event_type === "form_submitted");
      const formsAbandoned = events.filter((e) => e.event_type === "form_abandoned");
      const downloads = events.filter((e) => e.event_type === "download_started");

      // 1. Interest score (overall volume and activity speed)
      const interest_score = Math.min(100, Math.round(totalEvents * 4 + propertyViews.length * 10));

      // 2. Buying intent (saves, shares, contact submissions)
      const buying_intent = Math.min(
        100,
        Math.round(
          propertySaves.length * 25 +
          propertyShares.length * 15 +
          formsSubmitted.length * 35 +
          searchEvents.length * 5
        )
      );

      // 3. Selling intent (specific forms like property listing submissions)
      const sellPathsCount = events.filter(e => e.page.toLowerCase().includes("sell") || e.page.toLowerCase().includes("vinde")).length;
      const selling_intent = Math.min(
        100,
        Math.round(sellPathsCount * 30 + formsSubmitted.length * 20)
      );

      // 4. Luxury Focus
      const luxuryViews = propertyViews.filter((p) => {
        const val = Number(p.payload?.price || 0);
        return val > 350000;
      });
      const luxury_interest = luxuryViews.length > 0;

      // 5. Commercial Focus
      const commercialViews = propertyViews.filter((p) => {
        const type = (p.payload?.property_type || "").toLowerCase();
        return type.includes("birou") || type.includes("commercial") || type.includes("spatiu");
      });
      const commercial_interest = commercialViews.length > 0;

      // 6. AI Engagement
      const ai_engagement = Math.min(100, aiPrompts.length * 25);

      // 7. Research Level (based on searches and downloads)
      const research_level = Math.min(
        100,
        Math.round(searchEvents.length * 15 + downloads.length * 25 + propertyViews.length * 5)
      );

      // 8. Return Probability
      const sessionIds = new Set(events.map((e) => e.session_id));
      const return_probability = Math.min(
        100,
        Math.round(sessionIds.size * 30 + (interest_score > 50 ? 20 : 0))
      );

      return {
        interest_score,
        buying_intent,
        selling_intent,
        luxury_interest,
        commercial_interest,
        ai_engagement,
        research_level,
        return_probability,
      };
    } catch (e) {
      return this.getDefaultScores();
    }
  }

  private static getDefaultScores(): VisitorLiveScores {
    return {
      interest_score: 0,
      buying_intent: 0,
      selling_intent: 0,
      luxury_interest: false,
      commercial_interest: false,
      ai_engagement: 0,
      research_level: 0,
      return_probability: 0,
    };
  }
}
export default ActivityScoreCalculator;
