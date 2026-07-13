# Opportunity Engine v1

## Purpose
The Opportunity Engine acts as the central analytical layer within AiX OS for evaluating, scoring, and ranking potential business opportunities. It provides a standardized framework to process disparate leads, deals, and cross-sell signals into prioritized, actionable recommendations.

## Architecture
The module follows a clean architecture pattern with strict separation of concerns, devoid of external UI or database coupling in its core representation:
- **Types:** Domain models representing Opportunities, Sources, Categories, and Recommendations.
- **Services:** Pure business logic orchestration (`OpportunityService`), exposing lifecycle methods like analyze, score, rank, and recommend.
- **Utils:** Isolated, computational components like the `ScoringEngine` which processes configurable weights without side effects.
- **Components:** (Reserved) UI elements specific to visualizing opportunity data.
- **Constants:** Static configuration such as default algorithmic weights.

## Flow
1. **Data Ingestion:** System feeds an `Opportunity` object into the engine.
2. **Context Analysis:** The `analyze()` method prepares and enriches the raw data.
3. **Scoring:** `calculateScore()` routes parameters through the `ScoringEngine` using configured weights.
4. **Ranking:** The engine orders multiple opportunities via `rank()`.
5. **Recommendation:** `recommend()` generates specific actions based on the opportunity's attributes and score.

## Scoring Formula & Normalization
The engine calculates a deterministic score from 0 to 100 based on the following configured factors:
- `Revenue Potential`
- `Urgency`
- `Probability`
- `Relationship Strength`
- `Competition Level`
- `Time Sensitivity`

**Normalization:** All incoming factor values are strictly capped between `0` and `100` before calculation to prevent algorithmic skewing (e.g., a massive revenue figure artificially overriding probability).
**Formula:** `Total Score = Σ (Factor_n × Weight_n) / Σ(Weights)`

## Extension Strategy
- **Weight Configuration:** The core algorithm accepts runtime overrides to default weights, allowing user-specific or industry-specific tuning without touching business logic.
- **Factor Expansion:** The typed configuration allows easily slotting in new attributes (e.g., "Strategic Value").

## Future Integrations
- **Future ML Replacement:** Currently, scoring is 100% deterministic using linear weighted averages. Future iterations will replace this formulaic engine with a machine-learning-based classification model trained on historical closed-won datasets.
- **AI/LLM Pipelines:** Integrating semantic search and language models to dynamically generate the `rationale` and `summary` for recommendations.
- **CRM Module:** Automatic scoring of leads as they enter the CRM Pipeline.
- **Supabase Connectivity:** Connecting the service layer to Supabase via data access layers for persistence.
