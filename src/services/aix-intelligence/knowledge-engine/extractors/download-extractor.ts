import { RawEvent } from "../../session-pipeline/types";
import { KnowledgeExtractor, VisitorKnowledge } from "../types";

export class DownloadExtractor implements KnowledgeExtractor {
  public extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge> {
    const downloadEvents = events.filter((e) => e.event_type === "download_started");
    
    let downloadsCount = currentProfile.download_behavior?.downloads_count || 0;
    const filesSet = new Set<string>(currentProfile.download_behavior?.files || []);

    downloadEvents.forEach((evt) => {
      downloadsCount++;
      if (evt.payload?.filename || evt.payload?.url) {
        filesSet.add(evt.payload.filename || evt.payload.url);
      }
    });

    return {
      download_behavior: {
        downloads_count: downloadsCount,
        files: Array.from(filesSet).slice(0, 10),
      },
    };
  }
}
