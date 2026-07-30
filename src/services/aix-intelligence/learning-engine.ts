import { JourneyEntry } from "./cross-app/journey-builder";

export interface LearnedInsight {
  confidence_score: number;
  supporting_evidence: string;
  supporting_events: string[];
  observation_period: string;
  last_confirmation: string;
  learning_quality: "Low" | "Medium" | "High";
}

export interface LearningTimelineEntry {
  change: string;
  reason: string;
  events: string[];
  confidenceDelta: number;
  timestamp: string;
}

export interface AdaptiveScores {
  buyingIntent: number;
  sellingIntent: number;
  investmentIntent: number;
  insuranceIntent: number;
  luxuryPreference: number;
  researchDepth: number;
  aiDependency: number;
  conversionReadiness: number;
  returnProbability: number;
}

export interface BehaviorStage {
  stage: string;
  timestamp: string;
}

export interface LearningData {
  maturity: number;
  patterns: {
    repeatedSearches: LearnedInsight & { terms: string[] };
    repeatedLocations: LearnedInsight & { locations: string[] };
    repeatedPropertyTypes: LearnedInsight & { types: string[] };
    repeatedInsurance: LearnedInsight & { pageViews: number };
    repeatedAiQuestions: LearnedInsight & { count: number };
    repeatedDownloads: LearnedInsight & { count: number };
    repeatedVisitHours: LearnedInsight & { hours: number[] };
    repeatedTransitions: LearnedInsight & { sequence: string[] };
    engagementTrend: "growing" | "declining" | "stable";
    cycleType: "research" | "buying" | "selling" | "insurance_renewal" | "none";
  };
  evolution: {
    stages: BehaviorStage[];
  };
  adaptiveScores: AdaptiveScores;
  timeline: LearningTimelineEntry[];
}

