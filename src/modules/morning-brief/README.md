# Morning Brief Engine v1

## Purpose
The Morning Brief Engine serves as the proactive launchpad for daily operations within AiX OS. It autonomously ingests data from CRM, Projects, and Calendars to synthesize a unified dashboard of priorities, estimated revenues, and specific recommended actions before the user even asks.

## Flow
1. **Ingestion**: The `generate()` method receives aggregated daily arrays of Tasks, Calendar Events, Follow-ups, and Opportunities.
2. **Prioritization**: It strictly sorts opportunities by their algorithmic score, isolating the Top 5 to compute active pipeline revenue and Business Health metrics.
3. **Rule Processing**: The engine runs through deterministic `if-then` scenarios (e.g., checking if an insurance renewal is exactly 1 day away, or if an event is flagged as important).
4. **Synthesis**: It outputs a fully typed `MorningBrief` object containing a human-readable summary, action items, and numeric KPIs.

## Deterministic Rules vs AI Reasoning
Currently (v1), the engine relies entirely on **deterministic programming** (e.g., `if (task.daysOverdue > 0)`). This guarantees speed, 100% predictability, and no hallucinations. It acts as the rigid backbone of the system.

In contrast, **AI Reasoning** (to be implemented later) will parse unstructured context. For example, deterministic code flags that a proposal is 3 days overdue. Future AI reasoning will analyze the client's past email tone to suggest *exactly what to say* to de-escalate the delay.

## Future AI Replacement Strategy
The `generate()` method is designed as a clean boundary. In upcoming sprints, the generation of the `recommendations` and `summary` strings will be offloaded to an LLM. The deterministic rules will still run to fetch context, but the LLM will synthesize those facts into nuanced, natural language briefs rather than hardcoded string templates.
