import { IntentPredictor } from "./intent-predictor";
import { ConversionPredictor } from "./conversion-predictor";
import { NextActionPredictor } from "./next-action";
import { ChurnPredictor } from "./churn";
import { RecommendationEngine } from "./recommendations";
import { PredictionSnapshot, PredictionHistoryEntry } from "./types";
import { JourneyEntry } from "../cross-app/journey-builder";

export class PredictionEngine {
  /**
   * Evaluates all predictive modules and returns a structured advisory snapshot.
   */
  public static compute(
    visitorId: string,
    journey: JourneyEntry[],
    previousSnapshot?: PredictionSnapshot | null
  ): { snapshot: PredictionSnapshot; historyEntry?: PredictionHistoryEntry } {
    const generated_at = new Date().toISOString();
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h expiration

    // 1. Execute sub-predictors
    const intents = IntentPredictor.predict(journey);
    const conversions = ConversionPredictor.predict(journey);
    const next_action = NextActionPredictor.predict(journey);
    const churn_risk = ChurnPredictor.predict(journey);

    // 2. Generate Recommendations
    const recommendations = RecommendationEngine.generate(
      visitorId,
      journey,
      intents,
      conversions,
      churn_risk
    );

    // 3. Compute Trends (improving, stable, declining)
    const getTrend = (curr: number, prev: number): "improving" | "stable" | "declining" => {
      const diff = curr - prev;
      if (diff > 5) return "improving";
      if (diff < -5) return "declining";
      return "stable";
    };

    const prevIntents = previousSnapshot?.intents;
    const prevConversions = previousSnapshot?.conversions;
    const prevChurn = previousSnapshot?.churn_risk;

    const trends = {
      buying_intent: getTrend(intents.buying_intent.confidence, prevIntents?.buying_intent.confidence || 0),
      conversion_probability: getTrend(conversions.contact_probability.value, prevConversions?.contact_probability.value || 0),
      engagement: getTrend(intents.ai_assistance_need.confidence, prevIntents?.ai_assistance_need.confidence || 0),
      churn_risk: getTrend(churn_risk.confidence, prevChurn?.confidence || 0),
    };

    const snapshot: PredictionSnapshot = {
      prediction_version: "1.0.0",
      model_version: "2.0.0",
      generated_at,
      expires_at,
      intents,
      conversions,
      next_action,
      churn_risk,
      recommendations,
      trends,
    };

    // 4. Log Prediction Audit Trail (delta history)
    let historyEntry: PredictionHistoryEntry | undefined = undefined;
    if (previousSnapshot) {
      historyEntry = {
        timestamp: generated_at,
        triggering_event: journey[journey.length - 1]?.event_type || "rebuild",
        previous_snapshot: previousSnapshot,
        new_snapshot: snapshot,
        delta: {
          buying_intent_change: intents.buying_intent.confidence - (prevIntents?.buying_intent.confidence || 0),
          conversion_change: conversions.contact_probability.value - (prevConversions?.contact_probability.value || 0),
          churn_change: churn_risk.confidence - (prevChurn?.confidence || 0),
        },
      };
    }

    return { snapshot, historyEntry };
  }
}
export default PredictionEngine;
