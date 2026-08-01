import { VisitorIntelligence } from "../index";

export class DashboardFormatter {
  public static format(intelligence: VisitorIntelligence): Record<string, any> {
    return {
      visitorId: intelligence.visitorId,
      sessionId: intelligence.sessionId,
      application: intelligence.application,
      intentScore: intelligence.intent.score,
      leadTemperature: intelligence.leadTemperature,
      classification: intelligence.classification,
      estimatedLeadValue: intelligence.estimatedLeadValue,
      conversionProbabilityPct: Math.round(intelligence.conversionProbability * 100),
      priority: intelligence.priority,
      recommendedAction: intelligence.recommendation.action,
      journeySummary: intelligence.journey.steps.map(s => s.label).join(" ➔ "),
      reasons: intelligence.intent.reasons,
      sessionDurationMin: intelligence.metrics.duration,
      lastActivity: intelligence.metrics.lastActivity
    };
  }
}
