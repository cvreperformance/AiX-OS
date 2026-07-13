import { Decision } from '../types/decision.types';
import { DecisionStrategy } from '../strategies/strategy.interface';
import { RevenueFirstStrategy } from '../strategies/revenue-first.strategy';

export class DecisionEngineService {
  private strategy: DecisionStrategy;

  constructor(strategy?: DecisionStrategy) {
    this.strategy = strategy || new RevenueFirstStrategy();
  }

  public setStrategy(strategy: DecisionStrategy): void {
    this.strategy = strategy;
  }

  public build(rawInputs: any[]): Decision[] {
    return rawInputs.map(input => ({
      id: input.id,
      title: input.title,
      description: input.description || '',
      reason: input.reason || 'Routine operation.',
      priority: input.opportunityScore || input.priority || 50,
      confidence: 90,
      estimatedRevenue: input.estimatedRevenue || input.value || 0,
      estimatedTime: 15,
      deadline: input.dueTime || input.dueDate || '23:59',
      requiredAction: input.recommendedAction || 'Review',
      relatedOpportunity: input.relatedOpportunity || input.id
    }));
  }

  public prioritize(decisions: Decision[]): Decision[] {
    const ranked = this.strategy.prioritize(decisions);
    
    return ranked.map((decision, index) => {
      return {
        ...decision,
        explanation: this.explain(decision, index, ranked.length),
        impact: this.estimateImpact(decision)
      };
    });
  }

  public explain(decision: Decision, rankIndex: number, total: number): string {
    let explanation = `Reason: ${decision.reason} `;
    
    if (rankIndex === 0) {
      explanation += `\nWhy is this #1? It perfectly aligns with the ${this.strategy.name} goals, maximizing impact. `;
    } else {
      explanation += `\nRanked #${rankIndex + 1} out of ${total} via ${this.strategy.name}. `;
    }
    
    explanation += `\nExpected impact: ${this.estimateImpact(decision)}.`;
    return explanation;
  }

  public estimateImpact(decision: Decision): string {
    if (decision.estimatedRevenue >= 1000000) {
      return `Critical financial impact (€${(decision.estimatedRevenue / 1000000).toFixed(1)}M).`;
    } else if (decision.estimatedRevenue > 100000) {
      return `High financial impact (€${(decision.estimatedRevenue / 1000).toFixed(0)}k).`;
    }
    return `Moderate impact. Keeps pipeline active.`;
  }

  public filter(decisions: Decision[], predicate: (d: Decision) => boolean): Decision[] {
    return decisions.filter(predicate);
  }
}
