import { ScoringEngine } from '../utils/scoring';
import { mockOpportunities } from '../mock/opportunities';
import { expect, describe, it } from 'vitest';

describe('ScoringEngine', () => {
  it('should calculate a correct score for a high opportunity (Developer)', () => {
    const engine = new ScoringEngine();
    const result = engine.compute(mockOpportunities.developer);
    
    // Default weights: RP(0.25), U(0.20), P(0.20), Rel(0.15), C(0.10), TS(0.10)
    // Dev: RP(100)*.25 + U(70)*.20 + P(85)*.20 + Rel(60)*.15 + C(80)*.10 + TS(60)*.10
    // = 25 + 14 + 17 + 9 + 8 + 6 = 79
    expect(result.totalScore).toBeGreaterThanOrEqual(79);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });

  it('should calculate a correct score for a medium opportunity (Investor)', () => {
    const engine = new ScoringEngine();
    const result = engine.compute(mockOpportunities.investor);
    
    // Investor: RP(85)*.25 + U(40)*.20 + P(50)*.20 + Rel(50)*.15 + C(70)*.10 + TS(30)*.10
    // = 21.25 + 8 + 10 + 7.5 + 7 + 3 = 56.75
    expect(result.totalScore).toBeCloseTo(56.75);
  });

  it('should calculate a correct score for a low opportunity (with custom low values)', () => {
    const engine = new ScoringEngine();
    const result = engine.compute({
      revenuePotential: 10,
      urgency: 10,
      probability: 10,
      relationship: 10,
      competition: 10,
      timeSensitivity: 10,
    });
    expect(result.totalScore).toBeCloseTo(10);
  });

  it('should handle custom weight modification correctly', () => {
    const customEngine = new ScoringEngine({ revenuePotential: 1.0, urgency: 0, probability: 0, relationship: 0, competition: 0, timeSensitivity: 0 });
    const result = customEngine.compute(mockOpportunities.luxuryApartment);
    
    // With 100% weight on revenuePotential, the totalScore should equal the revenuePotential factor
    expect(result.totalScore).toBe(90);
  });

  it('should cap out-of-bound values to 0 and 100 (Boundary test)', () => {
    const engine = new ScoringEngine();
    const result = engine.compute({
      revenuePotential: 150, // Should be capped at 100
      urgency: -50,          // Should be capped at 0
      probability: 100,
      relationship: 100,
      competition: 100,
      timeSensitivity: 100,
    });

    // Capped values: RP(100), U(0), P(100), Rel(100), C(100), TS(100)
    // 100*0.25 + 0*0.20 + 100*0.20 + 100*0.15 + 100*0.10 + 100*0.10 = 25 + 0 + 20 + 15 + 10 + 10 = 80
    expect(result.breakdown.revenuePotential).toBe(100);
    expect(result.breakdown.urgency).toBe(0);
    expect(result.totalScore).toBeCloseTo(80);
  });
});
