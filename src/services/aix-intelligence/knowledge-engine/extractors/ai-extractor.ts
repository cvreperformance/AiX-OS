import { RawEvent } from "../../session-pipeline/types";
import { KnowledgeExtractor, VisitorKnowledge } from "../types";

export class AiExtractor implements KnowledgeExtractor {
  public extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge> {
    const aiEvents = events.filter((e) => e.event_type.startsWith("ai_prompt"));
    
    let frequency = currentProfile.ai_usage?.frequency || 0;
    let lastInteraction = currentProfile.ai_usage?.last_interaction;

    aiEvents.forEach((evt) => {
      if (evt.event_type === "ai_prompt_sent") {
        frequency++;
        lastInteraction = evt.timestamp;
      }
    });

    return {
      ai_usage: {
        frequency,
        last_interaction: lastInteraction,
      },
    };
  }
}
