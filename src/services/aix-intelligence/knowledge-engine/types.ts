import { RawEvent } from "../session-pipeline/types";

export interface VisitorKnowledge {
  favorite_property_types: string[];
  favorite_locations: string[];
  price_range_min: number;
  price_range_max: number;
  intent: "purchase" | "rental" | "undetermined";
  luxury_preference: boolean;
  interest_category: "residential" | "commercial";
  search_behavior: {
    queries_count: number;
    terms: string[];
  };
  ai_usage: {
    frequency: number;
    last_interaction?: string;
  };
  preferred_language: string;
  active_hours: number[];
  returning_frequency: number;
  average_engagement: number;
  download_behavior: {
    downloads_count: number;
    files: string[];
  };
  form_behavior: {
    completions_count: number;
    abandoned_count: number;
  };
  comparison_behavior: {
    comparison_count: number;
  };
  interest_evolution: Array<{
    timestamp: string;
    inferred_intent: string;
  }>;
}

export interface KnowledgeSignals {
  last_active: string;
  interests: string[];
}

export interface KnowledgeStatistics {
  total_sessions: number;
  total_events: number;
}

export interface KnowledgeMetadata {
  sdk_version: string;
  engine_version: string;
}

export interface KnowledgeModel {
  visitor_id: string;
  application: string;
  profile_version: string;
  knowledge_version: string;
  created_at: string;
  updated_at: string;
  profile: VisitorKnowledge;
  signals: KnowledgeSignals;
  statistics: KnowledgeStatistics;
  metadata: KnowledgeMetadata;
}

export interface KnowledgeExtractor {
  extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge>;
}
