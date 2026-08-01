import { VisitorIntelligence } from "../index";

export class CRMFormatter {
  public static format(intelligence: VisitorIntelligence): Record<string, any> {
    return {
      schemaVersion: intelligence.engineVersion,
      contact: {
        visitorId: intelligence.visitorId,
        sessionId: intelligence.sessionId,
        sourceApplication: intelligence.application,
        location: `${intelligence.metrics.city}, ${intelligence.metrics.country}`,
        deviceType: intelligence.metrics.device,
        trafficSource: intelligence.metrics.referrer
      },
      leadIntelligence: {
        score: intelligence.intent.score,
        temperature: intelligence.leadTemperature,
        category: intelligence.intent.category,
        classification: intelligence.classification,
        estimatedValue: intelligence.estimatedLeadValue,
        conversionProbability: intelligence.conversionProbability,
        stage: intelligence.intent.stage,
        priority: intelligence.priority
      },
      journey: {
        totalPagesViewed: intelligence.metrics.pagesViewed,
        sessionDurationMinutes: intelligence.metrics.duration,
        propertiesViewed: intelligence.metrics.propertiesViewed,
        downloadsCount: intelligence.metrics.guideDownloads,
        aiQuestionsCount: intelligence.metrics.aiQuestions,
        journeySteps: intelligence.journey.steps
      },
      actionableAdvisory: {
        recommendedAction: intelligence.recommendation.action,
        urgency: intelligence.recommendation.urgency,
        slaMinutes: intelligence.recommendation.recommendedWithinMinutes,
        preferredChannel: intelligence.recommendation.channel
      },
      meta: {
        evaluatedAt: intelligence.timestamp,
        businessTimeline: intelligence.businessTimeline
      }
    };
  }
}
