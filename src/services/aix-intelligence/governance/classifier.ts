import { EventRegistry } from "./registry";
import { IngestionValidationResult, EventClassification } from "./types";

export class EventClassifier {
  /**
   * Evaluates the event configuration against the central Event Registry.
   * Categorizes as: valid, deprecated, or unknown.
   */
  public static classify(normalizedEvent: any): IngestionValidationResult {
    const event = { ...normalizedEvent };
    const eventName = event.event_type;
    const warnings: string[] = [];

    // 1. Resolve contract in registry
    const contract = EventRegistry.getContract(eventName);

    let classification: EventClassification = "valid";

    if (!contract) {
      classification = "unknown";
      warnings.push(`Governance Warning: Event '${eventName}' is undocumented/unknown. Storing under UNKNOWN status for review.`);
      console.warn(`[AiX Schema Governance] Unknown event received: ${eventName}`);
    } else if (contract.deprecated) {
      classification = "deprecated";
      warnings.push(`Governance Warning: Event '${eventName}' is deprecated. Upgrade client implementations.`);
      console.warn(`[AiX Schema Governance] Deprecated event received: ${eventName}`);
    }

    // 2. Append governance indicators to metadata
    event.metadata = {
      ...event.metadata,
      governance_status: classification,
      governance_warnings: warnings.length > 0 ? warnings : undefined,
      governance_checked_at: new Date().toISOString(),
    };

    return {
      status: classification,
      warnings,
      event,
    };
  }
}
export default EventClassifier;
