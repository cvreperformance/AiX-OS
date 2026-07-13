# Revenue Engine Architecture

This document defines the product architecture and engineering blueprint for the AiX OS Revenue Engine. It is intended strictly for internal engineering use to guide future backend implementation and AI integration.

---

## 1. Purpose of the Revenue Engine

The Revenue Engine is the central intelligence layer of AiX OS. It shifts the platform from a passive system of record to a proactive system of action. Its primary purpose is to continuously analyze cross-module data, identify financial opportunities, prioritize sales activities, and surface actionable insights that directly drive cash flow and client acquisition.

## 2. Revenue Data Sources

The Engine aggregates structured and unstructured data from across the OS:
- **CRM:** Lead stages, expected deal values, communication history, and client profiles.
- **Insurance:** Policy expiration dates, coverage gaps, and premium values.
- **Properties:** Real estate portfolios, market valuations, yield projections, and transaction histories.
- **Tasks:** Pending actions, overdue follow-ups, and user activity metrics.
- **Calendar:** Meeting frequency, engagement density, and schedule availability.

## 3. Opportunity Scoring Model

The Engine employs a weighted scoring algorithm (0-100) to rank the viability of deals and cross-sells. The model factors include:
- **Profile Fit (30%):** Does the client match the ideal customer profile (ICP)?
- **Engagement Velocity (30%):** Frequency and recency of communications (emails, meetings).
- **Economic Value (25%):** Potential revenue vs. resource cost to acquire/service.
- **Timing/Urgency (15%):** Proximity to compelling events (e.g., policy expiry, lease ending).

## 4. Revenue Forecasting Concepts

Forecasting relies on dynamic pipeline analysis rather than static reporting:
- **Weighted Pipeline:** Deal Value × Probability of Close (based on historical conversion rates per stage).
- **Sales Velocity:** Average deal size × Win rate / Average sales cycle length.
- **Predictive Modeling:** Utilizing historical data to project "Commit," "Best Case," and "Pipeline" numbers for the current quarter.

## 5. Daily Brief Generation Flow

The Daily Brief is an AI-synthesized summary of the most critical revenue actions, delivered each morning.
1. **Data Ingestion:** Nightly automated jobs aggregate updates from CRM, Calendar, and Tasks.
2. **Contextualization:** The rules engine flags high-priority items based on the Scoring Model and Prioritization Rules.
3. **AI Synthesis:** The LLM generates a concise, human-readable summary.
4. **Delivery:** Pushed to the user's Dashboard and AI Command Center at 6:00 AM local time.

## 6. Follow-up Prioritization Rules

The Engine dictates task prioritization based on revenue impact:
1. **Tier 1 (Critical):** High-value deals in negotiation phase; high-value clients with policies expiring within 30 days.
2. **Tier 2 (High):** Qualified leads who have not been contacted in 48 hours; meeting follow-ups pending for >24 hours.
3. **Tier 3 (Medium):** Routine check-ins for active clients; long-term nurturing for unqualified leads.

## 7. Cross-sell Opportunity Detection

The system programmatically identifies missing services in a client's portfolio:
- **Trigger-based:** If a client purchases a property (Property Module), the system immediately flags a cross-sell opportunity for home insurance (Insurance Module).
- **Gap Analysis:** Periodically scanning the client database to find high-net-worth clients who utilize only one service line, prompting account managers with specific pitch angles.

## 8. KPI Definitions

The Engine tracks and optimizes for the following metrics:
- **Total Pipeline Value:** Sum of all open opportunities.
- **Weighted Expected Revenue:** Sum of (Opportunity Value × Stage Probability).
- **Lead-to-Close Velocity:** Average days required to transition a lead to a closed-won deal.
- **Cross-sell Ratio:** Average number of distinct service lines utilized per client.
- **Client Lifetime Value (CLTV):** Projected net profit attributed to the entire future relationship with a customer.

## 9. Future AI Recommendation Pipeline

The architecture for surfacing AI-driven recommendations follows a strict pipeline:
1. **Event Ingress:** System detects a state change (e.g., email received, stage updated).
2. **Context Retrieval:** RAG (Retrieval-Augmented Generation) queries the vector database for relevant client history and SOPs.
3. **Inference:** LLM evaluates the event against the context to determine the next best action.
4. **Action Presentation:** The UI surfaces the recommendation as a one-click actionable card (e.g., "Draft email," "Schedule meeting").
5. **Feedback Loop:** The system records whether the user accepted, modified, or rejected the recommendation to train future accuracy.

## 10. Events That Should Trigger Recommendations

The Engine actively listens for the following system events to generate recommendations:
- **Deal Stagnation:** An opportunity remains in the same stage for >7 days.
- **Communication Sentiment:** Incoming client email exhibits negative or urgent sentiment.
- **Contract/Policy Milestones:** 90, 60, and 30 days prior to contract renewals or policy expirations.
- **Calendar Anomalies:** A scheduled meeting with a high-value prospect is canceled or rescheduled multiple times.
- **Website Activity:** A known lead interacts heavily with high-intent pages (e.g., Pricing, specific property listings) on the public site.
