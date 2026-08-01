import { IntentEvaluation } from "./intent-engine";
import { SessionMetrics } from "./session-aggregator";

export interface RecommendedAction {
  action: string;
  urgency: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  recommendedWithinMinutes: number;
  channel: "PHONE" | "EMAIL" | "WHATSAPP" | "SYSTEM";
}

export class RecommendationEngine {
  public static generate(intent: IntentEvaluation, metrics: SessionMetrics): RecommendedAction {
    // Rule 1: High Intent Buyer (Score >= 90 or Buyer Request)
    if (intent.score >= 90 || metrics.buyerRequests > 0) {
      return {
        action: "Call immediately.",
        urgency: "URGENT",
        recommendedWithinMinutes: 5,
        channel: "PHONE"
      };
    }

    // Rule 2: Insurance Lead (Quote or Callback)
    if (metrics.insuranceQuotes > 0 || metrics.callbackRequests > 0) {
      return {
        action: "Contact within 15 minutes.",
        urgency: "HIGH",
        recommendedWithinMinutes: 15,
        channel: "PHONE"
      };
    }

    // Rule 3: Seller Valuation Request
    if (metrics.sellerRequests > 0) {
      return {
        action: "Schedule property valuation.",
        urgency: "HIGH",
        recommendedWithinMinutes: 30,
        channel: "PHONE"
      };
    }

    // Rule 4: AI Conversation Engagement
    if (metrics.aiQuestions > 0) {
      return {
        action: "Assign to advisor / Follow up tomorrow.",
        urgency: "MEDIUM",
        recommendedWithinMinutes: 1440, // 24 hours
        channel: "EMAIL"
      };
    }

    // Rule 5: Opportunity / Consideration
    if (intent.score >= 60) {
      return {
        action: "Send personalized brochure.",
        urgency: "MEDIUM",
        recommendedWithinMinutes: 120,
        channel: "EMAIL"
      };
    }

    // Default Low Intent Navigation
    return {
      action: "Monitor session activity.",
      urgency: "LOW",
      recommendedWithinMinutes: 1440,
      channel: "SYSTEM"
    };
  }
}
