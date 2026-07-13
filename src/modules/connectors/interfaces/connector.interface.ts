import { ConnectorConfig, ConnectorStatus } from '../types/connector.types';

export interface IConnector<TRaw = any, TNormalized = any> {
  /**
   * Configuration metadata for the connector.
   */
  readonly config: ConnectorConfig;

  /**
   * Current connection status.
   */
  readonly status: ConnectorStatus;

  /**
   * Establishes a connection to the data source (if applicable).
   */
  connect(): Promise<void>;

  /**
   * Fetches raw data from the data source.
   */
  fetch(options?: any): Promise<TRaw[]>;

  /**
   * Normalizes the raw data into the system's standard domain model.
   */
  normalize(rawData: TRaw): TNormalized;

  /**
   * Validates whether the fetched data meets internal schema requirements.
   */
  validate(rawData: TRaw): boolean;

  /**
   * Safely terminates the connection to the data source.
   */
  disconnect(): Promise<void>;
}
