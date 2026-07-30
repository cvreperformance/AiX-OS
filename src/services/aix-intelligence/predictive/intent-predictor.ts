import { IntentPredictions, PredictorOutput } from "./types";
import { JourneyEntry } from "../cross-app/journey-builder";

export class IntentPredictor {
  /**
   * Estimates visitor transaction and engagement intents with confidence, signals, and evidence.
   */
  public static predict(journey: JourneyEntry[]): IntentPredictions {
    const totalEvents = journey.length;

    // Helper to evaluate confidence and certainty levels
    const buildOutput = <T>(
      value: T,
      rawScore: number,
      evidence: string[],
      signals: string[]
    ): PredictorOutput<T> => {
      const confidence = Math.min(100, Math.max(0, Math.round(rawScore)));
      let certainty: "Low" | "Medium" | "High" = "Low";
      if (evidence.length >= 3 && confidence > 70) certainty = "High";
      else if (evidence.length >= 1 && confidence > 30) certainty = "Medium";

      return {
        value,
        confidence,
        certainty,
        evidence,
        supporting_signals: signals,
      };
    };

    // Calculate Buying Intent
    const buyKeywords = ["buy", "cumpara", "proprietati", "pricing"];
    const buyHits = journey.filter(e => buyKeywords.some(kw => e.page.toLowerCase().includes(kw))).length;
    const propertyOpens = journey.filter(e => e.event_type === "property_opened").length;
    const saves = journey.filter(e => e.event_type === "property_saved").length;
    
    const buyEvidence: string[] = [];
    const buySignals: string[] = [];
    if (buyHits > 0) {
      buyEvidence.push(`Visited ${buyHits} buying-related page listings`);
      buySignals.push("BUY_KEYWORDS_CORRELATION");
    }
    if (propertyOpens > 0) {
      buyEvidence.push(`Opened ${propertyOpens} property detail listings`);
      buySignals.push("PROPERTY_OPEN_TELEMETRY");
    }
    if (saves > 0) {
      buyEvidence.push(`Saved ${saves} property items to list`);
      buySignals.push("PROPERTY_SAVE_ACTION");
    }
    const buyScore = buyHits * 10 + propertyOpens * 15 + saves * 25;
    const buying_intent = buildOutput(Math.min(100, buyScore), buyScore, buyEvidence, buySignals);

    // Calculate Selling Intent
    const sellKeywords = ["sell", "vinde", "listings/create", "publish"];
    const sellHits = journey.filter(e => sellKeywords.some(kw => e.page.toLowerCase().includes(kw))).length;
    const sellForms = journey.filter(e => e.event_type === "form_started" && e.page.includes("sell")).length;
    const sellEvidence: string[] = [];
    const sellSignals: string[] = [];
    if (sellHits > 0) {
      sellEvidence.push(`Visited ${sellHits} listing creation sections`);
      sellSignals.push("SELL_KEYWORDS_CORRELATION");
    }
    if (sellForms > 0) {
      sellEvidence.push(`Initiated property registration flow`);
      sellSignals.push("SELL_FORM_INITIALIZATION");
    }
    const sellScore = sellHits * 25 + sellForms * 35;
    const selling_intent = buildOutput(Math.min(100, sellScore), sellScore, sellEvidence, sellSignals);

    // Calculate Rental Intent
    const rentKeywords = ["rent", "inchiriaza", "chirie"];
    const rentHits = journey.filter(e => rentKeywords.some(kw => e.page.toLowerCase().includes(kw))).length;
    const rentEvidence: string[] = [];
    const rentSignals: string[] = [];
    if (rentHits > 0) {
      rentEvidence.push(`Visited ${rentHits} rental categories`);
      rentSignals.push("RENT_KEYWORDS_CORRELATION");
    }
    const rentScore = rentHits * 20;
    const rental_intent = buildOutput(Math.min(100, rentScore), rentScore, rentEvidence, rentSignals);

    // Calculate Investment Intent
    const investKeywords = ["investment", "yield", "oportunitati", "market-radar", "valuation"];
    const investHits = journey.filter(e => investKeywords.some(kw => e.page.toLowerCase().includes(kw))).length;
    const investEvidence: string[] = [];
    const investSignals: string[] = [];
    if (investHits > 0) {
      investEvidence.push(`Consulted ${investHits} yield or valuation models`);
      investSignals.push("INVESTMENT_ANALYSIS_VIEW");
    }
    const investScore = investHits * 25;
    const investment_intent = buildOutput(Math.min(100, investScore), investScore, investEvidence, investSignals);

    // Calculate Insurance Interest
    const insKeywords = ["insurance", "asigurare", "convenience", "concierge"];
    const insHits = journey.filter(e => insKeywords.some(kw => e.page.toLowerCase().includes(kw))).length;
    const insEvidence: string[] = [];
    const insSignals: string[] = [];
    if (insHits > 0) {
      insEvidence.push(`Read ${insHits} convenience or insurance policy terms`);
      insSignals.push("INSURANCE_POLICY_CONSULTATION");
    }
    const insScore = insHits * 30;
    const insurance_interest = buildOutput(Math.min(100, insScore), insScore, insEvidence, insSignals);

    // Calculate AI Assistance Need
    const aiPrompts = journey.filter(e => e.event_type === "ai_prompt_sent").length;
    const aiErrors = journey.filter(e => e.event_type === "ai_prompt_error").length;
    const aiEvidence: string[] = [];
    const aiSignals: string[] = [];
    if (aiPrompts > 0) {
      aiEvidence.push(`Exchanged ${aiPrompts} prompts with AI chatbot`);
      aiSignals.push("AI_ACTIVE_CHATS");
    }
    if (aiErrors > 0) {
      aiEvidence.push("Registered AI Advisor service connection error");
      aiSignals.push("AI_SERVICE_CONNECTION_ERROR");
    }
    const aiScore = aiPrompts * 20 + aiErrors * 40;
    const ai_assistance_need = buildOutput(Math.min(100, aiScore), aiScore, aiEvidence, aiSignals);

    return {
      buying_intent,
      selling_intent,
      rental_intent,
      investment_intent,
      insurance_interest,
      ai_assistance_need,
    };
  }
}
export default IntentPredictor;
