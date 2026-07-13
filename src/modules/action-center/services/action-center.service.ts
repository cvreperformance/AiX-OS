import { ActionItem, ActionStatus, ActionStatistics } from '../types/action.types';
import { DecisionEngineService } from '../../decision-engine/services/decision-engine.service';
import { OutcomeEngineService } from '../../outcome-engine/services/outcome-engine.service';

export class ActionCenterService {
  private actions: ActionItem[] = [];
  private decisionEngine: DecisionEngineService;
  private outcomeEngine: OutcomeEngineService;

  constructor(initialActions: ActionItem[] = []) {
    this.decisionEngine = new DecisionEngineService();
    this.outcomeEngine = new OutcomeEngineService();
    // Deep clone to prevent mutating global mock data during tests or runtime
    this.actions = initialActions.map(a => ({ ...a }));
  }

  public loadActions(): ActionItem[] {
    return this.sort(this.actions);
  }

  public sort(actions: ActionItem[]): ActionItem[] {
    // Pass raw actions into the Decision Engine
    const decisions = this.decisionEngine.build(actions);
    const rankedDecisions = this.decisionEngine.prioritize(decisions);

    // Map the ranked decisions back to ActionItems, attaching the Engine's explanations
    return rankedDecisions.map(d => {
      const original = actions.find(a => a.id === d.id);
      return {
        ...original,
        explanation: d.explanation
      } as ActionItem;
    });
  }

  public updateStatus(id: string, status: ActionStatus): ActionItem[] {
    const action = this.actions.find(a => a.id === id);
    if (action) {
      action.status = status;
      
      // Integrate Outcome Engine loop
      if (status === 'Completed' || status === 'Ignored') {
        this.outcomeEngine.record({
          id: `out_${id}_${Date.now()}`,
          decisionId: `dec_${id}`,
          actionId: id,
          opportunityId: `opp_${id}`,
          createdAt: new Date().toISOString(),
          completedAt: status === 'Completed' ? new Date().toISOString() : undefined,
          outcome: status === 'Completed' ? 'Won' : 'Ignored',
          estimatedRevenue: action.estimatedRevenue,
          actualRevenue: status === 'Completed' ? action.estimatedRevenue : 0,
          expectedProbability: action.opportunityScore,
          actualResult: status === 'Completed',
          executionTime: status === 'Completed' ? 1200 : 30 // Mock time
        });
      }
    }
    return this.loadActions();
  }

  public getOutcomes() {
    return this.outcomeEngine;
  }

  public start(id: string): ActionItem[] { return this.updateStatus(id, 'In Progress'); }
  public complete(id: string): ActionItem[] { return this.updateStatus(id, 'Completed'); }
  public ignore(id: string): ActionItem[] { return this.updateStatus(id, 'Ignored'); }
  public defer(id: string): ActionItem[] { return this.updateStatus(id, 'Deferred'); }

  public statistics(): ActionStatistics {
    const pendingCount = this.actions.filter(a => a.status === 'Pending' || a.status === 'In Progress' || a.status === 'Deferred').length;
    const completedCount = this.actions.filter(a => a.status === 'Completed').length;
    const ignoredCount = this.actions.filter(a => a.status === 'Ignored').length;
    
    const activeCount = pendingCount + completedCount;
    const completionRate = activeCount > 0 ? Math.round((completedCount / activeCount) * 100) : 0;

    const estimatedRevenueCompleted = this.actions
      .filter(a => a.status === 'Completed')
      .reduce((sum, a) => sum + a.estimatedRevenue, 0);

    const estimatedRevenueRemaining = this.actions
      .filter(a => a.status === 'Pending' || a.status === 'In Progress' || a.status === 'Deferred')
      .reduce((sum, a) => sum + a.estimatedRevenue, 0);

    return {
      pendingCount,
      completedCount,
      ignoredCount,
      completionRate,
      estimatedRevenueCompleted,
      estimatedRevenueRemaining
    };
  }
}
