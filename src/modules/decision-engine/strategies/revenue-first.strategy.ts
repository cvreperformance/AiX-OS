import { DecisionStrategy } from './strategy.interface';
import { Decision } from '../types/decision.types';

export class RevenueFirstStrategy implements DecisionStrategy {
  name = 'RevenueFirstStrategy';

  public prioritize(decisions: Decision[]): Decision[] {
    return [...decisions].sort((a, b) => {
      // 1. Highest Revenue First
      if (b.estimatedRevenue !== a.estimatedRevenue) {
        return b.estimatedRevenue - a.estimatedRevenue;
      }
      // 2. Then Priority (Score)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // 3. Then Urgency (Deadline)
      return a.deadline.localeCompare(b.deadline);
    });
  }
}
