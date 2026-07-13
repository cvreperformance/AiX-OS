# Property Import Pipeline

## Purpose
Establishes the first tangible data ingestion channel into AiX OS. It allows parsing, validating, normalizing, and inserting property listings from a local `JSON` file into the internal domain state.

## Architecture
- **No Dependencies**: Everything operates locally using memory-based duplication sets and the filesystem.
- **Normalization**: Currencies (`euro`, `€`, `LEI`) are forced into `EUR`/`RON`. String prices (`150,000`) are parsed into integers.
- **Deterministic IDs**: If an ID is missing, one is generated deterministically by hashing the Title + Price, preventing duplication across multiple imports of the same legacy file.

## Integration Flow
This module operates at the top of the chain. 
`Import Service` → normalizes to `Property[]` → passes to `Radar Analyzer (Rule Engine)` → maps to `Opportunity[]` → feeds into `Morning Brief Engine`.

By connecting these, we demonstrate the architectural intent: modular, decoupled engines communicating via standardized interfaces.
