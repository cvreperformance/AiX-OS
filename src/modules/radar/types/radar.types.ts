export interface RadarAnalysisResult {
  opportunityScore: number;
  revenuePotential: 'Low' | 'Medium' | 'High';
  riskLevel: 'Low' | 'Medium' | 'High';
  propertyType: string;
  priceRange: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}
