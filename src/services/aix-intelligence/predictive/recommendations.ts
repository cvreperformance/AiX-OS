import { RecommendationIntervention } from "./types";
import { JourneyEntry } from "../cross-app/journey-builder";

export class RecommendationEngine {
  /**
   * Generates advisory recommended interventions based on journey signals and intent.
   * NOTE: Rule #1 enforced: advisory only, never triggers automated business mailings or actions.
   */
  public static generate(
    visitorId: string,
    journey: JourneyEntry[],
    intents: any,
    conversions: any,
    churn: any
  ): RecommendationIntervention[] {
    const recommendations: RecommendationIntervention[] = [];

    // 1. Intervention Recommendation: Lead Followup Alert
    if (conversions.form_completion_probability.value < 40 && conversions.form_completion_probability.confidence > 60) {
      recommendations.push({
        id: `${visitorId}-rec-followup`,
        title: "Trigger CRM Escalation Alert",
        explanation: "Visitor abandoned the inquiry form. Notify sales reps to review profile traits and follow up manually.",
        priority: "High",
        urgency: "Medium",
        expected_impact: "High",
        confidence: 85,
        evidence: [
          "Incomplete form submission recorded",
          `Form completion probability low: ${conversions.form_completion_probability.value}%`,
        ],
      });
    }

    // 2. Intervention Recommendation: Suggest Home Find App Portal
    if (intents.buying_intent.confidence > 65) {
      recommendations.push({
        id: `${visitorId}-rec-home-find`,
        title: "Promote Home Find Direct Portal",
        explanation: "High buying intent matched. Recommend the Home Find unlisted listings panel to speed up deals.",
        priority: "High",
        urgency: "High",
        expected_impact: "High",
        confidence: 90,
        evidence: [
          `Buying intent score is active: ${intents.buying_intent.confidence}%`,
          "Consulted listing details repeatedly",
        ],
      });
    }

    // 3. Intervention Recommendation: Suggest Insurance Services
    if (intents.insurance_interest.confidence > 50) {
      recommendations.push({
        id: `${visitorId}-rec-insurance`,
        title: "Recommend Policy Consulting Services",
        explanation: "Ecosystem interest detected in insurance policies. Recommend specific concierge programs.",
        priority: "Medium",
        urgency: "Low",
        expected_impact: "Medium",
        confidence: 75,
        evidence: [
          `Insurance interest confidence matched: ${intents.insurance_interest.confidence}%`,
        ],
      });
    }

    // 4. Intervention Recommendation: Suggest AI Assistant interaction
    if (intents.ai_assistance_need.confidence > 70) {
      recommendations.push({
        id: `${visitorId}-rec-ai`,
        title: "Introduce Premium AI Advisor Access",
        explanation: "Active consulting with chatbot. Encourage opening the advanced document-intelligence dashboard.",
        priority: "Medium",
        urgency: "Medium",
        expected_impact: "Medium",
        confidence: 80,
        evidence: [
          `Exchanged multiple AI prompts: ${intents.ai_assistance_need.confidence}% necessity`,
        ],
      });
    }

    return recommendations;
  }
}
export default RecommendationEngine;
