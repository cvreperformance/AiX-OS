import { JourneyEntry } from "./cross-app/journey-builder";
import { LearningData } from "./learning-engine";

export interface DecisionAction {
  category: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  urgency: number; // 0-100
  expectedImpact: "Low" | "Medium" | "High";
  expectedValue: string; // e.g. "€250,000" or "€1,200"
  recommendedTiming: "Immediately" | "Within 24 Hours" | "Next Session" | "Next Week";
  recommendedApplication: string;
  evidence: string[];
  confidenceReasoning: string;
}

export interface DecisionTimelineLog {
  decision: string;
  status: "new" | "changed" | "expired" | "strengthened" | "weakened";
  reason: string;
  timestamp: string;
}

export interface DecisionData {
  opportunityRank: number; // 0-100
  actions: DecisionAction[];
  timeline: DecisionTimelineLog[];
  maturity: number; // 0-100
}

export class DecisionEngine {
  /**
   * Deterministically calculates advisory decisions for a visitor profile.
   */
  public static evaluate(
    visitorId: string,
    journey: JourneyEntry[],
    profile: any
  ): DecisionData {
    const actions: DecisionAction[] = [];
    const timeline: DecisionTimelineLog[] = [];
    const timestampIso = new Date().toISOString();

    const predictions = profile.predictions || {};
    const learning: LearningData = profile.learning || {
      maturity: 0,
      patterns: {
        repeatedSearches: { confidence_score: 0 },
        repeatedLocations: { confidence_score: 0 },
        repeatedPropertyTypes: { confidence_score: 0 },
        repeatedInsurance: { confidence_score: 0 },
        repeatedAiQuestions: { confidence_score: 0 },
        repeatedDownloads: { confidence_score: 0 },
        repeatedVisitHours: { confidence_score: 0 },
        repeatedTransitions: { confidence_score: 0 },
        engagementTrend: "stable",
        cycleType: "none",
      },
      adaptiveScores: {
        buyingIntent: 0,
        sellingIntent: 0,
        investmentIntent: 0,
        insuranceIntent: 0,
        luxuryPreference: 0,
        researchDepth: 0,
        aiDependency: 0,
        conversionReadiness: 0,
        returnProbability: 0,
      },
      timeline: [],
    };

    const adaptive = learning.adaptiveScores;

    // Helper to calculate urgency
    const calculateUrgency = (base: number, ageHours: number): number => {
      const decay = Math.max(0, 100 - ageHours * 2);
      return Math.round(base * 0.7 + decay * 0.3);
    };

    const getAgeHours = (lastActive: string): number => {
      try {
        const last = new Date(lastActive).getTime();
        const diffMs = Date.now() - last;
        return Math.max(0, diffMs / (3600 * 1000));
      } catch (e) {
        return 0;
      }
    };

    const ageHours = getAgeHours(profile.updated_at || timestampIso);

    // 1. Evaluate Decision Categories

    // A. High Intent Buyer
    if (adaptive.buyingIntent > 65) {
      actions.push({
        category: "High Intent Buyer",
        title: "Escalate Property Concierge Lead Match",
        description: "Promote unlisted properties and concierge services directly within Home Find.",
        priority: "High",
        confidence: adaptive.buyingIntent,
        urgency: calculateUrgency(adaptive.buyingIntent, ageHours),
        expectedImpact: "High",
        expectedValue: adaptive.luxuryPreference > 60 ? "€750,000" : "€180,000",
        recommendedTiming: "Within 24 Hours",
        recommendedApplication: "home-find",
        evidence: [
          `Adaptive buying intent is high: ${adaptive.buyingIntent}%`,
          `Observed search preference for location and properties`,
        ],
        confidenceReasoning: "Multiple matching view sessions and location-specific filters confirmed by learning models.",
      });
      timeline.push({
        decision: "High Intent Buyer",
        status: "new",
        reason: "Buying intent signals crossed decision threshold of 65%.",
        timestamp: timestampIso,
      });
    }

    // B. High Intent Seller
    if (adaptive.sellingIntent > 50) {
      actions.push({
        category: "High Intent Seller",
        title: "Offer Premium Home Valuation Report",
        description: "Advisors should recommend listing properties with zero commission packages.",
        priority: "High",
        confidence: adaptive.sellingIntent,
        urgency: calculateUrgency(adaptive.sellingIntent, ageHours),
        expectedImpact: "Medium",
        expectedValue: "€250,000",
        recommendedTiming: "Within 24 Hours",
        recommendedApplication: "aix-os",
        evidence: [
          `Adaptive selling intent score is: ${adaptive.sellingIntent}%`,
          "Search histories match valuation or listing terms",
        ],
        confidenceReasoning: "Explicit searches containing listing/selling terms confirmed by search-extractor.",
      });
      timeline.push({
        decision: "High Intent Seller",
        status: "new",
        reason: "Selling intent signals registered above 50% threshold.",
        timestamp: timestampIso,
      });
    }

    // C. Insurance Opportunity
    if (adaptive.insuranceIntent > 50) {
      actions.push({
        category: "Insurance Opportunity",
        title: "Introduce Policy Premium Discounts",
        description: "Promote concierge home insurance plans during quote sessions.",
        priority: "Medium",
        confidence: adaptive.insuranceIntent,
        urgency: calculateUrgency(adaptive.insuranceIntent, ageHours),
        expectedImpact: "Medium",
        expectedValue: "€450 / yr",
        recommendedTiming: "Next Session",
        recommendedApplication: "insurance",
        evidence: [
          `Adaptive insurance intent is: ${adaptive.insuranceIntent}%`,
          "Repeated interest in insurance app",
        ],
        confidenceReasoning: "Interaction with quotes calculator and insurance guides confirmed Renewal cycles.",
      });
      timeline.push({
        decision: "Insurance Opportunity",
        status: "new",
        reason: "Insurance intent score crossed 50%.",
        timestamp: timestampIso,
      });
    }

    // D. Luxury Prospect
    if (adaptive.luxuryPreference > 60) {
      actions.push({
        category: "Luxury Prospect",
        title: "Invite to Private Deal Room Portal",
        description: "Display off-market luxury penthouses and premium estates.",
        priority: "High",
        confidence: adaptive.luxuryPreference,
        urgency: calculateUrgency(adaptive.luxuryPreference, ageHours),
        expectedImpact: "High",
        expectedValue: "€1,200,000",
        recommendedTiming: "Next Session",
        recommendedApplication: "home-find",
        evidence: [
          `Luxury preference is high: ${adaptive.luxuryPreference}%`,
          "Viewed multiple premium zip codes",
        ],
        confidenceReasoning: "Ecosystem properties viewed reside predominantly in luxury locations.",
      });
      timeline.push({
        decision: "Luxury Prospect",
        status: "new",
        reason: "Luxury interest confirmed based on high pricing and locations views.",
        timestamp: timestampIso,
      });
    }

    // E. Investment Prospect
    if (adaptive.investmentIntent > 60) {
      actions.push({
        category: "Investment Prospect",
        title: "Expose Expected Yield Computations",
        description: "Show ROI stats and commercial listings side-by-side.",
        priority: "High",
        confidence: adaptive.investmentIntent,
        urgency: calculateUrgency(adaptive.investmentIntent, ageHours),
        expectedImpact: "High",
        expectedValue: "€350,000",
        recommendedTiming: "Next Session",
        recommendedApplication: "home-find",
        evidence: [
          `Investment intent level: ${adaptive.investmentIntent}%`,
          "Consulted yield calculations or ROI insights",
        ],
        confidenceReasoning: "Investment query terms matched repeatedly with active session duration.",
      });
      timeline.push({
        decision: "Investment Prospect",
        status: "new",
        reason: "Investment intent registered above 60%.",
        timestamp: timestampIso,
      });
    }

    // F. Ready To Contact / Ready For Follow-Up
    const hasAbandonment = learning.patterns.repeatedDownloads.confidence_score > 50 || profile.form_behavior?.abandoned_count > 0;
    if (adaptive.conversionReadiness > 70 && adaptive.researchDepth > 60) {
      actions.push({
        category: "Ready To Contact",
        title: "Promote Advisor Direct Contact Widget",
        description: "Promote instant WhatsApp or phone scheduling widget.",
        priority: "Critical",
        confidence: Math.round((adaptive.conversionReadiness + adaptive.researchDepth) / 2),
        urgency: calculateUrgency(adaptive.conversionReadiness, ageHours),
        expectedImpact: "High",
        expectedValue: "€150,000",
        recommendedTiming: "Immediately",
        recommendedApplication: "aix-os",
        evidence: [
          `Conversion readiness is: ${adaptive.conversionReadiness}%`,
          `Research depth is: ${adaptive.researchDepth}%`,
        ],
        confidenceReasoning: "Visitor has accumulated extensive research and conversion readiness is optimal.",
      });
    } else if (hasAbandonment) {
      actions.push({
        category: "Ready For Follow-Up",
        title: "Suggest Lead Recovery Interaction",
        description: "Recommend sales reps follow up on abandoned lead details.",
        priority: "High",
        confidence: 85,
        urgency: calculateUrgency(80, ageHours),
        expectedImpact: "Medium",
        expectedValue: "€150,000",
        recommendedTiming: "Immediately",
        recommendedApplication: "aix-os",
        evidence: [
          "Incomplete form submissions tracked in telemetry",
          "High form abandonment signals active",
        ],
        confidenceReasoning: "Form started events were followed by form exit events without completion.",
      });
    }

    // G. AI Heavy User
    if (adaptive.aiDependency > 70) {
      actions.push({
        category: "AI Heavy User",
        title: "Feature Premium AI Advisor Access",
        description: "Introduce custom PDF normalizers and document intelligence advice.",
        priority: "Medium",
        confidence: adaptive.aiDependency,
        urgency: calculateUrgency(adaptive.aiDependency, ageHours),
        expectedImpact: "Medium",
        expectedValue: "€1,500",
        recommendedTiming: "Next Session",
        recommendedApplication: "aix-os",
        evidence: [
          `AI advisor dependency score is: ${adaptive.aiDependency}%`,
          `Exchanged ${learning.patterns.repeatedAiQuestions.count || 3} questions with advisor`,
        ],
        confidenceReasoning: "Visitor heavily uses the chatbot interface for market research and consulting.",
      });
    }

    // H. Cross-App Opportunity
    if (learning.patterns.repeatedTransitions.confidence_score > 55) {
      actions.push({
        category: "Cross-App Opportunity",
        title: "Integrate Unified Profile Experience",
        description: "Expose shared bookmarks and unified dashboard widgets.",
        priority: "Medium",
        confidence: learning.patterns.repeatedTransitions.confidence_score,
        urgency: calculateUrgency(70, ageHours),
        expectedImpact: "High",
        expectedValue: "€150,000",
        recommendedTiming: "Next Session",
        recommendedApplication: "aix-os",
        evidence: [
          `App transition pattern confidence: ${learning.patterns.repeatedTransitions.confidence_score}%`,
          "Navigated across multiple platform applications",
        ],
        confidenceReasoning: "Identified active trajectories bridging Home Find, Insurance, and AiX OS.",
      });
    }

    // 2. Opportunity Ranking (Aggregate Score)
    // Rank is calculated from 0 to 100 based on core parameters
    const totalSessions = profile.statistics?.total_sessions || 1;
    const totalEvents = profile.statistics?.total_events || 2;
    const aiCount = learning.patterns.repeatedAiQuestions.count || 0;
    const transitionsCount = learning.patterns.repeatedTransitions.sequence?.length || 0;

    let opportunityRank = Math.round(
      (adaptive.buyingIntent * 0.2) +
      (adaptive.conversionReadiness * 0.15) +
      (adaptive.researchDepth * 0.15) +
      (learning.maturity * 0.15) +
      (Math.min(100, totalSessions * 15) * 0.1) +
      (Math.min(100, totalEvents * 3) * 0.1) +
      (Math.min(100, aiCount * 12) * 0.1) +
      (Math.min(100, transitionsCount * 25) * 0.05)
    );
    opportunityRank = Math.min(100, Math.max(10, opportunityRank));

    // Calculate decision engine maturity
    const decisionMaturity = Math.min(100, (actions.length * 20) + (learning.maturity * 0.4));

    return {
      opportunityRank,
      actions,
      timeline,
      maturity: decisionMaturity,
    };
  }
}
export default DecisionEngine;
