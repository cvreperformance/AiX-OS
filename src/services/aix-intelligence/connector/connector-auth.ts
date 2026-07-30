import { ApplicationRegistry } from "./application-registry";
import crypto from "crypto";

export class ConnectorAuth {
  private static nonces = new Set<string>();
  private static maxNoncesCache = 1000;
  private static timestampWindowMs = 5 * 60 * 1000; // 5 minutes validity

  /**
   * Validates ecosystem API signature headers.
   * Format: signature = HMAC-SHA256(apiKey, timestamp + nonce + application)
   */
  public static validateRequest(
    application: string,
    apiKey: string,
    timestamp: string,
    nonce: string,
    signature: string
  ): { valid: boolean; error?: string } {
    try {
      // 1. Check dynamic registry credentials
      const appContract = ApplicationRegistry.getApp(application);
      if (!appContract) {
        return { valid: false, error: "Application is not registered" };
      }
      if (appContract.status === "disabled") {
        return { valid: false, error: "Application connector is disabled" };
      }
      if (appContract.api_key !== apiKey) {
        return { valid: false, error: "Invalid API key" };
      }

      // 2. Replay & Timestamp check
      const requestTime = new Date(timestamp).getTime();
      const now = Date.now();
      if (isNaN(requestTime) || Math.abs(now - requestTime) > this.timestampWindowMs) {
        return { valid: false, error: "Request timestamp is outside validity window" };
      }

      // 3. Nonce deduplication
      if (this.nonces.has(nonce)) {
        return { valid: false, error: "Duplicate nonce detected (replay attempt)" };
      }
      if (this.nonces.size >= this.maxNoncesCache) {
        this.nonces.clear(); // Evict nonces safely
      }
      this.nonces.add(nonce);

      // 4. Verify Signature matching (Optional validation for signed channels)
      if (signature) {
        const expectedSignature = crypto
          .createHmac("sha256", apiKey)
          .update(timestamp + nonce + application)
          .digest("hex");

        if (expectedSignature !== signature) {
          return { valid: false, error: "Invalid request signature" };
        }
      }

      return { valid: true };
    } catch (e) {
      return { valid: false, error: "Internal authentication verification error" };
    }
  }
}
export default ConnectorAuth;
