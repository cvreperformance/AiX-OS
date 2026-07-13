import { Decision } from '../types/decision.types';

export interface DecisionStrategy {
  name: string;
  prioritize(decisions: Decision[]): Decision[];
}
