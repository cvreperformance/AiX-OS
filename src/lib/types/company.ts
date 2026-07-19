// src/lib/types/company.ts

export interface Company {
  id: string;
  cui: string; // Unique company identifier
  name: string;
  industry?: string;
  caen?: string;
  status?: string;
  location?: string;
  website?: string;
  estimated_size?: string;
  last_updated?: string; // ISO timestamp
}
