import { Opportunity } from '../types/opportunity.types';

// Test-only fixtures — NOT used in production code
export const mockOpportunities: Record<string, any> = {
  developer: {
    revenuePotential: 100,
    urgency: 70,
    probability: 85,
    relationship: 60,
    competition: 80,
    timeSensitivity: 60,
  },
  investor: {
    revenuePotential: 85,
    urgency: 40,
    probability: 50,
    relationship: 50,
    competition: 70,
    timeSensitivity: 30,
  },
  luxuryApartment: {
    revenuePotential: 90,
    urgency: 50,
    probability: 70,
    relationship: 80,
    competition: 60,
    timeSensitivity: 50,
  },
};
