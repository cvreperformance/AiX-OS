import { RadarAnalyzerService } from '../services/analyzer.service';
import { expect, describe, it } from 'vitest';

describe('RadarAnalyzerService', () => {
  const service = new RadarAnalyzerService();

  it('should appropriately score an urgent owner property', () => {
    const text = 'Vand apartament proprietar, urgent! Oferta in Pipera. Pret 100000 EUR';
    const result = service.analyze(text);
    
    // Base 50 + owner(15) + urgent(10) + pipera(20) = 95
    expect(result.opportunityScore).toBe(95);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.propertyType).toBe('Apartment');
    expect(result.priceRange).toContain('100000');
    expect(result.recommendation).toContain('High priority');
    expect(result.revenuePotential).toBe('High');
  });

  it('should decrease score and flag risk for agency property with litigation', () => {
    const text = 'Agentie imobiliara vinde teren, atentie cu litigiu.';
    const result = service.analyze(text);
    
    // Base 50 - agency(20) - litigation(30) = 0
    expect(result.opportunityScore).toBe(0);
    expect(result.weaknesses.length).toBe(2);
    expect(result.propertyType).toBe('Land');
    expect(result.recommendation).toContain('Low priority');
    expect(result.riskLevel).toBe('High');
  });

  it('should cap score to 100 if multiple positive terms push it over', () => {
    const text = 'Proprietar vand apartament lux nou Pipera urgent!!!';
    const result = service.analyze(text);
    
    // Base 50 + owner(15) + lux(10) + new(10) + pipera(20) + urgent(10) = 115 -> Capped to 100
    expect(result.opportunityScore).toBe(100);
  });
});
