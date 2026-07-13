# Decision Engine v1

## Architecture
The Decision Engine is the analytical brain responsible for a single question: **"What should the user do NEXT?"**
It consumes heterogeneous data streams (Morning Briefs, raw CRM Tasks, Follow-ups, Opportunities) and normalizes them into abstract `Decision` objects.

These decisions are passed through an interchangeable `DecisionStrategy` interface (e.g., `RevenueFirstStrategy`, `BalancedStrategy`). The strategy deterministically ranks the queue based on configured math arrays.

## Decision Lifecycle
1. **Ingestion**: Internal modules pass arrays of raw data into `DecisionEngineService.build()`.
2. **Standardization**: Data is mapped into the `Decision` model.
3. **Prioritization**: `prioritize()` runs the active strategy.
4. **Explanation**: The engine appends string-based natural language explanations for *why* a decision was ranked where it was, preventing "black box" user experiences.
5. **Consumption**: Consumer frontends (like the Action Center) read the `Decision` objects, displaying the ranked output and the generated explanation logic.

## Future AI & Learning Integration
Right now, strategies (`RevenueFirst`) use static math. In future sprints:
- **Learning Strategy**: We will implement an RL (Reinforcement Learning) model that adjusts weights dynamically. If a user consistently ignores "Low Revenue / High Priority" alerts but completes "High Revenue / Low Priority" ones, the matrix self-corrects.
- **LLM Reasoning**: The `explain()` method currently uses templated concatenation. Eventually, an LLM will be fed the Decision properties to generate highly personalized, context-aware reasoning strings.
