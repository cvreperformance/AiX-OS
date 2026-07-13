import { OutcomeRecord, OutcomeKPIs, OutcomeInsight } from '../types/outcome.types';

export class OutcomeEngineService {
  private outcomes: OutcomeRecord[] = [];

  constructor(initialOutcomes: OutcomeRecord[] = []) {
    this.outcomes = [...initialOutcomes];
  }

  public record(outcome: OutcomeRecord): OutcomeRecord {
    this.outcomes.push(outcome);
    return outcome;
  }

  public calculateKPIs(): OutcomeKPIs {
    const total = this.outcomes.length;
    if (total === 0) {
      return { decisionAccuracy: 0, revenueAccuracy: 0, conversionRate: 0, averageResponseTime: 0, averageTimeToClose: 0, ignoredRate: 0 };
    }

    const wonOutcomes = this.outcomes.filter(o => o.outcome === 'Won');
    const ignoredOutcomes = this.outcomes.filter(o => o.outcome === 'Ignored');
    
    const conversionRate = (wonOutcomes.length / total) * 100;
    const ignoredRate = (ignoredOutcomes.length / total) * 100;

    // Accuracy: The engine predicted a win (high probability) AND it won.
    // Or deterministic: if actualResult is true, the engine's core goal was satisfied.
    const correctDecisions = this.outcomes.filter(o => o.actualResult).length;
    const decisionAccuracy = (correctDecisions / total) * 100;

    let totalEst = 0;
    let totalAct = 0;
    wonOutcomes.forEach(o => {
      totalEst += o.estimatedRevenue;
      totalAct += (o.actualRevenue || 0);
    });
    const revenueAccuracy = totalEst > 0 ? (totalAct / totalEst) * 100 : 0;

    const responseTimes = this.outcomes.filter(o => o.executionTime !== undefined).map(o => o.executionTime!);
    const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
    
    const closeTimes = wonOutcomes.filter(o => o.executionTime !== undefined).map(o => o.executionTime!);
    const averageTimeToClose = closeTimes.length > 0 ? closeTimes.reduce((a, b) => a + b, 0) / closeTimes.length : 0;

    return {
      decisionAccuracy: Math.round(decisionAccuracy),
      revenueAccuracy: Math.round(revenueAccuracy),
      conversionRate: Math.round(conversionRate),
      averageResponseTime: Math.round(averageResponseTime),
      averageTimeToClose: Math.round(averageTimeToClose),
      ignoredRate: Math.round(ignoredRate)
    };
  }

  public generateInsights(): OutcomeInsight[] {
    const insights: OutcomeInsight[] = [];
    const kpis = this.calculateKPIs();

    if (kpis.ignoredRate > 20) {
      insights.push({ id: 'i1', message: 'High ignored recommendation rate detected. The Decision Engine might be scoring low-relevance items too high.', confidence: 85 });
    }

    if (kpis.conversionRate > 40) {
      insights.push({ id: 'i2', message: 'Strong conversion rate. The RevenueFirstStrategy correctly predicted the winning opportunities.', confidence: 92 });
    }

    const highValueLost = this.outcomes.filter(o => o.estimatedRevenue > 400000 && o.outcome === 'Lost');
    const highValueWon = this.outcomes.filter(o => o.estimatedRevenue > 400000 && o.outcome === 'Won');
    
    if (highValueLost.length > highValueWon.length) {
      insights.push({ id: 'i3', message: 'Properties above €400k convert significantly worse than lower tier listings.', confidence: 78 });
    }

    // Dummy insights based on simple deterministic conditions
    const avgProbLost = this.outcomes.filter(o => o.outcome === 'Lost').reduce((acc, curr) => acc + curr.expectedProbability, 0);
    if (avgProbLost > 100) {
      insights.push({ id: 'i4', message: 'The engine is highly confident in deals that are eventually lost. Adjust risk rules.', confidence: 88 });
    }

    return insights;
  }
}
