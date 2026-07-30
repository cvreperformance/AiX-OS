# Standalone AiX Intelligence SDK Package Integration Guide

This guide details how to integrate the standalone `@aix/intelligence-sdk` package inside any browser application (React, Next.js, Vue, or Vanilla JS).

---

## 1. Installation
Install the package from the internal workspace packages registry:
```json
"dependencies": {
  "@aix/intelligence-sdk": "workspace:*"
}
```

---

## 2. Initialization
Import the package entry point and trigger `initAiXIntelligence()` once during application startup:

```typescript
import { initAiXIntelligence } from "@aix/intelligence-sdk";

initAiXIntelligence({
  application: "home-find",
  apiKey: "home-find-default-api-key-key-value",
  apiUrl: "http://localhost:3000/api/aix-intelligence/v1/ingest",
  environment: "production",
  debug: true
});
```

---

## 3. Remote Configuration & Headers
Upon initialization, the SDK automatically queries the remote configuration API to retrieve active modules:
- Fetch route: `/api/aix-intelligence/v1/config`
- Telemetry batches are sent with signed metadata headers:
  - `x-aix-api-key`
  - `x-aix-timestamp`
  - `x-aix-nonce`
  - `x-aix-signature`

---

## 4. Public API Methods Reference
Once initialized, use helper methods anywhere to stream events:

- `track(eventType, metadata, payload)`: Custom tracking event.
- `trackSearch(query, resultsCount)`: Search query logs.
- `trackForm(stage, formId, details)`: Form submit or abandonment.
- `trackPropertyAction(action, propertyId)`: Save/open listings.
- `trackAiPrompt(stage, details)`: AI Advisor chat prompts.
- `trackDownload(filename)`: Guide downloads.
- `trackAuth(status, details)`: Login successes.
- `identify(visitorId)`: Link anonymous profiles to visitor IDs.
- `reset()`: Clear visitor and session cookies.
