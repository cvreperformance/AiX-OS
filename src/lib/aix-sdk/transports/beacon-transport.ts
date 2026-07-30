import { EventTransport } from "./types";

export class BeaconTransport implements EventTransport {
  public name = "beacon";

  public async send(endpoint: string, events: any[], headers?: Record<string, string>): Promise<boolean> {
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function" &&
        typeof Blob === "function"
      ) {
        const blob = new Blob([JSON.stringify(events)], { type: "application/json" });
        return navigator.sendBeacon(endpoint, blob);
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
