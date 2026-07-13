import { Property } from '../../property-scanner/types/property.types';
import { RawJSONProperty, ImportResult, ImportStats } from '../types/import.types';

export class PropertyImportService {
  private memoryDB: Set<string> = new Set(); // Tracks duplicates within a session

  public load(jsonString: string): any[] {
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  }

  public validate(record: any): record is RawJSONProperty {
    if (!record || typeof record !== 'object') return false;
    // Strictly require a title and a price to be valid
    if (!record.title || !record.price) return false;
    return true;
  }

  public normalize(raw: RawJSONProperty): Property {
    // Generate deterministic ID if missing (using title + price hash)
    const backupId = `local-${Buffer.from(`${raw.title}-${raw.price}`).toString('base64').substring(0, 10)}`;
    const id = raw.id || backupId;
    
    // Normalize currency
    let currency = (raw.currency || 'EUR').toUpperCase();
    if (currency === 'EURO' || currency === '€') currency = 'EUR';
    if (currency === 'LEI') currency = 'RON';

    // Normalize price
    let amount = 0;
    if (typeof raw.price === 'string') {
      const cleaned = raw.price.replace(/[^\d\.]/g, '');
      amount = parseFloat(cleaned) || 0;
    } else if (typeof raw.price === 'number') {
      amount = raw.price;
    }

    // Normalize Location
    const addressStr = raw.address || 'Unknown Location';
    const city = addressStr.includes(',') ? addressStr.split(',')[1].trim() : addressStr;

    return {
      id,
      sourceId: id,
      providerName: 'LocalImport',
      title: raw.title || 'Untitled',
      description: raw.description || '',
      location: {
        address: addressStr,
        city: city,
        country: 'Romania'
      },
      price: {
        amount,
        currency
      },
      features: {
        type: raw.propertyType || 'Unknown',
        surfaceArea: raw.sqm || 0,
        amenities: []
      },
      status: 'Normalized',
      scannedAt: new Date()
    };
  }

  public import(rawRecords: any[]): ImportResult {
    const stats: ImportStats = { imported: 0, skipped: 0, invalid: 0, duplicates: 0 };
    const properties: Property[] = [];
    this.memoryDB.clear();

    for (const record of rawRecords) {
      if (!this.validate(record)) {
        stats.invalid++;
        continue;
      }

      const normalized = this.normalize(record);

      if (this.isDuplicate(normalized)) {
        stats.duplicates++;
        continue;
      }

      this.memoryDB.add(normalized.id);
      properties.push(normalized);
      stats.imported++;
    }

    this.logStats(stats);

    return { properties, stats };
  }

  private isDuplicate(property: Property): boolean {
    const hash = `${property.title}-${property.price.amount}`;
    if (this.memoryDB.has(property.id) || this.memoryDB.has(hash)) return true;
    this.memoryDB.add(hash);
    return false;
  }

  private logStats(stats: ImportStats): void {
    console.info(`\n[Import Statistics] Imported: ${stats.imported} | Skipped: ${stats.skipped} | Invalid: ${stats.invalid} | Duplicates: ${stats.duplicates}\n`);
  }
}
