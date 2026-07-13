export interface PropertyLocation {
  address: string;
  city: string;
  region?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyPrice {
  amount: number;
  currency: string;
  pricePerSqm?: number;
  isNegotiable?: boolean;
}

export interface PropertyFeatures {
  type: string;
  surfaceArea: number;
  builtArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  amenities: string[];
}

export interface PropertyOwner {
  id?: string;
  type: 'Agency' | 'Private' | 'Developer';
  name: string;
  contact?: {
    email?: string;
    phone?: string;
  };
}

export interface PropertyAnalysis {
  marketComparisonScore?: number;
  riskScore?: number;
  estimatedYield?: number;
  isDuplicate: boolean;
  duplicateConfidence?: number;
  flags: string[];
}

export interface PropertyOpportunity {
  type: string;
  description: string;
  confidenceScore: number;
  potentialValue?: number;
}

export interface Property {
  id: string;
  sourceId: string;
  providerName: string;
  title: string;
  description: string;
  url?: string;
  location: PropertyLocation;
  price: PropertyPrice;
  features: PropertyFeatures;
  owner?: PropertyOwner;
  analysis?: PropertyAnalysis;
  opportunities?: PropertyOpportunity[];
  status: 'Raw' | 'Normalized' | 'Analyzed' | 'Archived';
  scannedAt: Date;
}
