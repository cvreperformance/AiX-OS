export type EventClassification = "valid" | "normalized" | "unknown" | "deprecated" | "invalid";

export interface EventContract {
  name: string;
  category: string;
  version: string;
  requiredFields: string[];
  optionalFields: string[];
  description: string;
  deprecated: boolean;
}

export interface IngestionValidationResult {
  status: EventClassification;
  warnings?: string[];
  error?: string;
  event?: any;
}
