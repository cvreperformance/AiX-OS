export type ConditionType = 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'numberGreaterThan' | 'numberLessThan' | 'exists' | 'missing';

export interface Condition {
  field: string;
  type: ConditionType;
  value?: any;
}

export type EffectType = 'increaseScore' | 'decreaseScore' | 'addStrength' | 'addWeakness' | 'setRisk' | 'setPriority' | 'setPropertyType';

export interface Effect {
  type: EffectType;
  value: any;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  conditions: Condition[];
  effects: Effect[];
}
