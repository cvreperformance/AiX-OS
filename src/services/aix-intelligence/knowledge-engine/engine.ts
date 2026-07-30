import { supabaseAdmin } from "@/lib/supabase/admin";
import { aix } from "@aix/intelligence-sdk";
import { RawEvent } from "../session-pipeline/types";
import { VisitorKnowledge, KnowledgeSignals, KnowledgeStatistics, KnowledgeMetadata, KnowledgeModel, KnowledgeExtractor } from "./types";
import { SearchExtractor } from "./extractors/search-extractor";
import { PropertyExtractor } from "./extractors/property-extractor";
import { AiExtractor } from "./extractors/ai-extractor";
import { NavigationExtractor } from "./extractors/navigation-extractor";
import { FormExtractor } from "./extractors/form-extractor";
import { DownloadExtractor } from "./extractors/download-extractor";
import { BehaviorExtractor } from "./extractors/behavior-extractor";

import { identityResolutionEngine } from "../cross-app/identity-engine";
import { JourneyBuilder } from "../cross-app/journey-builder";
import { JourneyAnalytics } from "../cross-app/journey-analytics";
import { SegmentationEngine } from "../cross-app/segmentation";
import { OpportunityDetectionEngine } from "../cross-app/opportunities";

import { PredictionEngine } from "../predictive/prediction-engine";
import { LearningEngine } from "../learning-engine";
import { DecisionEngine } from "../decision-engine";

const PROFILE_VERSION = "1.0.0";
const KNOWLEDGE_VERSION = "1.0.0";

export class KnowledgeEngine {
  private extractors: KnowledgeExtractor[] = [
    new SearchExtractor(),
    new PropertyExtractor(),
    new AiExtractor(),
    new NavigationExtractor(),
    new FormExtractor(),
    new DownloadExtractor(),
    new BehaviorExtractor(),
  ];

