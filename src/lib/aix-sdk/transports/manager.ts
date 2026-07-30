import { EventTransport } from "./types";
import { FetchTransport } from "./fetch-transport";
import { BeaconTransport } from "./beacon-transport";

export class TransportManager {
  private transports: EventTransport[] = [];

  constructor(customTransports?: EventTransport[]) {
    if (customTransports && customTransports.length > 0) {
      this.transports = customTransports;
    } else {
      // Defaults to Beacon first (good for unload), then Fetch
      this.transports = [new BeaconTransport(), new FetchTransport()];
    }
  }

  /**
   * Delegates the payload array to the first active event transport.
   */
  public async send(endpoint: string, events: any[], headers?: Record<string, string>): Promise<boolean> {
    for (const transport of this.transports) {
      try {
        const success = await transport.send(endpoint, events, headers);
        if (success) return true;
      } catch (e) {
        // Fallback to next transport
      }
    }
    return false;
  }
}
export default TransportManager;
