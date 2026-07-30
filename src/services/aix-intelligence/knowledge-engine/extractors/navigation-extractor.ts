import { RawEvent } from "../../session-pipeline/types";
import { KnowledgeExtractor, VisitorKnowledge } from "../types";

export class NavigationExtractor implements KnowledgeExtractor {
  public extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge> {
    const hoursSet = new Set<number>(currentProfile.active_hours || []);
    
    events.forEach((evt) => {
      if (evt.timestamp) {
        const hr = new Date(evt.timestamp).getHours();
        hoursSet.add(hr);
      }
    });

    // Detect language from page path (e.g. check for RO translations or content)
    // Or check metadata. Accept default 'ro'
    let preferredLanguage = currentProfile.preferred_language || "ro";
    const hasEnEvent = events.some(e => e.page.includes("/en") || e.metadata?.language === "en");
    if (hasEnEvent) preferredLanguage = "en";

    return {
      active_hours: Array.from(hoursSet).sort((a, b) => a - b),
      preferred_language: preferredLanguage,
    };
  }
}
