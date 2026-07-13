import { Rule, Condition, Effect } from '../types/rule.types';

export class RuleEngineService {
  /**
   * Evaluates a set of rules against an input context and returns the mutated state.
   */
  public execute(rules: Rule[], inputContext: Record<string, any>, initialState: Record<string, any>): Record<string, any> {
    const state = { ...initialState };
    
    // Filter enabled rules and sort by priority (descending, highest first)
    const activeRules = rules
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of activeRules) {
      if (this.evaluateConditions(rule.conditions, inputContext)) {
        this.applyEffects(rule.effects, state);
      }
    }

    return state;
  }

  private evaluateConditions(conditions: Condition[], context: Record<string, any>): boolean {
    if (conditions.length === 0) return true;

    return conditions.every(condition => {
      const fieldValue = context[condition.field];

      switch (condition.type) {
        case 'contains':
          return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(String(condition.value).toLowerCase());
        case 'startsWith':
          return typeof fieldValue === 'string' && fieldValue.toLowerCase().startsWith(String(condition.value).toLowerCase());
        case 'endsWith':
          return typeof fieldValue === 'string' && fieldValue.toLowerCase().endsWith(String(condition.value).toLowerCase());
        case 'regex':
          return typeof fieldValue === 'string' && new RegExp(condition.value, 'i').test(fieldValue);
        case 'numberGreaterThan':
          return typeof fieldValue === 'number' && fieldValue > Number(condition.value);
        case 'numberLessThan':
          return typeof fieldValue === 'number' && fieldValue < Number(condition.value);
        case 'exists':
          return fieldValue !== undefined && fieldValue !== null;
        case 'missing':
          return fieldValue === undefined || fieldValue === null;
        default:
          return false;
      }
    });
  }

  private applyEffects(effects: Effect[], state: Record<string, any>): void {
    for (const effect of effects) {
      switch (effect.type) {
        case 'increaseScore':
          state.score = (state.score || 0) + Number(effect.value);
          break;
        case 'decreaseScore':
          state.score = (state.score || 0) - Number(effect.value);
          break;
        case 'addStrength':
          if (!state.strengths) state.strengths = [];
          state.strengths.push(effect.value);
          break;
        case 'addWeakness':
          if (!state.weaknesses) state.weaknesses = [];
          state.weaknesses.push(effect.value);
          break;
        case 'setRisk':
          state.riskLevel = effect.value;
          break;
        case 'setPriority':
          state.recommendation = effect.value;
          break;
        case 'setPropertyType':
          state.propertyType = effect.value;
          break;
      }
    }
  }
}
