export type ConnectorStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ConnectorConfig {
  id: string;
  name: string;
  type: string;
  options?: Record<string, any>;
}
