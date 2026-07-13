import { RuleEngineService } from '../services/rule-engine.service';
import { Rule } from '../types/rule.types';
import { expect, describe, it } from 'vitest';

describe('RuleEngineService', () => {
  const engine = new RuleEngineService();

  it('should process a single rule correctly', () => {
    const rules: Rule[] = [
      {
        id: '1', name: 'Test', description: '', priority: 1, enabled: true,
        conditions: [{ field: 'text', type: 'contains', value: 'apple' }],
        effects: [{ type: 'increaseScore', value: 10 }]
      }
    ];

    const result = engine.execute(rules, { text: 'I have an apple' }, { score: 10 });
    expect(result.score).toBe(20);
  });

  it('should evaluate multiple rules and apply effects sequentially', () => {
    const rules: Rule[] = [
      {
        id: '1', name: 'Add', description: '', priority: 1, enabled: true,
        conditions: [{ field: 'text', type: 'contains', value: 'apple' }],
        effects: [{ type: 'increaseScore', value: 10 }, { type: 'addStrength', value: 'Fruit' }]
      },
      {
        id: '2', name: 'Subtract', description: '', priority: 1, enabled: true,
        conditions: [{ field: 'age', type: 'numberGreaterThan', value: 5 }],
        effects: [{ type: 'decreaseScore', value: 5 }]
      }
    ];

    const result = engine.execute(rules, { text: 'apple', age: 10 }, { score: 10, strengths: [] });
    expect(result.score).toBe(15); // 10 + 10 - 5
    expect(result.strengths).toContain('Fruit');
  });

  it('should respect priority conflicts', () => {
    // Priority 100 runs first (sets High). Priority 10 runs second (overrides to Low).
    const rules: Rule[] = [
      {
        id: 'p10', name: '', description: '', priority: 10, enabled: true,
        conditions: [],
        effects: [{ type: 'setRisk', value: 'Low' }]
      },
      {
        id: 'p100', name: '', description: '', priority: 100, enabled: true,
        conditions: [],
        effects: [{ type: 'setRisk', value: 'High' }]
      }
    ];

    const result = engine.execute(rules, {}, { riskLevel: 'Unknown' });
    expect(result.riskLevel).toBe('Low');
  });

  it('should ignore disabled rules', () => {
    const rules: Rule[] = [
      {
        id: '1', name: '', description: '', priority: 1, enabled: false,
        conditions: [],
        effects: [{ type: 'increaseScore', value: 100 }]
      }
    ];

    const result = engine.execute(rules, {}, { score: 0 });
    expect(result.score).toBe(0);
  });

  it('should provide deterministic output for complex configurations', () => {
    const rules: Rule[] = [
      {
        id: '1', name: '', description: '', priority: 1, enabled: true,
        conditions: [{ field: 'price', type: 'exists' }],
        effects: [{ type: 'setPropertyType', value: 'Priced Property' }]
      }
    ];

    const result1 = engine.execute(rules, { price: 100 }, {});
    const result2 = engine.execute(rules, { price: 100 }, {});
    expect(result1.propertyType).toBe(result2.propertyType);
  });
});