export class LearningEngine {
  /**
   * Performs deterministic, incremental analysis of a visitor's journey events.
   */
  public static learn(
    visitorId: string,
    journey: JourneyEntry[],
    profile: any
  ): LearningData {
    const defaultData = (): LearningData => ({
      maturity: 0,
      patterns: {
        repeatedSearches: { confidence_score: 0, supporting_evidence: "No repeated searches", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", terms: [] },
        repeatedLocations: { confidence_score: 0, supporting_evidence: "No repeated locations", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", locations: [] },
        repeatedPropertyTypes: { confidence_score: 0, supporting_evidence: "No repeated property types", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", types: [] },
        repeatedInsurance: { confidence_score: 0, supporting_evidence: "No repeated insurance interest", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", pageViews: 0 },
        repeatedAiQuestions: { confidence_score: 0, supporting_evidence: "No repeated AI advisor consulting", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", count: 0 },
        repeatedDownloads: { confidence_score: 0, supporting_evidence: "No repeated downloads", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", count: 0 },
        repeatedVisitHours: { confidence_score: 0, supporting_evidence: "No repeated visit hours", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", hours: [] },
        repeatedTransitions: { confidence_score: 0, supporting_evidence: "No repeated app transitions", supporting_events: [], observation_period: "0d", last_confirmation: new Date().toISOString(), learning_quality: "Low", sequence: [] },
        engagementTrend: "stable",
        cycleType: "none",
      },
      evolution: { stages: [] },
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
    });

    if (!journey || journey.length === 0) {
      return defaultData();
    }

    const timestampIso = new Date().toISOString();
    const timeline: LearningTimelineEntry[] = [];
    let maturity = 0;

    // Helper to calculate observation period
    const getPeriodStr = (events: JourneyEntry[]): string => {
      if (events.length <= 1) return "0d";
      const first = new Date(events[0].timestamp).getTime();
      const last = new Date(events[events.length - 1].timestamp).getTime();
      const days = Math.round((last - first) / (24 * 60 * 60 * 1000));
      return `${Math.max(1, days)}d`;
    };

    const getQuality = (count: number): "Low" | "Medium" | "High" => {
      if (count >= 8) return "High";
      if (count >= 3) return "Medium";
      return "Low";
    };

    // 1. Behavior Pattern Detection & Confidence Engine
    
    // A. Repeated Searches
    const searchEvents = journey.filter(e => e.event_type === "search");
    const searchTermsMap = new Map<string, { count: number; events: string[]; timestamps: string[] }>();
    searchEvents.forEach(e => {
      const term = (e.payload?.query || "").toLowerCase().trim();
      if (term) {
        const curr = searchTermsMap.get(term) || { count: 0, events: [], timestamps: [] };
        curr.count++;
        curr.events.push(e.event_id);
        curr.timestamps.push(e.timestamp);
        searchTermsMap.set(term, curr);
      }
    });
    
    const repeatedSearchTerms = Array.from(searchTermsMap.entries())
      .filter(([_, stats]) => stats.count >= 2)
      .map(([term]) => term);
    
    const repeatedSearchEvents = searchEvents.filter(e => 
      repeatedSearchTerms.includes((e.payload?.query || "").toLowerCase().trim())
    );

    const searchInsight = {
      confidence_score: repeatedSearchTerms.length > 0 ? Math.min(100, 50 + repeatedSearchTerms.length * 15) : 0,
      supporting_evidence: repeatedSearchTerms.length > 0 
        ? `Repeatedly searched for terms: ${repeatedSearchTerms.map(t => `"${t}"`).join(", ")}`
        : "No repeated search queries",
      supporting_events: repeatedSearchEvents.map(e => e.event_id),
      observation_period: getPeriodStr(repeatedSearchEvents),
      last_confirmation: repeatedSearchEvents.length > 0 ? repeatedSearchEvents[repeatedSearchEvents.length - 1].timestamp : timestampIso,
      learning_quality: getQuality(repeatedSearchEvents.length),
      terms: repeatedSearchTerms,
    };
    if (searchInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned Persistent Search Interests",
        reason: searchInsight.supporting_evidence,
        events: searchInsight.supporting_events.slice(0, 3),
        confidenceDelta: searchInsight.confidence_score,
        timestamp: searchInsight.last_confirmation,
      });
      maturity += 10;
    }

    // B. Repeated Locations
    const locationEvents = journey.filter(e => e.event_type === "property_opened" && e.payload?.location);
    const locMap = new Map<string, { count: number; events: string[]; timestamps: string[] }>();
    locationEvents.forEach(e => {
      const loc = (e.payload.location || "").trim();
      if (loc) {
        const curr = locMap.get(loc) || { count: 0, events: [], timestamps: [] };
        curr.count++;
        curr.events.push(e.event_id);
        curr.timestamps.push(e.timestamp);
        locMap.set(loc, curr);
      }
    });

    const repeatedLocs = Array.from(locMap.entries())
      .filter(([_, stats]) => stats.count >= 2)
      .map(([loc]) => loc);
    
    const repeatedLocEvents = locationEvents.filter(e => repeatedLocs.includes(e.payload.location));

    const locationInsight = {
      confidence_score: repeatedLocs.length > 0 ? Math.min(100, 60 + repeatedLocs.length * 10) : 0,
      supporting_evidence: repeatedLocs.length > 0
        ? `Repeatedly viewed properties in locations: ${repeatedLocs.join(", ")}`
        : "No repeated locations viewed",
      supporting_events: repeatedLocEvents.map(e => e.event_id),
      observation_period: getPeriodStr(repeatedLocEvents),
      last_confirmation: repeatedLocEvents.length > 0 ? repeatedLocEvents[repeatedLocEvents.length - 1].timestamp : timestampIso,
      learning_quality: getQuality(repeatedLocEvents.length),
      locations: repeatedLocs,
    };
    if (locationInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned Location Preferences",
        reason: locationInsight.supporting_evidence,
        events: locationInsight.supporting_events.slice(0, 3),
        confidenceDelta: locationInsight.confidence_score,
        timestamp: locationInsight.last_confirmation,
      });
      maturity += 15;
    }

    // C. Repeated Property Types
    const typeEvents = journey.filter(e => e.event_type === "property_opened" && e.payload?.property_type);
    const typeMap = new Map<string, { count: number; events: string[]; timestamps: string[] }>();
    typeEvents.forEach(e => {
      const type = (e.payload.property_type || "").trim();
      if (type) {
        const curr = typeMap.get(type) || { count: 0, events: [], timestamps: [] };
        curr.count++;
        curr.events.push(e.event_id);
        curr.timestamps.push(e.timestamp);
        typeMap.set(type, curr);
      }
    });

    const repeatedTypes = Array.from(typeMap.entries())
      .filter(([_, stats]) => stats.count >= 2)
      .map(([type]) => type);
    
    const repeatedTypeEvents = typeEvents.filter(e => repeatedTypes.includes(e.payload.property_type));

    const propertyTypesInsight = {
      confidence_score: repeatedTypes.length > 0 ? Math.min(100, 50 + repeatedTypes.length * 15) : 0,
      supporting_evidence: repeatedTypes.length > 0
        ? `Repeatedly viewed property types: ${repeatedTypes.join(", ")}`
        : "No repeated property types viewed",
      supporting_events: repeatedTypeEvents.map(e => e.event_id),
      observation_period: getPeriodStr(repeatedTypeEvents),
      last_confirmation: repeatedTypeEvents.length > 0 ? repeatedTypeEvents[repeatedTypeEvents.length - 1].timestamp : timestampIso,
      learning_quality: getQuality(repeatedTypeEvents.length),
      types: repeatedTypes,
    };
    if (propertyTypesInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned Property Class Focus",
        reason: propertyTypesInsight.supporting_evidence,
        events: propertyTypesInsight.supporting_events.slice(0, 3),
        confidenceDelta: propertyTypesInsight.confidence_score,
        timestamp: propertyTypesInsight.last_confirmation,
      });
      maturity += 10;
    }

    // D. Repeated Insurance Interest
    const insuranceEvents = journey.filter(e => 
      e.application === "insurance" || e.page.includes("/insurance") || e.event_type.includes("quote")
    );
    const insuranceInsight = {
      confidence_score: insuranceEvents.length >= 2 ? Math.min(100, 40 + insuranceEvents.length * 15) : 0,
      supporting_evidence: insuranceEvents.length >= 2
        ? `Observed repeated interest in insurance app with ${insuranceEvents.length} distinct interactions.`
        : "No repeated insurance interest",
      supporting_events: insuranceEvents.map(e => e.event_id),
      observation_period: getPeriodStr(insuranceEvents),
      last_confirmation: insuranceEvents.length > 0 ? insuranceEvents[insuranceEvents.length - 1].timestamp : timestampIso,
      learning_quality: getQuality(insuranceEvents.length),
      pageViews: insuranceEvents.length,
    };
    if (insuranceInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned Insurance Renewal Cycle Interest",
        reason: insuranceInsight.supporting_evidence,
        events: insuranceInsight.supporting_events.slice(0, 3),
        confidenceDelta: insuranceInsight.confidence_score,
        timestamp: insuranceInsight.last_confirmation,
      });
      maturity += 15;
    }

