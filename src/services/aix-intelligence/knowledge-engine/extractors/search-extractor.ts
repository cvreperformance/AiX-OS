import { RawEvent } from "../../session-pipeline/types";
import { KnowledgeExtractor, VisitorKnowledge } from "../types";

export class SearchExtractor implements KnowledgeExtractor {
  public extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge> {
    const searchEvents = events.filter((e) => e.event_type === "search");
    
    const termsSet = new Set<string>(currentProfile.search_behavior?.terms || []);
    let queriesCount = currentProfile.search_behavior?.queries_count || 0;

    searchEvents.forEach((evt) => {
      queriesCount++;
      if (evt.payload?.query) {
        termsSet.add(evt.payload.query.toLowerCase().trim());
      }
    });

    return {
      search_behavior: {
        queries_count: queriesCount,
        terms: Array.from(termsSet).slice(0, 20),
      },
    };
  }
}
