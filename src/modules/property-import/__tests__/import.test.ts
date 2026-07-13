import { PropertyImportService } from '../services/property-import.service';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { expect, describe, it } from 'vitest';

describe('PropertyImportService', () => {
  const service = new PropertyImportService();

  it('should correctly import, validate, normalize, and detect duplicates', () => {
    const rawJson = readFileSync(resolve(__dirname, '../mock/properties.json'), 'utf-8');
    const records = service.load(rawJson);
    const result = service.import(records);

    expect(result.stats.imported).toBe(3); // 1001, 1002, Vila
    expect(result.stats.invalid).toBe(1); // Fara titlu
    expect(result.stats.duplicates).toBe(1); // Duplicate 1001

    const pipera = result.properties.find(p => p.id === '1001');
    expect(pipera?.price.amount).toBe(150000);
    expect(pipera?.price.currency).toBe('EUR');

    const vila = result.properties.find(p => p.title.includes('Vila'));
    expect(vila?.id).toBeDefined(); // Deterministic ID
    expect(vila?.price.currency).toBe('EUR'); // Normalized from €
  });
});
