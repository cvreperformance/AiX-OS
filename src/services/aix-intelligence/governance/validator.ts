import { IngestionValidationResult } from "./types";

export class SchemaValidator {
  private static structuralFields = [
    "application",
    "sdk_version",
    "event_version",
    "timestamp",
    "visitor_id",
    "session_id",
    "event_type",
    "page",
  ];

  /**
   * Performs structural verification.
   * Rejects only if the payload is structurally unusable (missing core fields).
   */
  public static validate(rawEvent: any): IngestionValidationResult {
    if (!rawEvent || typeof rawEvent !== "object") {
      return { status: "invalid", error: "Event payload is not a valid JSON object" };
    }

    const missingFields: string[] = [];
    this.structuralFields.forEach((field) => {
      if (rawEvent[field] === undefined || rawEvent[field] === null || rawEvent[field] === "") {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return {
        status: "invalid",
        error: `Structurally unusable: missing required fields [${missingFields.join(", ")}]`,
      };
    }

    return {
      status: "valid",
      event: rawEvent,
    };
  }
}
export default SchemaValidator;
