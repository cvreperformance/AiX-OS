// src/lib/dataHub/IDataProvider.ts

export interface IDataProvider<T> {
  /**
   * Fetches data from the provider.
   * @returns Promise resolving to an array of items of type T.
   */
  fetchAll(): Promise<T[]>;

  /**
   * Optionally fetch a single item by its identifier.
   */
  fetchById?(id: string): Promise<T | null>;
}
