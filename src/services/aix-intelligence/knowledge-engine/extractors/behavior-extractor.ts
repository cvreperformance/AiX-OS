import { RawEvent } from "../../session-pipeline/types";
import { KnowledgeExtractor, VisitorKnowledge } from "../types";

export class BehaviorExtractor implements KnowledgeExtractor {
  public extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge> {
    // 1. Resolve returning frequency
    const sessionIds = new Set<string>();
    events.forEach((e) => {
      if (e.session_id) sessionIds.add(e.session_id);
    });

    const returningFrequency = sessionIds.size;

    // 2. Average engagement index
    const totalEvents = events.length;
    const clicksCount = events.filter((e) => e.event_type === "button_clicked" || e.event_type === "click").length;
    
    // Average clicks + active events per session
    const averageEngagement = returningFrequency > 0 
      ? Math.round(((clicksCount + totalEvents) / returningFrequency) * 10) / 10
      : 0;

    // 3. Comparison behavior count
    const comparisonCount = events.filter((e) => e.page.includes("/compare")).length;

    // 4. Interest evolution log
    const evolution = [...(currentProfile.interest_evolution || [])];
    const propertyViews = events.filter((e) => e.event_type === "property_opened");
    if (propertyViews.length > 0) {
      const lastView = propertyViews[propertyViews.length - 1];
      evolution.push({
        timestamp: lastView.timestamp,
        inferred_intent: `Viewed property: ${lastView.payload?.property_id || lastView.page}`,
      });
    }

    return {
      returning_frequency: returningFrequency,
      average_engagement: averageEngagement,
      comparison_behavior: {
        comparison_count: comparisonCount,
      },
      interest_evolution: evolution.slice(-10), // Keep last 10 entries
    };
  }
}
