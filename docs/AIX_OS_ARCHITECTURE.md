# AiX OS Architecture & Engineering Guidelines

This document serves as the single source of truth for the architectural foundation, engineering standards, and long-term vision of AiX OS. It is strictly an internal engineering resource designed to guide all future development.

---

## 1. Product Vision

AiX OS is a modern, unified operating system designed to replace fragmented B2B SaaS toolchains. By consolidating CRM, project management, knowledge management, and communications into a single platform, AiX OS eliminates data silos. The ultimate objective is to provide a comprehensive, AI-enhanced environment where every business operation is seamlessly integrated, measurable, and optimized.

## 2. Core Principles

- **Modularity:** System components must be highly cohesive and loosely coupled. Modules (CRM, Projects, Documents) should operate independently but share common data primitives.
- **Performance:** Sub-100ms response times for critical interactions. Leverage React Server Components (RSC) and edge caching to minimize client-side overhead.
- **Security & Privacy:** Implicit trust is non-existent. All data access must pass through robust authorization checks and Row Level Security (RLS).
- **Predictability:** Consistent UX, standardized APIs, and strict typing guarantee that the system behaves expectedly under load and scale.

## 3. Revenue First Philosophy

AiX OS is fundamentally designed around a "Revenue First" philosophy. This means:
- **Metric Priority:** Dashboards and reporting naturally surface KPIs directly tied to cash flow, lead conversion, pipeline value, and retention.
- **Feature Justification:** Every new feature or architectural change must map to a tangible business outcome (e.g., accelerating deal velocity, reducing churn, automating low-value tasks).
- **AI Orientation:** AI capabilities are prioritized based on their ability to generate revenue (e.g., automated lead qualification, intelligent follow-up suggestions) rather than novelty.

## 4. Domain Modules

The OS is segmented into isolated but interoperable domain modules:
- **Dashboard:** Unified command center aggregating high-level metrics.
- **CRM (Customer Relationship Management):** Leads, Clients, Companies, Pipeline, and Activities tracking.
- **Projects:** Work breakdown structures, deliverables, and resource allocation.
- **Knowledge & Memory:** Centralized repository for internal documentation, standard operating procedures, and long-term vector-based AI memory.
- **Documents:** Contract generation, proposal tracking, and file management.
- **Tasks & Calendar:** Actionable item tracking and scheduling.
- **AI Command Center:** Direct interface for managing and monitoring autonomous agent behaviors.

## 5. Data Flow

1. **Client Layer:** Next.js React components rendering state. Uses optimisic UI updates for fluid UX.
2. **Transport Layer:** Next.js Server Actions handle mutations; React Server Components handle data fetching. REST APIs are reserved strictly for external webhooks/integrations.
3. **Service Layer:** Business logic orchestration. Validates inputs, applies business rules, and manages transactions.
4. **Data Access Layer:** Typed Supabase client (PostgreSQL) executing queries.
5. **Realtime:** Supabase Realtime channels push state mutations (e.g., pipeline updates, chat) directly to subscribed clients.

## 6. AI Layer

The AI architecture consists of three pillars:
- **Semantic Search (RAG):** Leveraging Supabase pgvector to index documents, CRM notes, and project data.
- **Inference Engine:** Integration with LLMs (e.g., OpenAI, Anthropic) via a unified abstraction layer. All prompts are version-controlled.
- **Contextual Awareness:** Every user action provides context to the AI layer, ensuring that suggestions are highly relevant to the specific module (e.g., drafting an email within the CRM context vs. summarizing a document).

## 7. Business Layer

- **Separation of Concerns:** Business logic strictly resides in the `/services` or `/lib/domain` directories, NEVER inside UI components or Next.js route handlers.
- **Stateless Operations:** Services should be stateless, receiving necessary dependencies (like database clients) via arguments or context to ensure testability.
- **Validation:** All incoming data must be validated at the boundary using a schema validator (e.g., Zod) before reaching business logic.

