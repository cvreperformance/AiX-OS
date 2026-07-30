import { EventTransport } from "./types";
import { FetchTransport } from "./fetch-transport";
import { BeaconTransport } from "./beacon-transport";

export class TransportManager {
  private transports: EventTransport[] = [];

  constructor(customTransports?: EventTransport[]) {
    if (customTransports && customTransports.length > 0) {
      this.transports = customTransports;
    } else {
      this.transports = [new BeaconTransport(), new FetchTransport()];
    }
  }

  public async send(endpoint: string, events: any[], headers?: Record<string, string>): Promise<boolean> {
    for (const transport of this.transports) {
      try {
        const success = await transport.send(endpoint, events, headers);
        if (success) return true;
      } catch (e) {}
    }
    return false;
  }
}
export default TransportManager;
