# Connector Architecture

## Purpose
The Connector module provides a universally standardized framework for ingesting data into AiX OS. Whether data arrives via manual entry, a CSV upload, a third-party API, an RSS feed, an email parser, or a webhook, it must pass through this uniform abstraction layer.

## Architecture
The system relies on an inversion of control (IoC) pattern:
- **`IConnector` Interface**: Defines the strict, mandatory contract (`connect`, `fetch`, `normalize`, `validate`, `disconnect`) that any internal or external data source must fulfill.
- **`ConnectorRegistry`**: A centralized singleton registry where active connectors are instantiated and tracked at runtime.
- **Decoupling**: Internal engines (such as the Opportunity Engine) depend *only* on the generic `IConnector` interface and its normalized outputs. They contain zero provider-specific logic.

## Flow
1. A new data source adapter (e.g., `CSVConnector`) is built, implementing `IConnector`.
2. The instance is registered with the `ConnectorRegistry`.
3. An internal engine queries the registry for relevant connectors.
4. The engine invokes `.connect()`, then `.fetch()`.
5. The fetched data is instantly passed through `.validate()` and `.normalize()` before the core engine executes its business logic.
6. The engine safely terminates the session via `.disconnect()`.

## Extension Strategy
By isolating integration logic into discrete connectors, the OS can scale data sources dynamically without refactoring core services. Future implementations include:
- **`ManualConnector`**: Ingesting leads inputted by users via CRM forms.
- **`CSVConnector`**: Processing batch legacy database dumps.
- **`APIConnector`**: Real-time synchronization with third-party tools.
- **`WebhookConnector`**: Instantly reacting to external HTTP payloads.
- **`EmailConnector`**: Parsing raw email bodies to extract lead context.
- **`RSSConnector`**: Monitoring market news or property portal feeds.
