import { DecisionStrategy } from './strategy.interface';
import { Decision } from '../types/decision.types';

export class RevenueFirstStrategy implements DecisionStrategy {
  name = 'RevenueFirstStrategy';
  description = 'Prioritizes decisions strictly based on commission × probability × urgency';

  prioritize(decisions: Decision[]): Decision[] {
    return [...decisions].sort((a, b) => {
      const scoreA = this.calculateScore(a);
      const scoreB = this.calculateScore(b);
      
      // Fallback to priority if scores are perfectly equal
      if (scoreA === scoreB) {
        return b.priority - a.priority;
      }
      return scoreB - scoreA;
    });
  }

  private calculateScore(decision: Decision): number {
    const commission = decision.potentialCommission || decision.estimatedRevenue || 0;
    const probability = (decision.probability ?? 100) / 100;
    const urgency = decision.urgencyMultiplier ?? 1;

    return commission * probability * urgency;
  }
}
