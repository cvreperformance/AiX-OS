export interface EventTransport {
  name: string;
  send(endpoint: string, events: any[], headers?: Record<string, string>): Promise<boolean>;
}
