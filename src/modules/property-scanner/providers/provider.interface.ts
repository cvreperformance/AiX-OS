import { Property } from '../types/property.types';

export interface IPropertyProvider {
  /**
   * Fetches raw property data from the specific source.
   */
  fetch(): Promise<any[]>;

  /**
   * Transforms provider-specific raw data into the standardized Property model.
   */
  normalize(rawData: any): Property;

  /**
   * Validates whether the fetched data meets minimum structural requirements.
   */
  validate(rawData: any): boolean;
}
