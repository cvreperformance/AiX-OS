import { EventTransport } from "./types";

export class FetchTransport implements EventTransport {
  public name = "fetch";

  public async send(endpoint: string, events: any[], headers?: Record<string, string>): Promise<boolean> {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(headers || {}),
        },
        body: JSON.stringify(events),
        keepalive: true,
      });

      return response.status === 202 || response.ok;
    } catch (e) {
      return false;
    }
  }
}
export default FetchTransport;
