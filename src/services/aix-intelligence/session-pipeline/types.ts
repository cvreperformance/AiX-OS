export interface RawEvent {
  id: string;
  application: string;
  sdk_version: string;
  event_version: string;
  timestamp: string;
  session_id: string;
  visitor_id: string;
  event_type: string;
  page: string;
  referrer?: string | null;
  device?: string | null;
  browser?: string | null;
  country?: string | null;
  campaign?: string | null;
  metadata?: Record<string, any> | null;
  payload?: Record<string, any> | null;
}

export interface NormalizedEvent extends RawEvent {
  normalized_page: string;
  device_category: string;
  browser_name: string;
  normalized_timestamp: number; // Unix timestamp for sorting
}

export interface ReconstructedSession {
  session_id: string;
  visitor_id: string;
  application: string;
  events: NormalizedEvent[];
}

export interface SessionMetrics {
  start_time: string;
  end_time: string;
  duration_ms: number;
  page_views: number;
  unique_pages: string[];
  entry_page: string;
  exit_page: string;
  referrer: string;
  campaign: string;
  country: string;
  browser: string;
  device: string;
  searches_count: number;
  search_terms: string[];
  filters_used: string[];
  ai_interactions_count: number;
  forms_started: string[];
  forms_submitted: string[];
  forms_abandoned: string[];
  downloads_count: number;
  outbound_links_count: number;
  properties_viewed: string[];
  errors_count: number;
  is_bounce: boolean;
}

export interface TimelineItem {
  timestamp: string;
  time_elapsed_ms: number;
  event_type: string;
  summary: string;
  metadata: Record<string, any>;
}

export interface SessionScores {
  engagement_score: number;
  completion_score: number;
}

export interface SessionModel {
  session_id: string;
  visitor_id: string;
  application: string;
  metrics: SessionMetrics;
  timeline: TimelineItem[];
  scores: SessionScores;
}
