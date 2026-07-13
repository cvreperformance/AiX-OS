import { ContactTarget, SuggestedService } from '../types/intelligence.types';

export const IntelligenceRules = {
  mappings: {
    'Developer': {
      target: 'Sales Director' as ContactTarget,
      service: 'Marketing Partnership' as SuggestedService,
      commissionRate: 0.03, // 3% of estimated revenue
      baseProbability: 30
    },
    'Office': {
      target: 'Facility Manager' as ContactTarget,
      service: 'Insurance' as SuggestedService,
      commissionRate: 0.15, // 15% of premium (estimated revenue)
      baseProbability: 40
    },
    'Luxury': {
      target: 'Owner' as ContactTarget,
      service: 'Luxury Assets' as SuggestedService,
      commissionRate: 0.05,
      baseProbability: 25
    },
    'Investment': {
      target: 'Investor' as ContactTarget,
      service: 'Investment' as SuggestedService,
      commissionRate: 0.02,
      baseProbability: 20
    },
    'Commercial': {
      target: 'CEO' as ContactTarget,
      service: 'Property Sale' as SuggestedService,
      commissionRate: 0.04,
      baseProbability: 35
    },
    'Owner': {
      target: 'Owner' as ContactTarget,
      service: 'Property Sale' as SuggestedService,
      commissionRate: 0.03,
      baseProbability: 50
    }
  },
  urgencyMultipliers: {
    'Today': 3,
    'This Week': 2,
    'Monitor': 1
  }
};
