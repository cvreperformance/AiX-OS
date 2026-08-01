import { INTENT_WEIGHTS, INTENT_STAGES, INTENT_PRIORITIES } from "@/config/intent-scoring";
import { SessionMetrics } from "./session-aggregator";

export interface IntentEvaluation {
  score: number;
  confidence: number;
  category: "buyer" | "seller" | "insurance" | "ai" | "general";
  stage: typeof INTENT_STAGES[keyof typeof INTENT_STAGES];
  priority: typeof INTENT_PRIORITIES[keyof typeof INTENT_PRIORITIES];
  summary: string;
  reasons: string[];
}

export class IntentEngine {
  public static evaluate(metrics: SessionMetrics): IntentEvaluation {
    let rawScore = 20; // Base visit score
    const reasons: string[] = [];

    // Property Views
    if (metrics.propertiesViewed > 0) {
      rawScore += Math.min(15, metrics.propertiesViewed * INTENT_WEIGHTS.propertyView);
      reasons.push(`Viewed ${metrics.propertiesViewed} properties`);
    }

    if (metrics.repeatedPropertyViews > 0) {
      rawScore += INTENT_WEIGHTS.repeatedPropertyView;
      reasons.push("Repeated property view");
    }

    // Search & Filter
    if (metrics.searches > 0) {
      rawScore += Math.min(6, metrics.searches * INTENT_WEIGHTS.search);
    }
    if (metrics.filterChanges > 0) {
      rawScore += Math.min(6, metrics.filterChanges * INTENT_WEIGHTS.filterChange);
    }

    // Guide Downloads
    if (metrics.guideDownloads > 0) {
      rawScore += INTENT_WEIGHTS.guideDownload;
      reasons.push("Downloaded guide");
    }

    // AI Conversations
    if (metrics.aiQuestions > 0) {
      rawScore += INTENT_WEIGHTS.aiConversation;
      reasons.push("AI conversation");
    }

    // Form Interactions
    if (metrics.formsStarted > 0) {
      rawScore += INTENT_WEIGHTS.contactStart;
    }
    if (metrics.formsSubmitted > 0) {
      rawScore += INTENT_WEIGHTS.contactSubmit;
      reasons.push("Submitted contact form");
    }

    // High Value Actions
    if (metrics.buyerRequests > 0) {
      rawScore += INTENT_WEIGHTS.buyerRequest;
      reasons.push("Buyer request");
    }
    if (metrics.sellerRequests > 0) {
      rawScore += INTENT_WEIGHTS.sellerRequest;
      reasons.push("Seller request");
    }
    if (metrics.callbackRequests > 0) {
      rawScore += INTENT_WEIGHTS.callbackRequest;
      reasons.push("Callback request");
    }
    if (metrics.insuranceQuotes > 0) {
      rawScore += INTENT_WEIGHTS.insuranceQuote;
      reasons.push("Insurance quote request");
    }
    if (metrics.insuranceForms > 0) {
      rawScore += INTENT_WEIGHTS.insuranceForm;
    }
    if (metrics.returningVisitor) {
      rawScore += INTENT_WEIGHTS.returningVisitor;
      reasons.push("Returning visitor");
    }

    const score = Math.min(100, Math.max(0, rawScore));

    // Category Identification
    let category: IntentEvaluation["category"] = "general";
    if (metrics.buyerRequests > 0 || (metrics.propertiesViewed >= 3 && metrics.application === "home-find")) {
      category = "buyer";
    } else if (metrics.sellerRequests > 0) {
      category = "seller";
    } else if (metrics.insuranceQuotes > 0 || metrics.application === "insurance") {
      category = "insurance";
    } else if (metrics.aiQuestions > 0) {
      category = "ai";
    }

    // Stage Identification
    let stage: IntentEvaluation["stage"] = INTENT_STAGES.DISCOVERY;
    if (score >= 90 || metrics.buyerRequests > 0 || metrics.sellerRequests > 0) {
      stage = INTENT_STAGES.DECISION;
    } else if (score >= 65 || metrics.formsSubmitted > 0 || metrics.insuranceQuotes > 0) {
      stage = INTENT_STAGES.INTENT;
    } else if (score >= 40 || metrics.propertiesViewed >= 2) {
      stage = INTENT_STAGES.CONSIDERATION;
    }

    // Priority Identification
    let priority: IntentEvaluation["priority"] = INTENT_PRIORITIES.LOW;
    if (score >= 90) {
      priority = INTENT_PRIORITIES.URGENT;
    } else if (score >= 70) {
      priority = INTENT_PRIORITIES.HIGH;
    } else if (score >= 45) {
      priority = INTENT_PRIORITIES.MEDIUM;
    }

    // Confidence calculation (0.5 to 0.99 based on actions & duration)
    const confidence = Math.min(0.99, 0.6 + (reasons.length * 0.08) + (metrics.duration > 3 ? 0.1 : 0.05));

    // Executive Summary
    let summary = `Visitor engaged in ${category} activities on ${metrics.application}.`;
    if (metrics.buyerRequests > 0) {
      summary = "Returning visitor submitted buyer request after viewing luxury properties.";
    } else if (metrics.sellerRequests > 0) {
      summary = "Visitor submitted property valuation request.";
    } else if (metrics.insuranceQuotes > 0) {
      summary = "Visitor requested customized insurance policy quote.";
    } else if (metrics.aiQuestions > 0) {
      summary = "Visitor interacted with AI intelligence engine.";
    }

    return {
      score,
      confidence: parseFloat(confidence.toFixed(2)),
      category,
      stage,
      priority,
      summary,
      reasons: reasons.length > 0 ? reasons : ["General navigation"]
    };
  }
}
