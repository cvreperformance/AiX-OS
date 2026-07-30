import { IngestionValidationResult } from "./types";

export class EventNormalizer {
  /**
   * Transforms and sanitizes structural and payload properties.
   */
  public static normalize(rawEvent: any): IngestionValidationResult {
    const event = { ...rawEvent };
    const warnings: string[] = [];

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    
    // 1. Map client-generated event_id/id
    const rawId = event.id || event.event_id;
    if (rawId && isUUID(rawId)) {
      event.id = rawId;
    } else {
      event.id = this.generateUUID();
      warnings.push("Normalized: generated fallback UUID id/event_id due to missing or invalid UUID format");
    }
    delete event.event_id;

    // 2. Default timestamps
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString();
      warnings.push("Normalized: set default current timestamp");
    }

    // 3. Guarantee payload and metadata are valid objects
    if (!event.metadata || typeof event.metadata !== "object") {
      event.metadata = {};
    }
    if (!event.payload || typeof event.payload !== "object") {
      event.payload = {};
    }

    // 4. Sanitize context parameters
    event.application = String(event.application).toLowerCase().trim();
    event.event_type = String(event.event_type).toLowerCase().trim();
    event.page = String(event.page).trim();

    return {
      status: warnings.length > 0 ? "normalized" : "valid",
      warnings,
      event,
    };
  }

  private static generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
export default EventNormalizer;
