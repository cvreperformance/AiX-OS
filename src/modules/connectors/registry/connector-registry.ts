import { IConnector } from '../interfaces/connector.interface';

export class ConnectorRegistry {
  private connectors: Map<string, IConnector>;

  constructor() {
    this.connectors = new Map();
  }

  /**
   * Registers a new connector instance.
   */
  public register(connector: IConnector): void {
    if (this.connectors.has(connector.config.id)) {
      throw new Error(`Connector with ID ${connector.config.id} is already registered.`);
    }
    this.connectors.set(connector.config.id, connector);
  }

  /**
   * Unregisters an existing connector by its ID.
   */
  public unregister(connectorId: string): void {
    this.connectors.delete(connectorId);
  }

  /**
   * Retrieves a connector by its ID.
   */
  public get(connectorId: string): IConnector | undefined {
    return this.connectors.get(connectorId);
  }

  /**
   * Returns an array of all currently registered connectors.
   */
  public getAll(): IConnector[] {
    return Array.from(this.connectors.values());
  }
}
