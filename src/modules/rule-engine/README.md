# Rule Engine v2

## Purpose
The Rule Engine completely replaces hardcoded script-based logic (e.g., rigid keyword searches) with a generic, robust, and heavily extensible configuration layer. Instead of writing custom TypeScript validation methods for every business need, developers can now craft dynamic rule arrays via JSON/Config schemas that define abstract conditions and universal effects.

## Architecture
- **Rules**: Fully defined configurations possessing explicit Priority, Descriptions, and active flags.
- **Conditions**: Determines execution flow via flexible typing (`regex`, `numberGreaterThan`, `missing`, etc.).
- **Effects**: Highly structured, deterministic mutations to state (`increaseScore`, `addWeakness`, `setPriority`).
- **Engine Context**: The service processes any state object deterministically based on active rules sorted tightly by `priority`.

## Flow
1. Radar module invokes the Rule Engine.
2. The Engine sorts the `radarRulesConfig` based on Priority level (e.g., Risk checks take precedence).
3. The raw string inputted by a user is processed against all regex conditions.
4. If a condition matches, the engine modifies a temporary state object, accumulating scores and pushing weakness/strength labels safely to arrays.
5. The finalized deterministic state is returned to the UI logic.
