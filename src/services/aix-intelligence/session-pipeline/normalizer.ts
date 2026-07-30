import { RawEvent, NormalizedEvent } from "./types";

export class EventNormalizer {
  public static normalize(event: RawEvent): NormalizedEvent {
    const page = event.page || "/unknown";
    const normalizedPage = page.split("?")[0].toLowerCase();

    const timestamp = event.timestamp ? new Date(event.timestamp).getTime() : Date.now();
    const isoTimestamp = new Date(timestamp).toISOString();

    const device = event.device ? event.device.toLowerCase() : "unknown";
    const browser = event.browser ? event.browser.toLowerCase() : "unknown";

    return {
      ...event,
      timestamp: isoTimestamp,
      page,
      normalized_page: normalizedPage,
      device_category: this.standardizeDevice(device),
      browser_name: this.standardizeBrowser(browser),
      normalized_timestamp: timestamp,
      referrer: event.referrer || "direct",
      campaign: event.campaign || "organic",
      country: event.country || "unknown",
      metadata: event.metadata || {},
      payload: event.payload || {},
    };
  }

  private static standardizeDevice(device: string): string {
    if (device.includes("mobile") || device.includes("phone")) return "mobile";
    if (device.includes("tablet") || device.includes("ipad")) return "tablet";
    if (device.includes("desktop") || device.includes("pc")) return "desktop";
    return device;
  }

  private static standardizeBrowser(browser: string): string {
    if (browser.includes("chrome")) return "Chrome";
    if (browser.includes("firefox")) return "Firefox";
    if (browser.includes("safari")) return "Safari";
    if (browser.includes("edge")) return "Edge";
    return browser.charAt(0).toUpperCase() + browser.slice(1);
  }
}
