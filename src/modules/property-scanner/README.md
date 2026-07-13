# Property Scanner Engine

## Purpose
The Property Scanner Engine is a provider-agnostic system designed to ingest, normalize, and analyze real estate properties from disparate sources (portals, agency feeds, CSV imports, API integrations, and manual entries). It acts as the universal ingestion layer, ensuring that regardless of origin, all property data conforms to a unified standard for subsequent AI and business analysis.

## Flow
1. **Ingestion:** Data is acquired through registered Providers.
2. **Normalization:** Provider-specific data is translated into the universal `Property` domain model.
3. **Validation:** Ensure critical data points (price, location) are present.
4. **Deduplication:** The engine identifies if the same property exists across multiple sources.
5. **Analysis Pipeline:** The property undergoes multi-stage analysis (Market Comparison, Risk, Yield).
6. **Opportunity Detection:** High-value triggers (e.g., underpriced, high yield) are extracted.
7. **Routing:** Processed properties are pushed to the relevant OS modules (e.g., CRM or Opportunity Engine).

## Provider Architecture
To guarantee isolation, the engine does not know the specific origin of any data. Instead, it relies on the `IPropertyProvider` interface. Any new data source (e.g., a new real estate API or a manual CSV uploader) must implement `fetch`, `normalize`, and `validate`. The core engine only interacts with data that has successfully passed through a provider's normalization layer.

## Future Integrations
- **AI Opportunity Generation:** Passing normalized properties to LLMs to generate narrative analysis.
- **Automated Alerts:** Triggering push notifications to the Dashboard when a high-score property is detected.
- **CRM Linking:** Automatically mapping "Owner" details from listings to the CRM leads database to detect private sellers.
