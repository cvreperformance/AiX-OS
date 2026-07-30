export interface PredictorOutput<T> {
  value: T;
  confidence: number; // 0 - 100
  certainty: "Low" | "Medium" | "High";
  evidence: string[];
  supporting_signals: string[];
}

export interface IntentPredictions {
  buying_intent: PredictorOutput<number>;
  selling_intent: PredictorOutput<number>;
  rental_intent: PredictorOutput<number>;
  investment_intent: PredictorOutput<number>;
  insurance_interest: PredictorOutput<number>;
  ai_assistance_need: PredictorOutput<number>;
}

export interface ConversionPredictions {
  contact_probability: PredictorOutput<number>;
  form_completion_probability: PredictorOutput<number>;
  guide_download_probability: PredictorOutput<number>;
  property_enquiry_probability: PredictorOutput<number>;
  return_visit_probability: PredictorOutput<number>;
}

export interface RecommendationIntervention {
  id: string;
  title: string;
  explanation: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  urgency: "Low" | "Medium" | "High";
  expected_impact: "Low" | "Medium" | "High";
  confidence: number;
  evidence: string[];
}

export interface PredictionSnapshot {
  prediction_version: string;
  model_version: string;
  generated_at: string;
  expires_at: string;
  intents: IntentPredictions;
  conversions: ConversionPredictions;
  next_action: PredictorOutput<string>;
  churn_risk: PredictorOutput<number>;
  recommendations: RecommendationIntervention[];
  trends: {
    buying_intent: "improving" | "stable" | "declining";
    conversion_probability: "improving" | "stable" | "declining";
    engagement: "improving" | "stable" | "declining";
    churn_risk: "improving" | "stable" | "declining";
  };
}

export interface PredictionHistoryEntry {
  timestamp: string;
  triggering_event: string;
  previous_snapshot: any;
  new_snapshot: any;
  delta: {
    buying_intent_change: number;
    conversion_change: number;
    churn_change: number;
  };
}
