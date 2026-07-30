import { RawEvent } from "../../session-pipeline/types";
import { KnowledgeExtractor, VisitorKnowledge } from "../types";

export class FormExtractor implements KnowledgeExtractor {
  public extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge> {
    let completionsCount = currentProfile.form_behavior?.completions_count || 0;
    let abandonedCount = currentProfile.form_behavior?.abandoned_count || 0;

    events.forEach((evt) => {
      if (evt.event_type === "form_submitted") {
        completionsCount++;
      }
      if (evt.event_type === "form_abandoned") {
        abandonedCount++;
      }
    });

    return {
      form_behavior: {
        completions_count: completionsCount,
        abandoned_count: abandonedCount,
      },
    };
  }
}
