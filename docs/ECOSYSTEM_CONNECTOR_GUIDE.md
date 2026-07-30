# Ecosystem Connector Framework Integration Guide

This guide details how any current or future application securely registers and streams telemetry data to the AiX OS Intelligence Server in under 10 minutes.

---

## 1. Application Registration
Applications are registered dynamically inside the Connector Registry:
- Location: `src/services/aix-intelligence/connector/registry.json`
- Each registry node declares:
  - `application_id`: Unique identifier (e.g. `home-find`, `insurance`, ` luxury-investments`).
  - `display_name`: Human-readable label.
  - `api_key`: Dynamically rotated signed channel credentials.
  - `status`: Enable or disable the connector instantly.

---

## 2. SDK Initialization
Include the universal tracking SDK and configure the bootstrap options with the assigned credentials:

```typescript
import { aix } from "@/lib/aix-sdk";

aix.init({
  application: "home-find",
  apiKey: "home-find-default-api-key-key-value",
  apiUrl: "http://localhost:3000/api/aix-intelligence/v1/ingest",
});
```

---

## 3. Cryptographic Signed Channel Verification
For secure server-to-server channels, clients can sign telemetry batches with HMAC-SHA256:
- The server validates headers:
  - `x-aix-api-key`: API key registered in `registry.json`
  - `x-aix-timestamp`: ISO 8601 string. Verified within a 5-minute server window to prevent replay.
  - `x-aix-nonce`: Random UUID to enforce nonce-deduplication.
  - `x-aix-signature`: `HMAC-SHA256(apiKey, timestamp + nonce + application)`

---

## 4. Troubleshooting & Monitoring
- **Check Health Status**: Visit `/admin/intelligence` to check the Ecosystem Connector table. Shows average latency, failed requests, heartbeat timers, and event quotas.
- **Rotate Credentials**: Click **Rotate Key** inside the Connectors table to invalidate old keys instantly.
