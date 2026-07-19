// src/lib/types/developer.ts

export interface Developer {
  id: string;
  name: string;
  cui?: string;
  address?: string;
  mergedFrom?: string[]; // IDs of duplicate entries merged
  projectsCount?: number;
}