  /**
   * Rebuilds a visitor's knowledge profile by aggregating all historical events.
   */
  public async rebuildProfile(visitorId: string): Promise<KnowledgeModel | null> {
    try {
      aix.track("knowledge_rebuild_started", {}, { visitor_id: visitorId });
      // 1. Fetch all historical events for the visitor ordered chronologically
      const { data: eventsData, error: eventsError } = await supabaseAdmin
        .from("aix_events")
        .select("*")
        .eq("visitor_id", visitorId)
        .order("timestamp", { ascending: true });

      if (eventsError || !eventsData || eventsData.length === 0) {
        return null;
      }

      const events: RawEvent[] = eventsData.map((d: any) => ({
        id: d.id,
        application: d.application,
        sdk_version: d.sdk_version,
        event_version: d.event_version,
        timestamp: d.timestamp,
        session_id: d.session_id,
        visitor_id: d.visitor_id,
        event_type: d.event_type,
        page: d.page,
        referrer: d.referrer,
        device: d.device,
        browser: d.browser,
        country: d.country,
        campaign: d.campaign,
        metadata: d.metadata,
        payload: d.payload,
      }));

      const application = events[0].application || "aix-os";

      // 2. Fetch existing profile to merge or start empty
      const { data: existingData } = await supabaseAdmin
        .from("aix_visitor_knowledge")
        .select("*")
        .eq("visitor_id", visitorId)
        .single();

      let profile: VisitorKnowledge & { predictions?: any; prediction_history?: any[] } = {
        favorite_property_types: [],
        favorite_locations: [],
        price_range_min: 0,
        price_range_max: 0,
        intent: "undetermined",
        luxury_preference: false,
        interest_category: "residential",
        search_behavior: { queries_count: 0, terms: [] },
        ai_usage: { frequency: 0 },
        preferred_language: "ro",
        active_hours: [],
        returning_frequency: 1,
        average_engagement: 0,
        download_behavior: { downloads_count: 0, files: [] },
        form_behavior: { completions_count: 0, abandoned_count: 0 },
        comparison_behavior: { comparison_count: 0 },
        interest_evolution: [],
      };

      if (existingData && existingData.profile) {
        profile = { ...profile, ...existingData.profile };
      }

      // 3. Sequentially run all modular extractors
      this.extractors.forEach((extractor) => {
        try {
          const updates = extractor.extract(events, profile);
          profile = { ...profile, ...updates };
        } catch (err) {
          console.warn("[AiX Knowledge Engine] Extractor failed", err);
        }
      });

      // 4. Run Identity Resolution Engine to resolve fingerprint links
      let identityLinks: any[] = [];
      try {
        identityLinks = await identityResolutionEngine.resolveIdentity(visitorId, { profile, signals: {}, statistics: {} });
      } catch (e) {}

      // 5. Reconstruct Chronological Cross-Application Journey Timeline
      let journeyTimeline: any[] = [];
      let journeyMetrics: any = {};
      try {
        const candidateIds = identityLinks.map((l: any) => l.linked_visitor_id);
        journeyTimeline = await JourneyBuilder.buildJourney(visitorId, candidateIds);
        journeyMetrics = JourneyAnalytics.calculate(journeyTimeline);
      } catch (e) {}

      // 6. Compute Visitor Segment Classifications & Conversion Opportunities
      let segments: any[] = [];
      let opportunities: any[] = [];
      try {
        segments = SegmentationEngine.classify(journeyTimeline);
        opportunities = OpportunityDetectionEngine.detect(visitorId, journeyTimeline);
      } catch (e) {}

      // 7. Calculate Predictive Intelligence (Milestone 10)
      let prevPredictions = existingData?.profile?.predictions || null;
      let predictionHistory = existingData?.profile?.prediction_history || [];
      try {
        const predResult = PredictionEngine.compute(visitorId, journeyTimeline, prevPredictions);
        profile.predictions = predResult.snapshot;
        if (predResult.historyEntry) {
          predictionHistory.push(predResult.historyEntry);
          profile.prediction_history = predictionHistory.slice(-20); // Cap history log length
        }
      } catch (e) {}

      // 7.5 Run Learning Engine (Milestone 17)
      try {
        const learningData = LearningEngine.learn(visitorId, journeyTimeline, profile);
        (profile as any).learning = learningData;

        // Enhance recommendations with learning patterns
        if (profile.predictions && profile.predictions.recommendations) {
          profile.predictions.recommendations = LearningEngine.enhanceRecommendations(
            profile.predictions.recommendations,
            learningData
          );
        }
        aix.track("learning_engine_updated", {}, { visitor_id: visitorId });
      } catch (e) {
        console.warn("[AiX Knowledge Engine] Learning engine failed:", e);
      }

      // 7.7 Run Decision Engine (Milestone 18)
      try {
        const decisionData = DecisionEngine.evaluate(visitorId, journeyTimeline, profile);
        (profile as any).decisions = decisionData;
        aix.track("decision_generated", {}, { visitor_id: visitorId, score: decisionData?.opportunityRank || 0 });
      } catch (e) {
        console.warn("[AiX Knowledge Engine] Decision engine failed:", e);
      }

      // 7. Compile Signals
      const interestsSet = new Set<string>();
      if (profile.intent !== "undetermined") interestsSet.add(profile.intent);
      if (profile.interest_category) interestsSet.add(profile.interest_category);
      if (profile.luxury_preference) interestsSet.add("luxury_buyer");
      profile.favorite_property_types.forEach(t => interestsSet.add(t));
      profile.favorite_locations.forEach(l => interestsSet.add(l));

      const signals: any = {
        last_active: events[events.length - 1].timestamp,
        interests: Array.from(interestsSet),
        identity_links: identityLinks,
        segments: segments,
        opportunities: opportunities,
      };

      // 8. Compile Statistics
      const sessionIds = new Set(events.map(e => e.session_id));
      const statistics: any = {
        total_sessions: sessionIds.size,
        total_events: events.length,
        journey_analytics: journeyMetrics,
      };

      // 9. Compile Metadata
      const metadata: any = {
        sdk_version: "2.0.0",
        engine_version: KNOWLEDGE_VERSION,
        journey_timeline: journeyTimeline, // Expose full journey structured JSON (Rule request #8)
      };

      // 10. Upsert profile into database
      const timestampIso = new Date().toISOString();
      const payload: Partial<KnowledgeModel> = {
        visitor_id: visitorId,
        application,
        profile_version: PROFILE_VERSION,
        knowledge_version: KNOWLEDGE_VERSION,
        updated_at: timestampIso,
        profile,
        signals,
        statistics,
        metadata,
      };

      if (!existingData) {
        payload.created_at = timestampIso;
      }

      const { error: upsertError } = await supabaseAdmin
        .from("aix_visitor_knowledge")
        .upsert(payload);

      if (upsertError) {
        console.error("[AiX Knowledge Engine] Upsert failed:", upsertError);
        return null;
      }

      aix.track("knowledge_rebuild_completed", {}, { visitor_id: visitorId });

      return payload as KnowledgeModel;
    } catch (e) {
      console.error("[AiX Knowledge Engine] Rebuild error:", e);
      return null;
    }
  }

  /**
   * Retrieves a compiled knowledge profile from database.
   */
  public async getProfile(visitorId: string): Promise<KnowledgeModel | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("aix_visitor_knowledge")
        .select("*")
        .eq("visitor_id", visitorId)
        .single();

      if (error || !data) return null;
      return data as KnowledgeModel;
    } catch (e) {
      return null;
    }
  }
}

export const knowledgeEngine = new KnowledgeEngine();
export default knowledgeEngine;
