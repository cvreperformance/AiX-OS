import { DecisionStrategy } from './strategy.interface';
import { Decision } from '../types/decision.types';

export class BalancedStrategy implements DecisionStrategy {
  name = 'BalancedStrategy';

  public prioritize(decisions: Decision[]): Decision[] {
    return [...decisions].sort((a, b) => {
      // Blends score and urgency heavily
      const scoreA = a.priority * 0.5 + (1000000 / (a.estimatedRevenue || 1)) * 0.1;
      const scoreB = b.priority * 0.5 + (1000000 / (b.estimatedRevenue || 1)) * 0.1;
      return scoreB - scoreA;
    });
  }
}
