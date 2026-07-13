export interface ImportStats {
  imported: number;
  skipped: number;
  invalid: number;
  duplicates: number;
}

export interface RawJSONProperty {
  id?: string;
  title?: string;
  description?: string;
  address?: string;
  price?: number | string;
  currency?: string;
  sqm?: number;
  propertyType?: string;
}

export interface ImportResult {
  properties: any[];
  stats: ImportStats;
}