    // E. Repeated AI advisor Questions
    const aiEvents = journey.filter(e => e.event_type === "ai_prompt_sent");
    const aiInsight = {
      confidence_score: aiEvents.length >= 2 ? Math.min(100, 50 + aiEvents.length * 10) : 0,
      supporting_evidence: aiEvents.length >= 2
        ? `Consulted the AI Assistant Advisor ${aiEvents.length} times.`
        : "No repeated AI advisor consulting",
      supporting_events: aiEvents.map(e => e.event_id),
      observation_period: getPeriodStr(aiEvents),
      last_confirmation: aiEvents.length > 0 ? aiEvents[aiEvents.length - 1].timestamp : timestampIso,
      learning_quality: getQuality(aiEvents.length),
      count: aiEvents.length,
    };
    if (aiInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned AI Chat Advisor Dependency",
        reason: aiInsight.supporting_evidence,
        events: aiInsight.supporting_events.slice(0, 3),
        confidenceDelta: aiInsight.confidence_score,
        timestamp: aiInsight.last_confirmation,
      });
      maturity += 10;
    }

    // F. Repeated Guide Downloads
    const downloadEvents = journey.filter(e => e.event_type === "download_started");
    const downloadInsight = {
      confidence_score: downloadEvents.length >= 2 ? Math.min(100, 60 + downloadEvents.length * 20) : 0,
      supporting_evidence: downloadEvents.length >= 2
        ? `Downloaded guides and documentation files ${downloadEvents.length} times.`
        : "No repeated downloads",
      supporting_events: downloadEvents.map(e => e.event_id),
      observation_period: getPeriodStr(downloadEvents),
      last_confirmation: downloadEvents.length > 0 ? downloadEvents[downloadEvents.length - 1].timestamp : timestampIso,
      learning_quality: getQuality(downloadEvents.length),
      count: downloadEvents.length,
    };
    if (downloadInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned Document Engagement Patterns",
        reason: downloadInsight.supporting_evidence,
        events: downloadInsight.supporting_events.slice(0, 3),
        confidenceDelta: downloadInsight.confidence_score,
        timestamp: downloadInsight.last_confirmation,
      });
      maturity += 10;
    }

    // G. Repeated Visit Hours
    const hourMap = new Map<number, { count: number; events: string[] }>();
    journey.forEach(e => {
      const hr = new Date(e.timestamp).getHours();
      const curr = hourMap.get(hr) || { count: 0, events: [] };
      curr.count++;
      curr.events.push(e.event_id);
      hourMap.set(hr, curr);
    });

    const repeatedHours = Array.from(hourMap.entries())
      .filter(([_, stats]) => stats.count >= 2)
      .map(([hr]) => hr)
      .sort((a, b) => a - b);
    
    const repeatedHourEvents = journey.filter(e => repeatedHours.includes(new Date(e.timestamp).getHours()));

    const hourInsight = {
      confidence_score: repeatedHours.length > 0 ? Math.min(100, 40 + repeatedHours.length * 10) : 0,
      supporting_evidence: repeatedHours.length > 0
        ? `Active repeatedly at hours: ${repeatedHours.map(h => `${h}:00`).join(", ")}`
        : "No repeated hourly patterns",
      supporting_events: repeatedHourEvents.map(e => e.event_id),
      observation_period: getPeriodStr(repeatedHourEvents),
      last_confirmation: repeatedHourEvents.length > 0 ? repeatedHourEvents[repeatedHourEvents.length - 1].timestamp : timestampIso,
      learning_quality: getQuality(repeatedHourEvents.length),
      hours: repeatedHours,
    };
    if (hourInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned Chronological Activity Window",
        reason: hourInsight.supporting_evidence,
        events: hourInsight.supporting_events.slice(0, 3),
        confidenceDelta: hourInsight.confidence_score,
        timestamp: hourInsight.last_confirmation,
      });
      maturity += 10;
    }

    // H. Repeated Application Transitions
    const transitions: string[] = [];
    const transitionEvents: string[] = [];
    for (let i = 1; i < journey.length; i++) {
      const prev = journey[i - 1];
      const curr = journey[i];
      if (prev.application !== curr.application) {
        transitions.push(`${prev.application}→${curr.application}`);
        transitionEvents.push(curr.event_id);
      }
    }

    const transMap = new Map<string, number>();
    transitions.forEach(t => transMap.set(t, (transMap.get(t) || 0) + 1));
    const repeatedTransitions = Array.from(transMap.entries())
      .filter(([_, count]) => count >= 2)
      .map(([trans]) => trans);

    const transitionInsight = {
      confidence_score: repeatedTransitions.length > 0 ? Math.min(100, 50 + repeatedTransitions.length * 20) : 0,
      supporting_evidence: repeatedTransitions.length > 0
        ? `Repeatedly navigated between applications: ${repeatedTransitions.join(", ")}`
        : "No repeated app transitions",
      supporting_events: transitionEvents,
      observation_period: getPeriodStr(journey),
      last_confirmation: journey[journey.length - 1].timestamp,
      learning_quality: getQuality(transitionEvents.length),
      sequence: repeatedTransitions,
    };
    if (transitionInsight.confidence_score > 0) {
      timeline.push({
        change: "Learned Multi-App Interoperability",
        reason: transitionInsight.supporting_evidence,
        events: transitionInsight.supporting_events.slice(0, 3),
        confidenceDelta: transitionInsight.confidence_score,
        timestamp: transitionInsight.last_confirmation,
      });
      maturity += 20;
    }

    // 2. Engagement & Cycles Detection
    let engagementTrend: "growing" | "declining" | "stable" = "stable";
    const halfLen = Math.floor(journey.length / 2);
    if (halfLen >= 3) {
      const firstHalf = journey.slice(0, halfLen);
      const secondHalf = journey.slice(halfLen);
      const firstRate = firstHalf.length / getDaysDiff(firstHalf);
      const secondRate = secondHalf.length / getDaysDiff(secondHalf);

      if (secondRate > firstRate * 1.3) {
        engagementTrend = "growing";
      } else if (secondRate < firstRate * 0.7) {
        engagementTrend = "declining";
      }
    }

    // Determine cycle type based on dominated repeated activities
    let cycleType: "research" | "buying" | "selling" | "insurance_renewal" | "none" = "none";
    if (searchInsight.confidence_score > 50 && locationInsight.confidence_score > 55) {
      cycleType = "research";
    }
    if (profile.predictions?.intents?.buying_intent?.confidence > 60 || locationInsight.confidence_score > 70) {
      cycleType = "buying";
    }
    if (profile.predictions?.intents?.selling_intent?.confidence > 50) {
      cycleType = "selling";
    }
    if (insuranceInsight.confidence_score > 50) {
      cycleType = "insurance_renewal";
    }

    // 3. Behavior Evolution Stages
    const stages: BehaviorStage[] = [];
    const epochs = new Map<string, string[]>(); // key: week index, val: types
    journey.forEach(e => {
      const date = new Date(e.timestamp);
      // Use YYYY-WW representation for week groupings
      const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      const list = epochs.get(weekKey) || [];
      
      let interest = e.event_type;
      if (e.event_type === "property_opened" && e.payload?.property_type) {
        interest = e.payload.property_type;
      } else if (e.event_type === "search" && e.payload?.query) {
        interest = `Search: ${e.payload.query}`;
      } else if (e.event_type === "ai_prompt_sent") {
        interest = "AI Consulting";
      }

      list.push(interest);
      epochs.set(weekKey, list);
    });

    epochs.forEach((interests, week) => {
      // Find mode interest
      const modeMap = new Map<string, number>();
      interests.forEach(i => modeMap.set(i, (modeMap.get(i) || 0) + 1));
      let mode = interests[0];
      let maxCount = 0;
      modeMap.forEach((cnt, val) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          mode = val;
        }
      });
      stages.push({
        stage: mode,
        timestamp: week,
      });
    });

    // 4. Adaptive Scoring Computations
    const basePredictions = profile.predictions || {};
    const baseIntents = basePredictions.intents || {};

    const calcAdaptiveScore = (base: number, learnedWeight: number, confidence: number): number => {
      const weight = confidence / 100;
      return Math.round(base * (1 - weight * 0.4) + learnedWeight * (weight * 0.4));
    };

    // Calculate adaptive scores
    const adaptiveScores: AdaptiveScores = {
      buyingIntent: calcAdaptiveScore(
        baseIntents.buying_intent?.confidence || 0,
        locationInsight.confidence_score > 0 ? 90 : 30,
        locationInsight.confidence_score
      ),
      sellingIntent: calcAdaptiveScore(
        baseIntents.selling_intent?.confidence || 0,
        searchInsight.terms.some(t => t.includes("vand") || t.includes("sell") || t.includes("pret")) ? 90 : 30,
        searchInsight.confidence_score
      ),
      investmentIntent: calcAdaptiveScore(
        baseIntents.investment_intent?.confidence || 0,
        searchInsight.terms.some(t => t.includes("invest") || t.includes("yield") || t.includes("randament")) ? 95 : 40,
        searchInsight.confidence_score
      ),
      insuranceIntent: calcAdaptiveScore(
        baseIntents.insurance_interest?.confidence || 0,
        insuranceInsight.confidence_score > 0 ? 95 : 30,
        insuranceInsight.confidence_score
      ),
      luxuryPreference: calcAdaptiveScore(
        profile.luxury_preference ? 85 : 30,
        locationInsight.locations.some(l => l.includes("nordului") || l.includes("herastrau")) ? 95 : 30,
        locationInsight.confidence_score
      ),
      researchDepth: calcAdaptiveScore(
        Math.min(100, journey.length * 6),
        searchInsight.confidence_score > 0 ? 90 : 40,
        searchInsight.confidence_score
      ),
      aiDependency: calcAdaptiveScore(
        baseIntents.ai_assistance_need?.confidence || 0,
        aiInsight.confidence_score > 0 ? 95 : 30,
        aiInsight.confidence_score
      ),
      conversionReadiness: calcAdaptiveScore(
        basePredictions.conversions?.form_completion_probability?.value || 30,
        downloadInsight.confidence_score > 0 || transitionInsight.confidence_score > 50 ? 90 : 35,
        Math.max(downloadInsight.confidence_score, transitionInsight.confidence_score)
      ),
      returnProbability: calcAdaptiveScore(
        journey.length > 5 ? 85 : 40,
        hourInsight.confidence_score > 0 ? 90 : 50,
        hourInsight.confidence_score
      ),
    };

    return {
      maturity: Math.min(100, maturity),
      patterns: {
        repeatedSearches: searchInsight,
        repeatedLocations: locationInsight,
        repeatedPropertyTypes: propertyTypesInsight,
        repeatedInsurance: insuranceInsight,
        repeatedAiQuestions: aiInsight,
        repeatedDownloads: downloadInsight,
        repeatedVisitHours: hourInsight,
        repeatedTransitions: transitionInsight,
        engagementTrend,
        cycleType,
      },
      evolution: {
        stages,
      },
      adaptiveScores,
      timeline,
    };
  }

  /**
   * Enhances advice recommendations based on learned high-confidence insights.
   */
  public static enhanceRecommendations(
    recommendations: any[],
    learning: LearningData
  ): any[] {
    const enhanced = [...recommendations];
    
    // Check for high confidence buyer journey (repeated properties + mortgage downloads + insurance app)
    const repeatedProps = learning.patterns.repeatedPropertyTypes.confidence_score > 60;
    const downloads = learning.patterns.repeatedDownloads.confidence_score > 50;
    const insurance = learning.patterns.repeatedInsurance.confidence_score > 50;

    if (repeatedProps && downloads && insurance) {
      enhanced.push({
        id: `learned-rec-high-conf-buyer`,
        title: "Initiate Premium Mortgage & Insurance Concierge Engagement",
        explanation: "This visitor exhibits a high-confidence end-to-end buying pattern. They repeatedly viewed property listings, searched locations, downloaded materials, and requested insurance quotes.",
        priority: "High",
        urgency: "High",
        expected_impact: "High",
        confidence: 95,
        evidence: [
          `Repeated Property Focus: ${learning.patterns.repeatedPropertyTypes.supporting_evidence}`,
          `Doc Download Activity: ${learning.patterns.repeatedDownloads.supporting_evidence}`,
          `Insurance Telemetry: ${learning.patterns.repeatedInsurance.supporting_evidence}`,
        ],
      });
    }

    // Check for repeated AI dependency
    if (learning.patterns.repeatedAiQuestions.confidence_score > 70) {
      enhanced.push({
        id: `learned-rec-heavy-ai-user`,
        title: "Suggest Advanced AI Document Intelligence Dashboard Integration",
        explanation: "Visitor frequently queries the AI Assistant Advisor regarding property analysis, contract terms, or financial projections. Advise sales to provide advanced analytical PDF uploads.",
        priority: "Medium",
        urgency: "Medium",
        expected_impact: "High",
        confidence: 90,
        evidence: [
          `Submitted ${learning.patterns.repeatedAiQuestions.count} questions to AI chatbot.`,
          "High confidence advisory score computed.",
        ],
      });
    }

    return enhanced;
  }
}

// Helpers
function getDaysDiff(events: JourneyEntry[]): number {
  if (events.length <= 1) return 1;
  const first = new Date(events[0].timestamp).getTime();
  const last = new Date(events[events.length - 1].timestamp).getTime();
  const diffDays = (last - first) / (24 * 60 * 60 * 1000);
  return Math.max(1, Math.round(diffDays));
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}
