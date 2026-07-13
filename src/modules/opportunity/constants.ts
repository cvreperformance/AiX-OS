export interface ScoringWeights {
  revenuePotential: number;
  urgency: number;
  probability: number;
  relationship: number;
  competition: number;
  timeSensitivity: number;
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  revenuePotential: 0.25,
  urgency: 0.20,
  probability: 0.20,
  relationship: 0.15,
  competition: 0.10,
  timeSensitivity: 0.10,
};
