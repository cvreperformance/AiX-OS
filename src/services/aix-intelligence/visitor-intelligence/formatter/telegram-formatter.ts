import { VisitorIntelligence } from "../index";

export class TelegramFormatter {
  public static format(intelligence: VisitorIntelligence): string {
    const { metrics, intent, journey, recommendation, leadTemperature, estimatedLeadValue } = intelligence;
    const app = metrics.application === "home-find" ? "Home Find" : metrics.application === "insurance" ? "Insurance" : "AiX OS";

    // 1. HIGH INTENT BUYER
    if (intent.category === "buyer" || metrics.buyerRequests > 0) {
      return `🔥 ${leadTemperature} BUYER LEAD

Budget / Value
${estimatedLeadValue}

Intent
${intent.score}%

Priority
${intent.priority}

Journey
${journey.formattedJourney}

Reasons
${intent.reasons.map((r) => `✓ ${r}`).join("\n")}

Recommendation
${recommendation.action}`;
    }

    // 2. INSURANCE LEAD
    if (intent.category === "insurance" || metrics.insuranceQuotes > 0) {
      return `🛡 INSURANCE LEAD

Intent
${intent.score}%

Priority
${intent.priority}

Journey
${journey.formattedJourney}

Recommendation
${recommendation.action}`;
    }

    // 3. AI CONVERSATION
    if (intent.category === "ai" || metrics.aiQuestions > 0) {
      return `🤖 AI CONVERSATION

Questions
${Math.max(1, metrics.aiQuestions)}

Session
${metrics.duration} minutes

Intent
${intent.summary}

Recommendation
${recommendation.action}`;
    }

    // 4. GENERAL PROPERTY / VISITOR
    if (metrics.propertiesViewed > 0) {
      return `🏡 PROPERTY INQUIRY

Application
${app}

Intent Score
${intent.score}%

Priority
${intent.priority}

Properties Viewed
${metrics.propertiesViewed}

Session Duration
${metrics.duration} minutes

Journey
${journey.formattedJourney}

Recommendation
${recommendation.action}`;
    }

    const header = metrics.returningVisitor ? "👤 RETURNING VISITOR" : "👤 NEW VISITOR";
    return `${header}

Application
${app}

Country
${metrics.country}

Device
${metrics.device}

Intent Score
${intent.score}%

Landing Page
${metrics.landingPage}

Recommendation
${recommendation.action}`;
  }
}
