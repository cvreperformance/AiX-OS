/**
 * AiX OS™ — Intent Scoring Configuration
 * Centralized weight matrix for visitor intent calculations.
 */

export const INTENT_WEIGHTS = {
  propertyView: 3,
  repeatedPropertyView: 15,
  search: 2,
  filterChange: 2,
  guideDownload: 10,
  aiConversation: 10,
  contactStart: 20,
  contactSubmit: 30,
  callbackRequest: 40,
  buyerRequest: 40,
  sellerRequest: 40,
  insuranceQuote: 30,
  insuranceForm: 15,
  returningVisitor: 10
};

export const INTENT_STAGES = {
  DISCOVERY: "Discovery",
  CONSIDERATION: "Consideration",
  INTENT: "Intent",
  DECISION: "Decision"
} as const;

export const INTENT_PRIORITIES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
} as const;