## 8. Infrastructure Layer

- **Hosting & Compute:** Vercel (Edge Functions for lightweight tasks, Serverless for heavy compute).
- **Database & Auth:** Supabase (PostgreSQL, GoTrue for Auth, Storage for assets).
- **Styling:** Tailwind CSS integrated with custom design tokens for a dark-mode-first, premium glassmorphic UI.
- **Observability:** Centralized logging and error tracking (e.g., Sentry, Datadog) monitoring latency, error rates, and AI token consumption.

## 9. Future AI Agents

AiX OS will evolve to support autonomous agents acting on behalf of the user:
- **Lead Qualification Agent:** Automatically enriches lead data, scores intent, and drafts initial outreach.
- **Meeting Intelligence Agent:** Transcribes, summarizes, and extracts action items from calendar events.
- **Financial Forecaster:** Analyzes pipeline velocity and historical win rates to predict quarterly revenue.
- **Proposal Generator:** Assembles dynamic proposals by pulling from the Knowledge base and CRM context.

## 10. Coding Standards

- **TypeScript:** Strict mode mandated. Explicit return types on all exported functions. `any` is strictly prohibited.
- **React:** Prefer Server Components. Client components (`"use client"`) must be pushed as far down the component tree as possible.
- **Error Handling:** Use custom error classes. Server Actions must return standardized `{ success, data, error }` objects rather than throwing exceptions directly to the client.
- **Linting:** Strict ESLint and Prettier configurations enforced via pre-commit hooks.

## 11. Folder Standards

- `src/app/`: App Router definitions, page layouts, and route handlers.
- `src/components/ui/`: Reusable, dumb UI components (buttons, inputs, cards).
- `src/components/features/`: Complex, domain-specific components (e.g., `PipelineKanban`, `LeadTable`).
- `src/lib/`: Core utilities, database clients, and AI engine connectors.
- `src/services/`: Pure business logic and database orchestration.
- `src/types/`: Global TypeScript interfaces and Zod schemas.

## 12. Service Layer Rules

- **No UI Imports:** Services must never import React or DOM-related libraries.
- **Transactionality:** Multi-step database operations must be wrapped in Supabase RPCs or transaction blocks to guarantee data integrity.
- **Dependency Injection:** Pass the initialized Supabase client into service functions to facilitate unit testing without real database connections.

## 13. Database Design Principles

- **Row Level Security (RLS):** RLS policies are mandatory on every table. Access is determined by user ID, workspace ID, and role.
- **Normalization:** Prefer 3NF unless explicit read performance bottlenecks require materialization or denormalization.
- **Audit Trails:** All destructive actions (updates/deletes) on critical entities (Leads, Clients, Invoices) must be logged in a generic `audit_logs` table.
- **Soft Deletes:** Use `deleted_at` timestamps for core entities. Never hard-delete client data.

## 14. Development Workflow

- **Branching Strategy:** Trunk-based development. Feature branches (`feat/...`, `fix/...`) branch from and merge into `main`.
- **Pull Requests:** Require at least one approving review. CI checks (typecheck, lint, test) must pass before merging.
- **Migrations:** Database changes must be managed via Supabase migration files. Local development runs against a local Supabase instance.
- **Testing:** Critical business logic (Services) must have unit tests. Core user flows (e.g., authentication, lead creation) require E2E testing.

## 15. Long-term Roadmap

- **Phase 1: Foundation (Current)** - UI architecture, core layouts, and module scaffolding.
- **Phase 2: Core CRM & Data primitives** - Supabase schema implementation, Server Actions, and basic CRUD operations.
- **Phase 3: Integration & Knowledge** - Document management, RAG implementation, and foundational AI semantic search.
- **Phase 4: Agentic Automation** - Deployment of autonomous agents, predictive analytics, and advanced revenue optimization loops.
