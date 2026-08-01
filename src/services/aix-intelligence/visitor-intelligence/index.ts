import { SessionAggregator, SessionMetrics } from "./session-aggregator";
import { IntentEngine, IntentEvaluation } from "./intent-engine";
import { VisitorJourneyBuilder, JourneyStep } from "./visitor-journey";
import { RecommendationEngine, RecommendedAction } from "./recommendation-engine";
import { IntelligenceDeduplicator } from "./deduplication";
import { SessionIntelligenceCache } from "./cache/session-cache";
import { TelegramFormatter, DashboardFormatter, CRMFormatter, EmailFormatter } from "./formatter";

export interface VisitorIntelligence {
  engineVersion: string;
  visitorId: string;
  sessionId: string;
  application: string;
  conversionProbability: number;
  estimatedLeadValue: string;
  classification: string;
  leadTemperature: "COLD" | "WARM" | "HOT" | "FIRE";
  businessTimeline: string;
  metrics: SessionMetrics;
  intent: IntentEvaluation;
  journey: {
    steps: JourneyStep[];
    formattedJourney: string;
  };
  recommendation: RecommendedAction;
  priority: string;
  timestamp: string;
}

export class VisitorIntelligenceEngine {
  public static ENGINE_VERSION = "25.0.0";

  public static evaluate(
    sessionEvents: any[],
    visitorId: string = "visitor_unknown",
    isReturningVisitor: boolean = false
  ): VisitorIntelligence {
    const firstEvt = sessionEvents[0];
    const lastEvt = sessionEvents[sessionEvents.length - 1];
    const sessionId = firstEvt?.session_id || "session_unknown";
    const lastTs = lastEvt?.timestamp || lastEvt?.created_at || new Date().toISOString();

    // Check Session Cache
    const cached = SessionIntelligenceCache.get(sessionId, lastTs);
    if (cached) {
      return cached;
    }

    const metrics = SessionAggregator.aggregate(sessionEvents, isReturningVisitor);
    const intent = IntentEngine.evaluate(metrics);
    const journey = VisitorJourneyBuilder.build(sessionEvents);
    const recommendation = RecommendationEngine.generate(intent, metrics);

    // Derived Financial & Predictive Metrics
    const conversionProbability = parseFloat((intent.score / 100).toFixed(2));

    let estimatedLeadValue = "€250,000";
    let classification = "GENERAL_VISITOR";

    if (intent.category === "buyer" || metrics.buyerRequests > 0) {
      classification = "HIGH_VALUE_BUYER";
      estimatedLeadValue = "€850,000";
    } else if (intent.category === "seller" || metrics.sellerRequests > 0) {
      classification = "PROPERTY_SELLER";
      estimatedLeadValue = "€650,000";
    } else if (intent.category === "insurance" || metrics.insuranceQuotes > 0) {
      classification = "INSURANCE_HOLDER";
      estimatedLeadValue = "€1,200/yr";
    } else if (intent.category === "ai" || metrics.aiQuestions > 0) {
      classification = "AI_ADVISORY_CLIENT";
      estimatedLeadValue = "€500,000";
    }

    let leadTemperature: VisitorIntelligence["leadTemperature"] = "COLD";
    if (intent.score >= 90) {
      leadTemperature = "FIRE";
    } else if (intent.score >= 70) {
      leadTemperature = "HOT";
    } else if (intent.score >= 40) {
      leadTemperature = "WARM";
    }

    const businessTimeline = `${metrics.duration}m duration across ${metrics.pagesViewed} pages (${journey.steps.length} key milestones)`;

    const intelligence: VisitorIntelligence = {
      engineVersion: this.ENGINE_VERSION,
      visitorId: metrics.visitorId || visitorId,
      sessionId: metrics.sessionId,
      application: metrics.application,
      conversionProbability,
      estimatedLeadValue,
      classification,
      leadTemperature,
      businessTimeline,
      metrics,
      intent,
      journey,
      recommendation,
      priority: intent.priority,
      timestamp: new Date().toISOString()
    };

    // Cache computed intelligence profile
    SessionIntelligenceCache.set(sessionId, lastTs, intelligence);

    return intelligence;
  }

  // Multi-Channel Presentation Adapters
  public static formatTelegram(intelligence: VisitorIntelligence): string {
    return TelegramFormatter.format(intelligence);
  }

  public static formatDashboard(intelligence: VisitorIntelligence): Record<string, any> {
    return DashboardFormatter.format(intelligence);
  }

  public static formatCRM(intelligence: VisitorIntelligence): Record<string, any> {
    return CRMFormatter.format(intelligence);
  }

  public static formatEmail(intelligence: VisitorIntelligence): string {
    return EmailFormatter.formatHtml(intelligence);
  }

  public static async isDuplicate(
    visitorId: string,
    sessionId: string,
    category: string
  ): Promise<boolean> {
    return IntelligenceDeduplicator.isDuplicate(visitorId, sessionId, category);
  }
}

export * from "./session-aggregator";
export * from "./intent-engine";
export * from "./visitor-journey";
export * from "./recommendation-engine";
export * from "./deduplication";
export * from "./formatter";
export * from "./cache/session-cache";
