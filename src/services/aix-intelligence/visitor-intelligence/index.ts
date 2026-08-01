import { SessionAggregator, SessionMetrics } from "./session-aggregator";
import { IntentEngine, IntentEvaluation } from "./intent-engine";
import { VisitorJourneyBuilder, JourneyStep } from "./visitor-journey";
import { RecommendationEngine, RecommendedAction } from "./recommendation-engine";
import { IntelligenceDeduplicator } from "./deduplication";
import { NotificationFormatter } from "./notification-formatter";

export interface VisitorIntelligence {
  visitorId: string;
  sessionId: string;
  application: string;
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
  public static evaluate(
    sessionEvents: any[],
    visitorId: string = "visitor_unknown",
    isReturningVisitor: boolean = false
  ): VisitorIntelligence {
    const metrics = SessionAggregator.aggregate(sessionEvents, isReturningVisitor);
    const intent = IntentEngine.evaluate(metrics);
    const journey = VisitorJourneyBuilder.build(sessionEvents);
    const recommendation = RecommendationEngine.generate(intent, metrics);

    return {
      visitorId: metrics.visitorId || visitorId,
      sessionId: metrics.sessionId,
      application: metrics.application,
      metrics,
      intent,
      journey,
      recommendation,
      priority: intent.priority,
      timestamp: new Date().toISOString()
    };
  }

  public static formatTelegram(intelligence: VisitorIntelligence): string {
    return NotificationFormatter.formatTelegram(intelligence);
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
export * from "./notification-formatter";
