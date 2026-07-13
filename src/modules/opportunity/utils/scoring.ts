import { ScoringWeights, DEFAULT_SCORING_WEIGHTS } from '../constants';
import { OpportunityScore } from '../types/opportunity.types';

export class ScoringEngine {
  private weights: ScoringWeights;

  constructor(customWeights?: Partial<ScoringWeights>) {
    this.weights = { ...DEFAULT_SCORING_WEIGHTS, ...customWeights };
  }

  /**
   * Computes the final score using the configured weights.
   * Enforces normalization so factors are capped between 0 and 100.
   */
  public compute(factors: Record<keyof ScoringWeights, number>): OpportunityScore {
    // Normalize factor values to be strictly between 0 and 100
    const normalize = (val: number) => Math.max(0, Math.min(100, val));

    const breakdown = {
      revenuePotential: normalize(factors.revenuePotential),
      urgency: normalize(factors.urgency),
      probability: normalize(factors.probability),
      relationship: normalize(factors.relationship),
      competition: normalize(factors.competition),
      timeSensitivity: normalize(factors.timeSensitivity),
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const key of Object.keys(this.weights) as Array<keyof ScoringWeights>) {
      totalScore += breakdown[key] * this.weights[key];
      totalWeight += this.weights[key];
    }

    // Adjust final score if weights do not perfectly sum to 1.0
    if (totalWeight > 0) {
      totalScore = totalScore / totalWeight;
    }

    return {
      totalScore: Number(totalScore.toFixed(2)),
      breakdown
    };
  }
}
