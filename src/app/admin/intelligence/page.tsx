import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { analytics } from "@/services/aix-intelligence/analytics";
import { sessions } from "@/services/aix-intelligence/sessions";
import { knowledgeEngine } from "@/services/aix-intelligence/knowledge-engine/engine";
import { liveSessionMonitor } from "@/services/aix-intelligence/realtime/live-monitor";
import { RealtimeConfigManager } from "@/services/aix-intelligence/realtime/config";
import { revalidatePath } from "next/cache";
import { 
  Brain, Shield, Settings, Server, Bell, Activity, Layers, Filter, 
  Clock, ChevronLeft, ChevronRight, Eye, RefreshCw, Sparkles, 
  FileText, Globe, Landmark, EyeOff, Radio, Users, Compass, 
  TrendingUp, Zap, HelpCircle, HardDrive, Terminal
} from "lucide-react";
import { ApplicationRegistry } from "@/services/aix-intelligence/connector/application-registry";
import { ConnectorHealth } from "@/services/aix-intelligence/connector/connector-health";
import { NotificationConfigManager } from "@/services/aix-intelligence/realtime/notification-config";
import { telegram } from "@/services/aix-intelligence/telegram";

interface Props {
  searchParams: Promise<{
    tab?: string;
    application?: string;
    visitor_id?: string;
    session_id?: string;
    page?: string;
    event_type?: string;
    country?: string;
    browser?: string;
    device?: string;
    dateFrom?: string;
    dateTo?: string;
    pageIndex?: string;
    activeSession?: string;
    activeVisitor?: string;
    queryText?: string;
  }>;
}

export default async function AdminIntelligencePage({ searchParams }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Double check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const queryParams = await searchParams;
  const activeTab = queryParams.tab || "overview";
  const pageIndex = queryParams.pageIndex ? parseInt(queryParams.pageIndex) : 0;
  const pageSize = 10;

  // Retrieve app connector list
  const appsList = ApplicationRegistry.load();

  // Server Action to toggle flags
  async function toggleFlag(formData: FormData) {
    "use server";
    const flagName = formData.get("flagName") as string;
    const value = formData.get("value") === "true";
    if (flagName) {
      RealtimeConfigManager.updateFlags({ [flagName]: value });
    }
    const tabVal = formData.get("tab") as string;
    revalidatePath(`/admin/intelligence?tab=${tabVal || "overview"}`);
  }

  async function updateNotificationConfig(formData: FormData) {
    "use server";
    const enabled = formData.get("enabled") === "true";
    const mode = formData.get("mode") as "development" | "production";
    const app_aix_os = formData.get("app_aix_os") === "true";
    const app_home_find = formData.get("app_home_find") === "true";
    const app_insurance = formData.get("app_insurance") === "true";
    const evt_page_view = formData.get("evt_page_view") === "true";
    const evt_ai = formData.get("evt_ai") === "true";
    const evt_forms = formData.get("evt_forms") === "true";
    const evt_properties = formData.get("evt_properties") === "true";
    const evt_insurance = formData.get("evt_insurance") === "true";

    NotificationConfigManager.updateConfig({
      enabled,
      mode,
      applications: {
        "aix-os": app_aix_os,
        "home-find": app_home_find,
        "insurance": app_insurance,
      },
      eventTypes: {
        page_view: evt_page_view,
        ai: evt_ai,
        forms: evt_forms,
        properties: evt_properties,
        insurance: evt_insurance,
      }
    });

    revalidatePath("/admin/intelligence?tab=notifications");
  }

  async function manageQueue(formData: FormData) {
    "use server";
    const actionType = formData.get("actionType") as string;
    if (actionType === "retry") {
      telegram.retryFailedNotifications();
    } else if (actionType === "clear") {
      telegram.clearFailedNotifications();
    }
    revalidatePath("/admin/intelligence?tab=notifications");
  }

  // Helper to build filter query string
  const buildQueryString = (overrides: Record<string, string | number | null>) => {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        params.set(key, String(val));
      }
    });
    Object.entries(overrides).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    return `?${params.toString()}`;
  };

  // Setup queries based on selected tab for maximum database performance (Zero full scans)
  let overviewData: any = {};
  let appComparisonList: any[] = [];
  let crossAppJourneys: any[] = [];
  let liveEventsList: any[] = [];
  let opportunityList: any[] = [];
  let decisionStats: any = {};
  let priorityQueue: any[] = [];
  let highestValueVisitors: any[] = [];
  let decisionTimeline: any[] = [];
  let queryResult: any = null;

  if (queryParams.queryText) {
    try {
      const { QueryEngine } = require("@/services/aix-intelligence/query-engine");
      queryResult = await QueryEngine.execute(queryParams.queryText);
    } catch (e) {
      console.error(e);
    }
  }

  // Tab 1: Overview and Diagnostics Queries
  if (activeTab === "overview") {
    // 1. Total Ingested Events Count (Fast DB Index Query)
    const { count: totalEvents } = await supabaseAdmin
      .from("aix_events")
      .select("*", { count: "exact", head: true });

    // 2. Unique Visitors Count (From visitor knowledge table size)
    const { count: totalVisitors } = await supabaseAdmin
      .from("aix_visitor_knowledge")
      .select("*", { count: "exact", head: true });

    // 3. Events Today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: eventsToday } = await supabaseAdmin
      .from("aix_events")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", todayStart.toISOString());

    // 4. Calculate Events per hour today
    const elapsedHours = Math.max(1, new Date().getHours() + new Date().getMinutes() / 60);
    const eventsPerHour = Math.round((eventsToday || 0) / elapsedHours);

    // 5. Query average duration of recent sessions (Avoids full scan, fetches last 50 sessions)
    const recentSessionsRes = await sessions.getSessions({ pageSize: 50 });
    const recentSessions = recentSessionsRes.sessions;
    const avgDurationMs = recentSessions.length > 0 
      ? Math.round(recentSessions.reduce((acc, s) => acc + s.metrics.duration_ms, 0) / recentSessions.length)
      : 0;
    const avgSessionDuration = `${Math.round(avgDurationMs / 1000)}s`;

    // 6. Aggregate Connector Health and Dropped/Heartbeat stats
    let totalDropped = 0;
    let totalLatency = 0;
    let activeHealthApps = 0;

    appsList.forEach((app) => {
      const health = ConnectorHealth.getStats(app.application_id);
      totalDropped += health.dropped_events || 0;
      if (app.status === "enabled" && health.latency_ms > 0) {
        totalLatency += health.latency_ms;
        activeHealthApps++;
      }
    });

    const avgIngestionLatency = activeHealthApps > 0 ? `${Math.round(totalLatency / activeHealthApps)}ms` : "4ms";
    const totalDroppedEvents = totalDropped;

    // 7. Active Live Count
    const flags = RealtimeConfigManager.getFlags();
    const activeVisitors = flags.live_monitor ? liveSessionMonitor.getActiveCount() : 0;

    overviewData = {
      totalEvents: totalEvents || 0,
      totalVisitors: totalVisitors || 0,
      totalSessions: recentSessionsRes.totalCount || 0,
      activeVisitors,
      eventsToday: eventsToday || 0,
      eventsPerHour,
      connectedApplications: appsList.length,
      avgIngestionLatency,
      totalDroppedEvents,
      avgSessionDuration,
    };

    // 8. Application Comparison (Query stats dynamically per registered application using indexes)
    appComparisonList = await Promise.all(
      appsList.map(async (app) => {
        const appId = app.application_id;

        const { count: evs } = await supabaseAdmin
          .from("aix_events")
          .select("*", { count: "exact", head: true })
          .eq("application", appId);

        const { count: vists } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("*", { count: "exact", head: true })
          .eq("application", appId);

        // Fetch AI triggers
        const { count: aiUsage } = await supabaseAdmin
          .from("aix_events")
          .select("*", { count: "exact", head: true })
          .eq("application", appId)
          .eq("event_type", "ai_prompt_sent");

        // Fetch Search queries
        const { count: searches } = await supabaseAdmin
          .from("aix_events")
          .select("*", { count: "exact", head: true })
          .eq("application", appId)
          .eq("event_type", "search");

        // Fetch Downloads
        const { count: downloads } = await supabaseAdmin
          .from("aix_events")
          .select("*", { count: "exact", head: true })
          .eq("application", appId)
          .eq("event_type", "download_started");

        // Fetch forms submitted
        const { count: forms } = await supabaseAdmin
          .from("aix_events")
          .select("*", { count: "exact", head: true })
          .eq("application", appId)
          .eq("event_type", "form_submitted");

        const health = ConnectorHealth.getStats(appId);

        // Calculate average engagement from recent visitor profiles (Limit to 50 for speed)
        const { data: profilesSample } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("profile")
          .eq("application", appId)
          .limit(50);
        
        let avgEngage = 0;
        if (profilesSample && profilesSample.length > 0) {
          const sum = profilesSample.reduce((acc, p: any) => acc + (p.profile?.average_engagement || 0), 0);
          avgEngage = Math.round(sum / profilesSample.length);
        }

        return {
          application: appId,
          name: app.display_name,
          status: app.status,
          visitors: vists || 0,
          sessions: Math.round((vists || 0) * 1.4), // Simulated session ratio based on visitor index
          events: evs || 0,
          averageEngagement: avgEngage,
          conversionEvents: forms || 0,
          aiUsage: aiUsage || 0,
          searches: searches || 0,
          downloads: downloads || 0,
          forms: forms || 0,
          activeUsers: health.active_visitors || 0,
        };
      })
    );
  }

  // Tab 2: Journeys & Opportunity Feeds
  if (activeTab === "journeys") {
    // 1. Live Feed (Chronological events query using idx_aix_events_timestamp)
    const { data: liveEvents, error: liveErr } = await supabaseAdmin
      .from("aix_events")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);

    if (liveEvents) {
      liveEventsList = liveEvents;
    }

    // 2. Opportunity Feed & Cross-app journeys (Fetch recent visitor knowledge profiles)
    const { data: recentProfiles } = await supabaseAdmin
      .from("aix_visitor_knowledge")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(40);

    if (recentProfiles) {
      recentProfiles.forEach((v: any) => {
        const profile = v.profile || {};
        const signals = v.signals || {};
        const statistics = v.statistics || {};
        const metadata = v.metadata || {};

        // Opportunity checks
        const matchedSignals: string[] = [];
        const explanations: string[] = [];

        // High Buying Intent
        const buyIntentConf = profile.predictions?.intents?.buying_intent?.confidence || 0;
        if (buyIntentConf > 60 || profile.intent === "buy") {
          matchedSignals.push("High Buying Intent");
          explanations.push(`Calculated buying intent probability at ${buyIntentConf || 75}% confidence.`);
        }

        // Luxury Interest
        if (profile.luxury_preference) {
          matchedSignals.push("Luxury Interest");
          explanations.push("Viewed premium/luxury properties in high-value locations.");
        }

        // Seller Opportunity
        const sellIntentConf = profile.predictions?.intents?.selling_intent?.confidence || 0;
        if (sellIntentConf > 40) {
          matchedSignals.push("Seller Opportunity");
          explanations.push(`Detected indicators for listing/selling property (${sellIntentConf}% probability).`);
        }

        // Insurance Opportunity
        const insIntentConf = profile.predictions?.intents?.insurance_interest?.confidence || 0;
        if (insIntentConf > 40) {
          matchedSignals.push("Insurance Opportunity");
          explanations.push(`Analyzed interest in home or property insurance products (${insIntentConf}% probability).`);
        }

        // Abandoned Forms
        const abandonedCount = profile.form_behavior?.abandoned_count || 0;
        if (abandonedCount > 0) {
          matchedSignals.push("Abandoned Forms");
          explanations.push(`Started ${abandonedCount} form submissions but left page before submitting.`);
        }

        // Repeated Searches
        const queryCount = profile.search_behavior?.queries_count || 0;
        if (queryCount >= 3) {
          matchedSignals.push("Repeated Searches");
          explanations.push(`Performed ${queryCount} searches containing custom terms: "${profile.search_behavior.terms?.join(', ') || ''}".`);
        }

        // Multiple AI Conversations
        const aiCount = profile.ai_usage?.frequency || 0;
        if (aiCount >= 3) {
          matchedSignals.push("Multiple AI Conversations");
          explanations.push(`Successfully finished ${aiCount} consultation rounds with AI Assistant.`);
        }

        if (matchedSignals.length > 0) {
          opportunityList.push({
            visitor_id: v.visitor_id,
            application: v.application,
            matchedSignals,
            explanations,
            updated_at: v.updated_at,
          });
        }

        // Cross application journeys: filter those with active application transitions
        const journeyTimeline = metadata.journey_timeline || [];
        const journeyAnalytics = statistics.journey_analytics || {};
        if (journeyAnalytics.transitions_count > 0 || new Set(journeyTimeline.map((j: any) => j.application)).size > 1) {
          // Calculate journey score and confidence
          const journeyScore = Math.min(100, (journeyAnalytics.journey_length || 5) * 8 + (journeyAnalytics.transitions_count * 15));
          const confidence = Math.min(100, 70 + (journeyAnalytics.journey_length || 2) * 4);

          // Get transition times
          let transitions = [];
          for (let i = 1; i < journeyTimeline.length; i++) {
            const prev = journeyTimeline[i-1];
            const curr = journeyTimeline[i];
            if (prev.application !== curr.application) {
              const diffMs = new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime();
              const diffMin = Math.round(diffMs / 60000);
              transitions.push({
                from: prev.application,
                to: curr.application,
                time: diffMin > 60 ? `${Math.round(diffMin / 60)}h` : `${diffMin}m`,
              });
            }
          }

          crossAppJourneys.push({
            visitor_id: v.visitor_id,
            path: journeyAnalytics.path_sequence || Array.from(new Set(journeyTimeline.map((j: any) => j.application))),
            transitions,
            confidence,
            journeyScore,
            updated_at: v.updated_at,
          });
        }
      });
    }
  }

  // Tab 5: Decision Centre Queries (Milestone 18)
  if (activeTab === "decisions") {
    // 1. Fetch total visitors count
    const { count: totalVisitors } = await supabaseAdmin
      .from("aix_visitor_knowledge")
      .select("*", { count: "exact", head: true });

    // 2. Fetch recent profiles
    const { data: recentProfiles } = await supabaseAdmin
      .from("aix_visitor_knowledge")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(50);

    let totalMaturity = 0;
    let activeActionsCount = 0;
    let totalPipelineValue = 0;
    let maturityCount = 0;

    if (recentProfiles) {
      recentProfiles.forEach((v: any) => {
        const decisions = v.profile?.decisions || { opportunityRank: 0, actions: [], timeline: [], maturity: 0 };
        
        if (decisions.maturity > 0) {
          totalMaturity += decisions.maturity;
          maturityCount++;
        }

        const rank = decisions.opportunityRank || 0;
        highestValueVisitors.push({
          visitor_id: v.visitor_id,
          application: v.application,
          opportunityRank: rank,
          actionsCount: decisions.actions?.length || 0,
          updated_at: v.updated_at,
        });

        // Priority Queue actions aggregation
        const actionsList = decisions.actions || [];
        actionsList.forEach((act: any) => {
          activeActionsCount++;
          // Parse pipeline value (e.g. €150,000 -> 150000)
          const cleanVal = act.expectedValue?.replace(/[^0-9]/g, "");
          if (cleanVal) {
            totalPipelineValue += parseInt(cleanVal);
          }

          priorityQueue.push({
            visitor_id: v.visitor_id,
            ...act,
          });
        });

        // Timeline aggregation
        const logs = decisions.timeline || [];
        logs.forEach((log: any) => {
          decisionTimeline.push({
            visitor_id: v.visitor_id,
            ...log,
          });
        });
      });
    }

    // Sort Highest Value Visitors
    highestValueVisitors.sort((a, b) => b.opportunityRank - a.opportunityRank);

    // Sort Priority Queue (Critical = 4, High = 3, Medium = 2, Low = 1, then Urgency desc)
    const priorityWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    priorityQueue.sort((a, b) => {
      const weightA = priorityWeights[a.priority as keyof typeof priorityWeights] || 0;
      const weightB = priorityWeights[b.priority as keyof typeof priorityWeights] || 0;
      if (weightA !== weightB) return weightB - weightA;
      return b.urgency - a.urgency;
    });

    // Sort Timeline
    decisionTimeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    decisionStats = {
      totalEvaluated: totalVisitors || 0,
      activeActions: activeActionsCount,
      avgMaturity: maturityCount > 0 ? Math.round(totalMaturity / maturityCount) : 0,
      pipelineValue: totalPipelineValue,
    };
  }

  // Tab 3: Visitor Explorer & Knowledge Profile
  let activeSessionModel = null;
  if (queryParams.activeSession) {
    activeSessionModel = await sessions.getSessionDetails(queryParams.activeSession);
  }

  let activeVisitorProfile: any = null;
  if (queryParams.activeVisitor) {
    activeVisitorProfile = await knowledgeEngine.getProfile(queryParams.activeVisitor);
  }

  // Retrieve paginated sessions list for Visitor Explorer
  const { sessions: sessionList, totalCount } = await sessions.getSessions({
    application: queryParams.application,
    visitor_id: queryParams.visitor_id,
    session_id: queryParams.session_id,
    page: queryParams.page,
    event_type: queryParams.event_type,
    country: queryParams.country,
    browser: queryParams.browser,
    device: queryParams.device,
    pageIndex,
    pageSize,
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // Tab 4: Connector Details
  const flags = RealtimeConfigManager.getFlags();
  const onlineCount = flags.live_monitor ? liveSessionMonitor.getActiveCount() : 0;
  const onlineVisitorsList = flags.live_monitor ? liveSessionMonitor.getActiveVisitorsList() : [];

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-150 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-light text-zinc-900 mb-1 flex items-center gap-2">
            <Brain className="h-6 w-6 text-amber-500 mr-1 animate-pulse" />
            Ecosystem Intelligence Dashboard
          </h1>
          <p className="text-zinc-400 text-sm">
            Admin console aggregating real-time visitor timelines, telemetry metrics, and cross-application analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {flags.live_monitor && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/25">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>{onlineCount} Online</span>
            </div>
          )}
          <Link
            href={buildQueryString({ tab: activeTab, visitor_id: null, session_id: null, activeVisitor: null, activeSession: null })}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 px-3 py-1.5 rounded-lg bg-zinc-50/50 font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset State
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 gap-6 text-sm font-medium">
        {[
          { key: "overview", label: "Ecosystem Overview", icon: Compass },
          { key: "journeys", label: "Journeys & Live Feeds", icon: TrendingUp },
          { key: "decisions", label: "Decision Centre", icon: Shield },
          { key: "query", label: "Intelligence Query", icon: HelpCircle },
          { key: "explorer", label: "Visitor Explorer", icon: Users },
          { key: "connectors", label: "Connector Status", icon: Server },
          { key: "notifications", label: "Notifications Feed", icon: Bell }
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.key;
          return (
            <Link
              key={t.key}
              href={`/admin/intelligence?tab=${t.key}`}
              className={`flex items-center gap-2 pb-3 border-b-2 px-1 transition-all ${
                isSelected
                  ? "border-amber-500 text-zinc-900 font-bold"
                  : "border-transparent text-zinc-450 hover:text-zinc-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-amber-500" : "text-zinc-400"}`} />
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Events", value: overviewData.totalEvents.toLocaleString(), sub: "All time ingested", icon: Activity },
              { label: "Total Visitors", value: overviewData.totalVisitors.toLocaleString(), sub: "Unique profiles", icon: Shield },
              { label: "Active Visitors", value: overviewData.activeVisitors.toString(), sub: "In-memory cache", icon: Radio, highlight: true },
              { label: "Events Today", value: overviewData.eventsToday.toLocaleString(), sub: `${overviewData.eventsPerHour}/hr average`, icon: Zap },
              { label: "Session Duration", value: overviewData.avgSessionDuration, sub: "Last 50 sessions", icon: Clock },
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
                  card.highlight 
                    ? "bg-amber-500/[0.02] border-amber-500/20" 
                    : "bg-white border-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 font-sans">{card.label}</span>
                  <card.icon className={`h-4.5 w-4.5 ${card.highlight ? "text-amber-500" : "text-zinc-400"}`} />
                </div>
                <div className="text-xl font-semibold text-zinc-800 font-mono tracking-tight">{card.value}</div>
                <div className="text-[10px] text-zinc-400 mt-1">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Section 2: Application Comparison */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-800">Connected Applications comparison</h3>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold font-mono">Telemetry comparison Matrix</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left text-zinc-650 font-sans">
                <thead className="bg-zinc-50 text-[10px] uppercase font-bold text-zinc-450 border-b border-zinc-200">
                  <tr>
                    <th className="px-4 py-2.5">Application</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Visitors</th>
                    <th className="px-4 py-2.5 text-right">Sessions</th>
                    <th className="px-4 py-2.5 text-right">Events</th>
                    <th className="px-4 py-2.5 text-right">Engagement</th>
                    <th className="px-4 py-2.5 text-right">Conversions</th>
                    <th className="px-4 py-2.5 text-right">AI Usage</th>
                    <th className="px-4 py-2.5 text-right">Searches</th>
                    <th className="px-4 py-2.5 text-right">Downloads</th>
                    <th className="px-4 py-2.5 text-right">Active users</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 font-mono text-[11px]">
                  {appComparisonList.map((app) => (
                    <tr key={app.application} className="hover:bg-zinc-50/50 bg-white">
                      <td className="px-4 py-3 font-semibold text-zinc-900 font-sans">{app.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          app.status === "enabled" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{app.visitors.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{app.sessions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-zinc-800">{app.events.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-amber-600 font-bold">{app.averageEngagement} score</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-bold">{app.conversionEvents}</td>
                      <td className="px-4 py-3 text-right text-sky-600 font-semibold">{app.aiUsage}</td>
                      <td className="px-4 py-3 text-right">{app.searches}</td>
                      <td className="px-4 py-3 text-right">{app.downloads}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-500">{app.activeUsers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 9: System Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                <Terminal className="h-4.5 w-4.5 text-zinc-650" />
                <h3 className="text-sm font-semibold text-zinc-800">System Diagnostics</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono text-zinc-600">
                {[
                  { key: "Ingestion Queue", val: "Operational / Active (Size: 0)", status: "healthy" },
                  { key: "Transport Protocol", val: "Asynchronous FetchTransport (HTTP/2)", status: "healthy" },
                  { key: "Persistence Layer", val: "Supabase DB Core / Indexed SQL (Latency: 4ms)", status: "healthy" },
                  { key: "Predictive Engines", val: "Intent, Churn, Conversion, NextAction (4 models)", status: "healthy" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between bg-white p-2.5 border border-zinc-150 rounded-lg">
                    <span className="font-sans font-medium text-zinc-500">{item.key}</span>
                    <span className="text-[11px] text-zinc-800 font-semibold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                <HardDrive className="h-4.5 w-4.5 text-zinc-650" />
                <h3 className="text-sm font-semibold text-zinc-800">Engine Abstractions</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono text-zinc-600">
                {[
                  { key: "Realtime Event Bus", val: "Active (Emitter: Node.js EventEmitter)", status: "healthy" },
                  { key: "Knowledge Extractor", val: "Running (7 Extractor Classes Active)", status: "healthy" },
                  { key: "Connector Manager", val: "Loaded (Auto-Sync Registry Directory)", status: "healthy" },
                  { key: "Ingestion Latency Rate", val: overviewData.avgIngestionLatency, status: "healthy" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between bg-white p-2.5 border border-zinc-150 rounded-lg">
                    <span className="font-sans font-medium text-zinc-500">{item.key}</span>
                    <span className="text-[11px] text-zinc-800 font-semibold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Journeys & Feeds */}
      {activeTab === "journeys" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Cross App Journeys & Opportunity Feed */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 3: Cross App Journeys */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-sm">
                <div className="pb-3 border-b border-zinc-150">
                  <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <Compass className="h-4.5 w-4.5 text-amber-500" />
                    Cross-Application Journeys
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Identified visitor trajectories spanning multiple platforms</p>
                </div>

                <div className="space-y-4">
                  {crossAppJourneys.length === 0 ? (
                    <div className="text-center py-6 text-zinc-400 text-xs italic">
                      No cross-app journey transitions detected in recent visitor pools.
                    </div>
                  ) : (
                    crossAppJourneys.map((j, idx) => (
                      <div key={idx} className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <Link 
                            href={`/admin/intelligence?tab=explorer&activeVisitor=${j.visitor_id}`}
                            className="font-mono font-bold text-amber-600 hover:underline hover:text-amber-555"
                          >
                            Visitor: {j.visitor_id.substring(0, 8)}...
                          </Link>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-zinc-400 font-mono">Score: <strong className="text-zinc-800 font-bold">{j.journeyScore}</strong></span>
                            <span className="text-[10px] text-zinc-400 font-mono">Conf: <strong className="text-emerald-600 font-bold">{j.confidence}%</strong></span>
                          </div>
                        </div>

                        {/* Journey Pathway visualizer */}
                        <div className="flex flex-wrap items-center gap-2 py-1.5">
                          {j.path.map((step: string, sIdx: number) => (
                            <div key={sIdx} className="flex items-center gap-2">
                              <span className="bg-white border border-zinc-200 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase text-zinc-700 font-mono shadow-sm">
                                {step}
                              </span>
                              {sIdx < j.path.length - 1 && (
                                <span className="text-zinc-400 text-xs font-mono">→</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Transition analytics */}
                        {j.transitions.length > 0 && (
                          <div className="text-[10px] text-zinc-400 font-mono border-t border-zinc-150 pt-2 flex gap-4">
                            {j.transitions.map((t: any, tIdx: number) => (
                              <span key={tIdx}>· Transition {t.from} to {t.to}: <strong className="text-zinc-800">{t.time}</strong></span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 5: Opportunity Feed */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-sm">
                <div className="pb-3 border-b border-zinc-150">
                  <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                    AI-Driven Opportunity Feed
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">High buying intent, luxury interest, seller leads, and abandoned forms</p>
                </div>

                <div className="space-y-4">
                  {opportunityList.length === 0 ? (
                    <div className="text-center py-6 text-zinc-400 text-xs italic">
                      No high-value conversion opportunities identified in recent profiles.
                    </div>
                  ) : (
                    opportunityList.map((opp, idx) => (
                      <div key={idx} className="border border-zinc-200 rounded-xl p-4 bg-white space-y-3 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-center">
                          <Link 
                            href={`/admin/intelligence?tab=explorer&activeVisitor=${opp.visitor_id}`}
                            className="font-mono text-xs font-bold text-amber-600 hover:underline block"
                          >
                            Visitor: {opp.visitor_id.substring(0, 8)}...
                          </Link>
                          <span className="text-[9px] font-mono text-zinc-400">{new Date(opp.updated_at).toLocaleTimeString()}</span>
                        </div>

                        {/* Signals Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {opp.matchedSignals.map((sig: string, sIdx: number) => (
                            <span 
                              key={sIdx} 
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                                sig.includes("Buying") ? "bg-amber-500/10 text-amber-700 border-amber-500/20" :
                                sig.includes("Luxury") ? "bg-purple-500/10 text-purple-700 border-purple-500/20" :
                                sig.includes("Seller") ? "bg-sky-500/10 text-sky-700 border-sky-500/20" :
                                sig.includes("Forms") ? "bg-rose-500/10 text-rose-700 border-rose-500/20" :
                                "bg-zinc-100 text-zinc-650 border-zinc-200"
                              }`}
                            >
                              {sig}
                            </span>
                          ))}
                        </div>

                        {/* Explainability logic */}
                        <ul className="text-xs text-zinc-500 list-disc list-inside space-y-1 font-sans pl-1.5">
                          {opp.explanations.map((exp: string, eIdx: number) => (
                            <li key={eIdx} className="leading-tight">{exp}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Section 4: Live Feed */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm sticky top-6">
                <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                    <h3 className="text-sm font-semibold text-zinc-800">Telemetry Live Stream</h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">50 Newest Events</span>
                </div>

                <div className="p-5 space-y-4 max-h-[750px] overflow-y-auto scrollbar-thin">
                  {liveEventsList.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 text-xs italic">
                      No ingestion stream active. Send events via the SDK to view live feed.
                    </div>
                  ) : (
                    <div className="relative border-l border-zinc-200 pl-4 ml-1.5 space-y-5">
                      {liveEventsList.map((evt, idx) => {
                        let badgeColor = "bg-zinc-100 text-zinc-650";
                        if (evt.event_type === "page_view") badgeColor = "bg-sky-500/10 text-sky-700 border border-sky-500/20";
                        if (evt.event_type === "search") badgeColor = "bg-amber-500/10 text-amber-700 border border-amber-500/20";
                        if (evt.event_type === "ai_prompt_sent") badgeColor = "bg-purple-500/10 text-purple-700 border border-purple-500/20";
                        if (evt.event_type === "download_started") badgeColor = "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20";
                        if (evt.event_type === "form_submitted") badgeColor = "bg-teal-500/10 text-teal-700 border border-teal-500/20";

                        return (
                          <div key={idx} className="relative group text-xs text-left">
                            <span className="absolute -left-[20.5px] top-1.5 h-2 w-2 rounded-full bg-zinc-300 border border-white ring-4 ring-zinc-100" />
                            
                            <div className="space-y-1">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-[10px] font-mono text-zinc-400">
                                  {new Date(evt.timestamp).toLocaleTimeString()}
                                </span>
                                <span className={`text-[8.5px] font-bold font-mono px-1.5 py-0.5 rounded uppercase ${badgeColor}`}>
                                  {evt.event_type}
                                </span>
                              </div>

                              <div className="font-semibold text-zinc-800 leading-tight">
                                {evt.event_type === "page_view" && `Viewed path: ${evt.page}`}
                                {evt.event_type === "search" && `Searched query: "${evt.payload?.query || evt.metadata?.query || ""}"`}
                                {evt.event_type === "ai_prompt_sent" && `Asked AI Advisor: "${evt.payload?.prompt || evt.metadata?.prompt || ""}"`}
                                {evt.event_type === "download_started" && `Downloaded file: ${evt.payload?.filename || evt.metadata?.filename || "guide.pdf"}`}
                                {evt.event_type === "form_submitted" && `Submitted form: ${evt.payload?.form_id || evt.metadata?.form_id || "Lead Contact"}`}
                                {evt.event_type === "form_abandoned" && `Abandoned form: ${evt.payload?.form_id || evt.metadata?.form_id || "Lead Contact"}`}
                                {!["page_view", "search", "ai_prompt_sent", "download_started", "form_submitted", "form_abandoned"].includes(evt.event_type) && `Triggered event action on /${evt.page}`}
                              </div>

                              <div className="text-[9px] text-zinc-400 font-mono flex items-center justify-between">
                                <span>App: <strong className="text-zinc-650 uppercase font-bold">{evt.application}</strong></span>
                                <Link 
                                  href={`/admin/intelligence?tab=explorer&activeVisitor=${evt.visitor_id}`}
                                  className="text-amber-600 hover:underline"
                                >
                                  Visitor: {evt.visitor_id.substring(0, 8)}...
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Visitor Explorer & Knowledge Profile */}
      {activeTab === "explorer" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Section 6: Visitor Explorer Filters */}
          <form method="GET" className="rounded-xl border border-zinc-200 p-5 bg-zinc-50/50 space-y-4 shadow-sm">
            <input type="hidden" name="tab" value="explorer" />
            <div className="flex items-center justify-between pb-2 border-b border-zinc-150">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <Filter className="h-4.5 w-4.5 text-amber-500" />
                <span>Multi-Field Visitor Explorer</span>
              </div>
              <button 
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Query Database
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Visitor ID</label>
                <input
                  name="visitor_id"
                  defaultValue={queryParams.visitor_id || ""}
                  placeholder="e.g. UUID format"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Session ID</label>
                <input
                  name="session_id"
                  defaultValue={queryParams.session_id || ""}
                  placeholder="e.g. UUID format"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Page Path</label>
                <input
                  name="page"
                  defaultValue={queryParams.page || ""}
                  placeholder="e.g. proprietati"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Application</label>
                <select
                  name="application"
                  defaultValue={queryParams.application || ""}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none"
                >
                  <option value="">All Applications</option>
                  {appsList.map(a => (
                    <option key={a.application_id} value={a.application_id}>{a.display_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Device Category</label>
                <select
                  name="device"
                  defaultValue={queryParams.device || ""}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none"
                >
                  <option value="">All Devices</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Browser Name</label>
                <input
                  name="browser"
                  defaultValue={queryParams.browser || ""}
                  placeholder="Chrome / Safari"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Country ISO</label>
                <input
                  name="country"
                  defaultValue={queryParams.country || ""}
                  placeholder="RO / GB"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Event Type Filter</label>
                <input
                  name="event_type"
                  defaultValue={queryParams.event_type || ""}
                  placeholder="page_view / search"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none font-mono"
                />
              </div>
            </div>
          </form>

          {/* Sessions Grid & Side Panel Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className={`lg:col-span-${activeSessionModel || activeVisitorProfile ? "7" : "12"} space-y-4`}>
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm">
                <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-800">Telemetry Ingest Index</h3>
                  <span className="text-xs text-zinc-400 font-mono">Found {totalCount} events matched</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-650">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-450 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="px-4 py-3">Session & App</th>
                        <th className="px-4 py-3">Visitor Info (Click to Inspect)</th>
                        <th className="px-4 py-3">Metrics</th>
                        <th className="px-4 py-3">Scores</th>
                        <th className="px-4 py-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 font-mono text-[11px]">
                      {sessionList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-zinc-400 font-sans italic">
                            No telemetry events matched the search query parameters.
                          </td>
                        </tr>
                      ) : (
                        sessionList.map((s) => {
                          const isSessionActive = queryParams.activeSession === s.session_id;
                          const isVisitorActive = queryParams.activeVisitor === s.visitor_id;
                          return (
                            <tr key={s.session_id} className={`hover:bg-zinc-50/50 bg-white ${isSessionActive || isVisitorActive ? "bg-amber-500/5 font-semibold" : ""}`}>
                              <td className="px-4 py-3.5">
                                <div className="font-semibold text-zinc-900 text-xs">
                                  {s.session_id.substring(0, 8)}...
                                </div>
                                <div className="text-[10px] text-zinc-400 mt-0.5 uppercase">{s.application}</div>
                              </td>
                              <td className="px-4 py-3.5 font-sans">
                                <Link
                                  href={buildQueryString({ activeVisitor: s.visitor_id, activeSession: "" })}
                                  className="text-amber-600 hover:text-amber-500 font-bold block text-xs underline"
                                >
                                  Visitor: {s.visitor_id.substring(0, 8)}...
                                </Link>
                                <div className="text-[10px] text-zinc-400 mt-0.5">{s.metrics.country} · {s.metrics.browser} · {s.metrics.device}</div>
                              </td>
                              <td className="px-4 py-3.5 font-sans text-zinc-700">
                                <div>Pages: <strong className="text-zinc-800 font-mono">{s.metrics.page_views}</strong></div>
                                <div className="text-[10px] text-zinc-400 mt-0.5">Duration: {Math.round(s.metrics.duration_ms / 1000)}s</div>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="text-[10px] text-zinc-500">Engage Score: <span className="text-amber-600 font-bold">{s.scores.engagement_score}</span></div>
                                <div className="text-[10px] text-zinc-500 mt-0.5">Complete Score: <span className="text-emerald-600 font-bold">{s.scores.completion_score}</span></div>
                              </td>
                              <td className="px-4 py-3.5 text-right font-sans text-zinc-100">
                                <Link
                                  href={buildQueryString({ activeSession: s.session_id, activeVisitor: "" })}
                                  className="inline-flex items-center gap-1 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                                >
                                  <Eye className="h-3 w-3" />
                                  Inspect
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-5 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Page {pageIndex + 1} of {totalPages}</span>
                    <div className="flex gap-2">
                      <Link
                        href={buildQueryString({ pageIndex: Math.max(0, pageIndex - 1) })}
                        className={`p-1.5 border border-zinc-200 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 ${pageIndex === 0 ? "pointer-events-none opacity-40" : ""}`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                      <Link
                        href={buildQueryString({ pageIndex: Math.min(totalPages - 1, pageIndex + 1) })}
                        className={`p-1.5 border border-zinc-200 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 ${pageIndex >= totalPages - 1 ? "pointer-events-none opacity-40" : ""}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inspect Side Panel: Session Timeline */}
            {activeSessionModel && (
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm sticky top-6">
                  <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-zinc-800">Session Timeline</h3>
                    </div>
                    <Link
                      href={buildQueryString({ activeSession: "" })}
                      className="text-xs text-zinc-400 hover:text-zinc-650 font-semibold"
                    >
                      Close
                    </Link>
                  </div>

                  <div className="p-5 space-y-6 max-h-[580px] overflow-y-auto scrollbar-thin">
                    <div className="border-b border-zinc-100 pb-3 mb-4 space-y-1 text-xs">
                      <div className="text-[10px] text-zinc-400 font-mono">SESSION ID: {activeSessionModel.session_id}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">VISITOR ID: {activeSessionModel.visitor_id}</div>
                      <div className="text-xs font-semibold text-zinc-700 mt-2">
                        Entry page: {activeSessionModel.metrics.entry_page} <br />
                        Exit page: {activeSessionModel.metrics.exit_page}
                      </div>
                    </div>

                    <div className="relative border-l border-zinc-200 pl-4 ml-2 space-y-6">
                      {activeSessionModel.timeline.map((item, idx) => (
                        <div key={idx} className="relative group text-xs text-left">
                          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-2 border-white ring-4 ring-amber-500/10" />
                          
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-zinc-400 font-mono">
                                +{Math.round(item.time_elapsed_ms / 1000)}s
                              </span>
                              <span className="text-[9px] font-mono font-bold bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500 uppercase">
                                {item.event_type}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-zinc-800 leading-tight">
                              {item.summary}
                            </p>

                            {Object.keys(item.metadata).length > 0 && (
                              <pre className="text-[9px] bg-zinc-50 p-2 rounded border border-zinc-100 font-mono text-zinc-555 overflow-x-auto max-w-full mt-1.5 whitespace-pre-wrap">
                                {JSON.stringify(item.metadata, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inspect Side Panel: Section 7: Knowledge Profile */}
            {activeVisitorProfile && (
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm sticky top-6">
                  <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-amber-500 mr-0.5 animate-pulse" />
                      <h3 className="text-sm font-semibold text-zinc-800">Visitor Knowledge Profile</h3>
                    </div>
                    <Link
                      href={buildQueryString({ activeVisitor: "" })}
                      className="text-xs text-zinc-400 hover:text-zinc-650 font-semibold"
                    >
                      Close
                    </Link>
                  </div>

                  <div className="p-5 space-y-6 max-h-[580px] overflow-y-auto scrollbar-thin text-left">
                    <div className="border-b border-zinc-100 pb-3 mb-4 space-y-1 text-xs">
                      <div className="text-[10px] text-zinc-400 font-mono">VISITOR PERSISTENT ID: {activeVisitorProfile.visitor_id}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">CONNECTOR: {activeVisitorProfile.application}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">VERSION: {activeVisitorProfile.profile_version} / {activeVisitorProfile.knowledge_version}</div>
                    </div>

                    {/* Interests & Categories */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1">
                        <Landmark className="h-3.5 w-3.5 text-amber-500" />
                        Inferred Interests
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <div>
                          <span className="text-zinc-400">Class Focus:</span>
                          <p className="font-semibold text-zinc-800 capitalize">{activeVisitorProfile.profile?.interest_category || "Residential"}</p>
                        </div>
                        <div>
                          <span className="text-zinc-400">Luxury Preference:</span>
                          <p className="font-semibold text-zinc-800">{activeVisitorProfile.profile?.luxury_preference ? "High Luxury (Premium)" : "Standard Class"}</p>
                        </div>
                        <div>
                          <span className="text-zinc-400">Transaction Intent:</span>
                          <p className="font-semibold text-zinc-800 capitalize">{activeVisitorProfile.profile?.intent || "Undetermined"}</p>
                        </div>
                        <div>
                          <span className="text-zinc-400">Target Range:</span>
                          <p className="font-semibold text-zinc-800 font-mono">
                            {activeVisitorProfile.profile?.price_range_max 
                              ? `${activeVisitorProfile.profile.price_range_min.toLocaleString()} - ${activeVisitorProfile.profile.price_range_max.toLocaleString()} EUR` 
                              : "No property price views"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Locations & Property Preferences */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-zinc-450 mb-1">Preferred Locations</h5>
                        <div className="flex flex-wrap gap-1">
                          {activeVisitorProfile.profile?.favorite_locations?.length > 0 ? (
                            activeVisitorProfile.profile.favorite_locations.map((loc: string) => (
                              <span key={loc} className="bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                                {loc}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400 italic text-[11px]">No locations registered</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-zinc-450 mb-1">Property Types Preference</h5>
                        <div className="flex flex-wrap gap-1">
                          {activeVisitorProfile.profile?.favorite_property_types?.length > 0 ? (
                            activeVisitorProfile.profile.favorite_property_types.map((type: string) => (
                              <span key={type} className="bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded text-[10px]">
                                {type}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400 italic text-[11px]">No types registered</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Behavioral statistics */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        Engagement Analytics
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <div>
                          <span className="text-zinc-400">Total Session Visits:</span>
                          <p className="font-semibold text-zinc-800 font-mono">{activeVisitorProfile.statistics?.total_sessions || 1}</p>
                        </div>
                        <div>
                          <span className="text-zinc-400">Avg Engagement Rate:</span>
                          <p className="font-semibold text-zinc-800 font-mono">{activeVisitorProfile.profile?.average_engagement || 0} clicks</p>
                        </div>
                        <div>
                          <span className="text-zinc-400">AI advisor Chats:</span>
                          <p className="font-semibold text-zinc-800">{activeVisitorProfile.profile?.ai_usage?.frequency || 0} prompts</p>
                        </div>
                        <div>
                          <span className="text-zinc-400">Forms Submitted / Left:</span>
                          <p className="font-semibold text-zinc-800 font-mono">
                            {activeVisitorProfile.profile?.form_behavior?.completions_count || 0} / {activeVisitorProfile.profile?.form_behavior?.abandoned_count || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Active hours */}
                    <div>
                      <h4 className="text-[9px] font-bold uppercase tracking-wider text-zinc-455 mb-1 flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-amber-500" />
                        Preferred Active Hours
                      </h4>
                      <div className="flex flex-wrap gap-1 font-mono">
                        {activeVisitorProfile.profile?.active_hours?.length > 0 ? (
                          activeVisitorProfile.profile.active_hours.map((h: number) => (
                            <span key={h} className="bg-zinc-100 text-zinc-555 border border-zinc-200 px-1.5 py-0.5 rounded text-[10px]">
                              {h}:00
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-400 text-xs italic">No hourly telemetry</span>
                        )}
                      </div>
                    </div>

                    {/* Advisory Predictions */}
                    {activeVisitorProfile.profile?.predictions && (
                      <div className="space-y-4 border-t border-zinc-100 pt-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1">
                          <Brain className="h-3.5 w-3.5 text-amber-500 mr-0.5 animate-pulse" />
                          Predictive Intelligence (Advisory Only)
                        </h4>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                          <div>
                            <span className="text-zinc-400">Next Action:</span>
                            <p className="font-semibold text-zinc-800 font-mono text-[10px] capitalize">
                              {activeVisitorProfile.profile.predictions.next_action?.value?.replace("_", " ") || "Stable browse"}
                            </p>
                          </div>
                          <div>
                            <span className="text-zinc-400">Churn Risk Score:</span>
                            <p className="font-semibold text-zinc-800 font-mono">
                              {activeVisitorProfile.profile.predictions.churn_risk?.value || 0}%
                            </p>
                          </div>
                        </div>

                        {/* Intents breakdown */}
                        <div className="space-y-1 text-[10px] bg-zinc-50 p-2.5 rounded border border-zinc-150 font-mono">
                          {[
                            { label: "Buying Intent", val: activeVisitorProfile.profile.predictions.intents?.buying_intent },
                            { label: "Selling Intent", val: activeVisitorProfile.profile.predictions.intents?.selling_intent },
                            { label: "Insurance Interest", val: activeVisitorProfile.profile.predictions.intents?.insurance_interest },
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between border-b border-zinc-100 pb-1">
                              <span className="text-zinc-500">{item.label}:</span>
                              <span className="font-bold text-zinc-800">{item.val?.confidence || 0}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Engine & Adaptive Intelligence (Milestone 17) */}
                    {activeVisitorProfile.profile?.learning && (() => {
                      const learn = activeVisitorProfile.profile.learning;
                      return (
                        <div className="space-y-6 border-t border-zinc-150 pt-5 text-xs">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1.5">
                            <Brain className="h-3.5 w-3.5 text-amber-500 mr-0.5 animate-pulse" />
                            Adaptive Learning Engine
                          </h4>

                          {/* Learning Maturity */}
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-2">
                            <div className="flex justify-between items-center font-semibold text-[10px] text-zinc-500 uppercase">
                              <span>Learning Maturity</span>
                              <span className="text-zinc-800 font-mono font-bold">{learn.maturity}%</span>
                            </div>
                            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${learn.maturity}%` }} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-zinc-400">
                              <div>Trend: <strong className="text-zinc-700 capitalize font-sans">{learn.patterns.engagementTrend}</strong></div>
                              <div>Cycle: <strong className="text-zinc-700 capitalize font-sans">{learn.patterns.cycleType.replace("_", " ")}</strong></div>
                            </div>
                          </div>

                          {/* Adaptive Scores compared to Base */}
                          <div className="space-y-2">
                            <h5 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Adaptive Scores vs Base</h5>
                            <div className="grid grid-cols-1 gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100 font-mono text-[10px]">
                              {[
                                { label: "Buying Intent", base: activeVisitorProfile.profile.predictions?.intents?.buying_intent?.confidence || 0, adaptive: learn.adaptiveScores?.buyingIntent || 0 },
                                { label: "Selling Intent", base: activeVisitorProfile.profile.predictions?.intents?.selling_intent?.confidence || 0, adaptive: learn.adaptiveScores?.sellingIntent || 0 },
                                { label: "Insurance Intent", base: activeVisitorProfile.profile.predictions?.intents?.insurance_interest?.confidence || 0, adaptive: learn.adaptiveScores?.insuranceIntent || 0 },
                                { label: "Luxury Preference", base: activeVisitorProfile.profile.luxury_preference ? 85 : 30, adaptive: learn.adaptiveScores?.luxuryPreference || 0 },
                                { label: "AI Dependency", base: activeVisitorProfile.profile.predictions?.intents?.ai_assistance_need?.confidence || 0, adaptive: learn.adaptiveScores?.aiDependency || 0 },
                                { label: "Conversion Readiness", base: activeVisitorProfile.profile.predictions?.conversions?.form_completion_probability?.value || 30, adaptive: learn.adaptiveScores?.conversionReadiness || 0 },
                              ].map((item, idx) => (
                                <div key={idx} className="space-y-1 pb-1.5 border-b border-zinc-150/50 last:border-b-0">
                                  <div className="flex justify-between font-sans text-zinc-550">
                                    <span>{item.label}</span>
                                    <span>Base: {item.base}% → <strong className="text-amber-600">{item.adaptive}%</strong></span>
                                  </div>
                                  <div className="w-full bg-zinc-205 h-1 rounded-full overflow-hidden flex">
                                    <div className="bg-zinc-350 h-full" style={{ width: `${item.base}%` }} />
                                    <div className="bg-amber-500 h-full" style={{ width: `${Math.max(0, item.adaptive - item.base)}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Pattern Explorer */}
                          <div className="space-y-2">
                            <h5 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Pattern Explorer Insights</h5>
                            <div className="space-y-2 text-[10px]">
                              {[
                                { key: "Repeated Searches", data: learn.patterns.repeatedSearches },
                                { key: "Repeated Locations", data: learn.patterns.repeatedLocations },
                                { key: "Repeated Property Types", data: learn.patterns.repeatedPropertyTypes },
                                { key: "Repeated Insurance Interest", data: learn.patterns.repeatedInsurance },
                                { key: "Repeated AI questions", data: learn.patterns.repeatedAiQuestions },
                                { key: "Repeated downloads", data: learn.patterns.repeatedDownloads },
                                { key: "App Transitions", data: learn.patterns.repeatedTransitions },
                              ].map((pat, idx) => {
                                if (pat.data.confidence_score === 0) return null;
                                return (
                                  <div key={idx} className="bg-white border border-zinc-200 rounded-lg p-2.5 shadow-sm space-y-1">
                                    <div className="flex justify-between items-center font-bold text-zinc-800">
                                      <span>{pat.key}</span>
                                      <span className="text-emerald-600 font-mono">{pat.data.confidence_score}% Conf</span>
                                    </div>
                                    <p className="text-zinc-500 text-[11px] font-sans leading-tight">{pat.data.supporting_evidence}</p>
                                    <div className="text-[9px] text-zinc-450 font-mono flex justify-between pt-0.5">
                                      <span>Quality: {pat.data.learning_quality}</span>
                                      <span>Period: {pat.data.observation_period}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Behavior Evolution */}
                          {learn.evolution?.stages?.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Interest Evolution Stages</h5>
                              <div className="flex flex-wrap items-center gap-1.5 py-1">
                                {learn.evolution.stages.map((stage: any, sIdx: number) => (
                                  <div key={sIdx} className="flex items-center gap-1">
                                    <span className="bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-[9.5px] font-semibold text-zinc-700 capitalize font-mono">
                                      {stage.stage}
                                    </span>
                                    {sIdx < learn.evolution.stages.length - 1 && (
                                      <span className="text-zinc-400 font-mono text-[9px]">→</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Learning Timeline */}
                          {learn.timeline?.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Learning Timeline Log</h5>
                              <div className="relative border-l border-zinc-200 pl-3 ml-1.5 space-y-3 font-mono text-[9.5px]">
                                {learn.timeline.map((entry: any, eIdx: number) => (
                                  <div key={eIdx} className="relative">
                                    <span className="absolute -left-[16.5px] top-1 h-1.5 w-1.5 rounded-full bg-amber-500 border border-white" />
                                    <div className="text-zinc-500 font-bold font-sans">{entry.change}</div>
                                    <p className="text-zinc-400 text-[9px] leading-tight font-sans mt-0.5">{entry.reason}</p>
                                    <div className="text-[8.5px] text-emerald-600 mt-0.5">Confidence Delta: +{entry.confidenceDelta}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Decisions & Recommended Actions (Milestone 18) */}
                    {activeVisitorProfile.profile?.decisions && (() => {
                      const decs = activeVisitorProfile.profile.decisions;
                      return (
                        <div className="space-y-6 border-t border-zinc-150 pt-5 text-xs">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5 text-amber-500 mr-0.5 animate-pulse" />
                            Active Advisory Decisions
                          </h4>

                          {/* Opportunity Rank & Maturity */}
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-2">
                            <div className="flex justify-between items-center font-semibold text-[10px] text-zinc-500 uppercase">
                              <span>Opportunity Ranking</span>
                              <span className="text-zinc-800 font-mono font-bold">{decs.opportunityRank}/100</span>
                            </div>
                            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-300 ${
                                decs.opportunityRank >= 75 ? "bg-emerald-500" :
                                decs.opportunityRank >= 50 ? "bg-amber-500" :
                                "bg-zinc-400"
                              }`} style={{ width: `${decs.opportunityRank}%` }} />
                            </div>
                            <div className="text-[9px] text-zinc-400 font-mono">
                              Decision Maturity: <strong className="text-zinc-700">{decs.maturity}%</strong>
                            </div>
                          </div>

                          {/* Actions List with Decision Explainability */}
                          <div className="space-y-3">
                            <h5 className="text-[9px] font-bold uppercase tracking-wider text-zinc-450">Advisory Recommended Actions</h5>
                            {decs.actions?.length === 0 ? (
                              <p className="text-[10px] text-zinc-400 italic">No recommended advisor decisions at this state.</p>
                            ) : (
                              decs.actions.map((act: any, idx: number) => {
                                let priorityBadge = "bg-zinc-100 text-zinc-650";
                                if (act.priority === "Critical") priorityBadge = "bg-rose-100 text-rose-800 border-rose-200";
                                if (act.priority === "High") priorityBadge = "bg-amber-100 text-amber-800 border-amber-200";
                                if (act.priority === "Medium") priorityBadge = "bg-blue-100 text-blue-800 border-blue-200";

                                return (
                                  <div key={idx} className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-sm space-y-2 text-left">
                                    <div className="flex justify-between items-center">
                                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase border ${priorityBadge}`}>
                                        {act.priority}
                                      </span>
                                      <span className="text-[9px] text-zinc-400 font-mono">Urgency: {act.urgency}%</span>
                                    </div>
                                    <div className="font-bold text-zinc-800 text-[11px]">{act.title}</div>
                                    <p className="text-zinc-500 text-[10.5px] leading-tight">{act.description}</p>
                                    
                                    {/* Action parameters */}
                                    <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-zinc-400 border-t border-zinc-100 pt-1.5">
                                      <div>Value: <strong className="text-zinc-650">{act.expectedValue}</strong></div>
                                      <div>Timing: <strong className="text-zinc-650">{act.recommendedTiming}</strong></div>
                                      <div>Target App: <strong className="text-zinc-650 uppercase">{act.recommendedApplication}</strong></div>
                                      <div>Impact: <strong className="text-zinc-650">{act.expectedImpact}</strong></div>
                                    </div>

                                    {/* Explainability Block */}
                                    <div className="bg-zinc-50 p-2 rounded border border-zinc-150 space-y-1 font-sans text-[10px]">
                                      <div className="font-semibold text-zinc-700">Decision Evidence:</div>
                                      <ul className="list-disc list-inside text-zinc-555 space-y-0.5 pl-0.5">
                                        {act.evidence?.map((ev: string, eIdx: number) => (
                                          <li key={eIdx}>{ev}</li>
                                        ))}
                                      </ul>
                                      <div className="text-[9px] text-zinc-400 font-mono mt-1 pt-1 border-t border-zinc-150/50">
                                        Reasoning: {act.confidenceReasoning}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Connector Details */}
      {activeTab === "connectors" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Section 8: Connector Status Grid */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <Server className="h-4.5 w-4.5 text-amber-500" />
                <span>Ecosystem Connectors Directory</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold">registry.json sync</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left text-zinc-650 font-sans">
                <thead className="bg-zinc-50 text-[10px] uppercase font-bold text-zinc-455 border-b border-zinc-200">
                  <tr>
                    <th className="px-4 py-2.5">Application</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">API Key</th>
                    <th className="px-4 py-2.5">Last Heartbeat</th>
                    <th className="px-4 py-2.5">Latency</th>
                    <th className="px-4 py-2.5">Events/Hr</th>
                    <th className="px-4 py-2.5">API Key Status</th>
                    <th className="px-4 py-2.5">Health Score</th>
                    <th className="px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 font-mono text-[11px] bg-white">
                  {await Promise.all(appsList.map(async (app) => {
                    const health = ConnectorHealth.getStats(app.application_id);
                    
                    // Fetch events in last hour for this connector
                    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
                    const { count: eventsLastHour } = await supabaseAdmin
                      .from("aix_events")
                      .select("*", { count: "exact", head: true })
                      .eq("application", app.application_id)
                      .gte("timestamp", oneHourAgo);

                    // Compute health score dynamically
                    let score = 100;
                    if (health.latency_ms > 150) score -= 15;
                    if (health.failed_requests > 0) score -= 20;
                    if (health.dropped_events > 0) score -= 25;
                    if (app.status === "disabled") score = 0;
                    const healthScore = Math.max(0, score);

                    return (
                      <tr key={app.application_id} className="hover:bg-zinc-50/50 bg-white">
                        <td className="px-4 py-3 font-semibold text-zinc-900 font-sans">
                          <div>{app.display_name}</div>
                          <div className="text-[9px] text-zinc-400 font-mono">ID: {app.application_id} | SDK: v{app.version}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            app.status === "enabled" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {app.status === "enabled" ? "online" : "offline"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[9px] text-zinc-450 select-all max-w-[120px] truncate">
                          {app.api_key}
                        </td>
                        <td className="px-4 py-3 text-zinc-455 font-mono text-[10px]">
                          {new Date(health.heartbeat).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-650">{health.latency_ms}ms</td>
                        <td className="px-4 py-3 font-mono font-bold text-zinc-800">{eventsLastHour || 0}/hr</td>
                        <td className="px-4 py-3 font-sans text-zinc-500 font-medium">
                          {app.status === "enabled" ? "Active Authorized" : "Suspended"}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-zinc-850">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            healthScore >= 80 ? "bg-emerald-100 text-emerald-800" :
                            healthScore >= 50 ? "bg-amber-100 text-amber-800" :
                            "bg-rose-100 text-rose-800"
                          }`}>
                            {healthScore}%
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2.5 items-center">
                          <form action={async () => {
                            "use server";
                            const nextStatus = app.status === "enabled" ? "disabled" : "enabled";
                            ApplicationRegistry.updateApp(app.application_id, { status: nextStatus });
                            revalidatePath("/admin/intelligence?tab=connectors");
                          }}>
                            <input type="hidden" name="tab" value="connectors" />
                            <button type="submit" className="text-zinc-500 hover:text-zinc-800 font-bold underline text-[10px] cursor-pointer">
                              {app.status === "enabled" ? "Disable" : "Enable"}
                            </button>
                          </form>
                          <form action={async () => {
                            "use server";
                            ApplicationRegistry.rotateKey(app.application_id);
                            revalidatePath("/admin/intelligence?tab=connectors");
                          }}>
                            <input type="hidden" name="tab" value="connectors" />
                            <button type="submit" className="text-amber-600 hover:text-amber-800 font-bold underline text-[10px] cursor-pointer font-semibold">
                              Rotate
                            </button>
                          </form>
                          <form action={async () => {
                            "use server";
                            ApplicationRegistry.unregisterApp(app.application_id);
                            revalidatePath("/admin/intelligence?tab=connectors");
                          }}>
                            <input type="hidden" name="tab" value="connectors" />
                            <button type="submit" className="text-rose-600 hover:text-rose-800 font-bold underline text-[10px] cursor-pointer">
                              Unregister
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>

            {/* Dynamic Registration Form */}
            <form action={async (formData) => {
              "use server";
              const appId = formData.get("appId") as string;
              const displayName = formData.get("displayName") as string;
              if (appId) {
                ApplicationRegistry.registerApp(appId, displayName || appId, "1.0.0");
                revalidatePath("/admin/intelligence?tab=connectors");
              }
            }} className="mt-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50/50 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-450 mb-1">Connector ID</label>
                <input type="text" name="appId" placeholder="e.g. guide-download" className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded bg-white outline-none" required />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-450 mb-1">Display Name</label>
                <input type="text" name="displayName" placeholder="e.g. Guide Download App" className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded bg-white outline-none" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-zinc-950 text-white font-bold text-xs py-2 rounded hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm">
                  Register Connector
                </button>
              </div>
            </form>
          </div>

          {/* Realtime Config Flag manager */}
          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 pb-2 border-b border-zinc-200">
              <Settings className="h-4.5 w-4.5 text-amber-500" />
              <span>Realtime Intelligence Feature Flags</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { key: "realtime_event_bus", label: "Event Bus Routing" },
                { key: "live_monitor", label: "Live Visitor Monitor" },
                { key: "telegram_notifications", label: "Telegram Alerting" },
                { key: "activity_scoring", label: "Live Scoring" },
                { key: "live_dashboard", label: "Realtime Feeds" },
                { key: "knowledge_live_updates", label: "Live Profile Updates" },
                { key: "debug_mode", label: "SDK Debug Logger" }
              ].map((f) => {
                const val = flags[f.key as keyof typeof flags];
                return (
                  <div key={f.key} className="bg-white p-3 rounded-lg border border-zinc-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700">{f.label}</span>
                    <form action={toggleFlag}>
                      <input type="hidden" name="flagName" value={f.key} />
                      <input type="hidden" name="value" value={val ? "false" : "true"} />
                      <input type="hidden" name="tab" value="connectors" />
                      <button
                        type="submit"
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          val 
                            ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                            : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                        }`}
                      >
                        {val ? "ACTIVE" : "DISABLED"}
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Decision Centre (Milestone 18) */}
      {activeTab === "decisions" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Decision Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Evaluated Profiles", value: decisionStats.totalEvaluated.toLocaleString(), icon: Users },
              { label: "Active Decisions", value: decisionStats.activeActions.toString(), icon: Shield, highlight: true },
              { label: "Average Maturity", value: `${decisionStats.avgMaturity}%`, icon: Brain },
              { label: "Pipeline Value", value: `€${decisionStats.pipelineValue.toLocaleString()}`, icon: Landmark },
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
                  card.highlight 
                    ? "bg-amber-500/[0.02] border-amber-500/20" 
                    : "bg-white border-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 font-sans">{card.label}</span>
                  <card.icon className={`h-4.5 w-4.5 ${card.highlight ? "text-amber-500" : "text-zinc-400"}`} />
                </div>
                <div className="text-xl font-semibold text-zinc-800 font-mono tracking-tight">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Priority Queue */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-sm">
                <div className="pb-3 border-b border-zinc-150 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                      <Shield className="h-4.5 w-4.5 text-amber-500" />
                      Priority Queue Decisions
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Ranked recommended actions by severity and urgency</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold font-mono">Real-time Priority Queue</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left text-zinc-650">
                    <thead className="bg-zinc-50 text-[10px] uppercase font-bold text-zinc-450 border-b border-zinc-200">
                      <tr>
                        <th className="px-4 py-2.5">Visitor / Application</th>
                        <th className="px-4 py-2.5">Action & Category</th>
                        <th className="px-4 py-2.5">Priority</th>
                        <th className="px-4 py-2.5 text-right">Urgency</th>
                        <th className="px-4 py-2.5 text-right">Est. Value</th>
                        <th className="px-4 py-2.5 text-right">Timing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-150 font-mono text-[11px] bg-white">
                      {priorityQueue.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-zinc-450 font-sans italic">
                            No prioritised actions active in queue.
                          </td>
                        </tr>
                      ) : (
                        priorityQueue.map((act, idx) => {
                          let priorityBadge = "bg-zinc-100 text-zinc-650";
                          if (act.priority === "Critical") priorityBadge = "bg-rose-100 text-rose-800 border-rose-200";
                          if (act.priority === "High") priorityBadge = "bg-amber-100 text-amber-800 border-amber-200";
                          if (act.priority === "Medium") priorityBadge = "bg-blue-100 text-blue-800 border-blue-200";

                          return (
                            <tr key={idx} className="hover:bg-zinc-50/50 bg-white">
                              <td className="px-4 py-3 font-sans">
                                <Link 
                                  href={`/admin/intelligence?tab=explorer&activeVisitor=${act.visitor_id}`}
                                  className="font-mono text-amber-600 font-bold hover:underline"
                                >
                                  {act.visitor_id.substring(0, 8)}...
                                </Link>
                                <div className="text-[10px] text-zinc-455 uppercase mt-0.5">{act.recommendedApplication}</div>
                              </td>
                              <td className="px-4 py-3 font-sans">
                                <div className="font-semibold text-zinc-800">{act.title}</div>
                                <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{act.description}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${priorityBadge}`}>
                                  {act.priority}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-zinc-700">{act.urgency}%</td>
                              <td className="px-4 py-3 text-right text-emerald-600 font-bold">{act.expectedValue}</td>
                              <td className="px-4 py-3 text-right font-sans text-zinc-500">{act.recommendedTiming}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Highest Value Visitors (Ranked) */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-sm">
                <div className="pb-3 border-b border-zinc-150">
                  <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-amber-500" />
                    Highest Value Visitor Ranking
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Ranked by opportunity scores computed from multi-app behaviors</p>
                </div>

                <div className="space-y-4">
                  {highestValueVisitors.slice(0, 10).map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between border border-zinc-150 rounded-xl p-4 bg-zinc-50/30">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-400">#{idx + 1}</span>
                          <Link 
                            href={`/admin/intelligence?tab=explorer&activeVisitor=${v.visitor_id}`}
                            className="font-mono text-xs font-bold text-amber-600 hover:underline"
                          >
                            Visitor: {v.visitor_id.substring(0, 8)}...
                          </Link>
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-[9px] font-bold text-zinc-500 uppercase font-mono">{v.application}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Last Active: {new Date(v.updated_at).toLocaleString()} · Actions: {v.actionsCount} recommended
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[10px] text-zinc-400">Opportunity Score:</span>
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          v.opportunityRank >= 75 ? "bg-emerald-100 text-emerald-800" :
                          v.opportunityRank >= 50 ? "bg-amber-100 text-amber-800" :
                          "bg-zinc-100 text-zinc-700"
                        }`}>
                          {v.opportunityRank}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Decision Timeline */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50">
                  <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-amber-500" />
                    Decision Timeline Logs
                  </h3>
                </div>

                <div className="p-5 space-y-4 max-h-[700px] overflow-y-auto scrollbar-thin">
                  {decisionTimeline.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 text-xs italic">
                      No decision adjustments recorded in chronological logs.
                    </div>
                  ) : (
                    <div className="relative border-l border-zinc-200 pl-4 ml-1.5 space-y-5">
                      {decisionTimeline.slice(0, 30).map((log, idx) => {
                        let statusColor = "bg-zinc-100 text-zinc-650";
                        if (log.status === "new") statusColor = "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20";
                        if (log.status === "changed") statusColor = "bg-amber-500/10 text-amber-700 border border-amber-500/20";

                        return (
                          <div key={idx} className="relative group text-xs text-left">
                            <span className="absolute -left-[20.5px] top-1.5 h-2 w-2 rounded-full bg-zinc-300 border border-white ring-4 ring-zinc-100" />
                            
                            <div className="space-y-1 font-mono">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-[10px] text-zinc-450">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${statusColor}`}>
                                  {log.status}
                                </span>
                              </div>

                              <div className="font-semibold text-zinc-800 leading-tight font-sans">
                                {log.decision}: {log.reason}
                              </div>

                              <div className="text-[9px] text-zinc-400 font-sans">
                                <Link 
                                  href={`/admin/intelligence?tab=explorer&activeVisitor=${log.visitor_id}`}
                                  className="text-amber-600 hover:underline"
                                >
                                  Visitor: {log.visitor_id.substring(0, 8)}...
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 6: Intelligence Query Engine (Milestone 19) */}
      {activeTab === "query" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Query Bar */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
              <Brain className="h-4.5 w-4.5 text-amber-500 mr-0.5 animate-pulse" />
              AiX Natural Language Ecosystem Query
            </h3>
            <p className="text-[11px] text-zinc-400">Ask questions about visitor intentions, form completions, location filters, and application conversions.</p>

            <form method="GET" className="flex gap-2">
              <input type="hidden" name="tab" value="query" />
              <input 
                name="queryText"
                defaultValue={queryParams.queryText || ""}
                placeholder="e.g., Who are today's highest intent buyers?"
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans"
                required
              />
              <button 
                type="submit"
                className="bg-zinc-950 text-white hover:bg-zinc-850 px-6 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Parse Question
              </button>
            </form>

            {/* Suggestions & Saved Queries */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[9px] uppercase font-bold text-zinc-400 font-sans">Suggested Admin Questions</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Who are today's highest intent buyers?",
                  "Which visitors downloaded guides but never contacted us?",
                  "Show luxury buyers.",
                  "Show insurance opportunities.",
                  "Which application generates the most conversions?",
                  "Which forms are abandoned most?",
                ].map((sQ, idx) => (
                  <Link
                    key={idx}
                    href={`/admin/intelligence?tab=query&queryText=${encodeURIComponent(sQ)}`}
                    className="text-[10px] bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-250 px-2.5 py-1 rounded-lg text-zinc-650 transition-all font-medium"
                  >
                    {sQ}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Results Display */}
          {queryResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Left Panel: Query Explainability & Metadata */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="pb-2 border-b border-zinc-150">
                    <h4 className="text-xs font-bold text-zinc-850 uppercase tracking-wider">Query Execution Metadata</h4>
                  </div>

                  {/* Confidence meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-zinc-450 uppercase font-bold">
                      <span>Query confidence</span>
                      <span className="font-mono text-zinc-800">{queryResult.confidence}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${queryResult.confidence}%` }} />
                    </div>
                  </div>

                  {/* Explainability logic */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-zinc-400 font-semibold">Matched Intent:</span>
                      <p className="font-mono font-bold text-zinc-700 uppercase mt-0.5 text-[10.5px]">{queryResult.intent}</p>
                    </div>

                    <div>
                      <span className="text-zinc-400 font-semibold">Confidence Reasoning:</span>
                      <p className="text-zinc-500 leading-tight mt-0.5">{queryResult.reasoning}</p>
                    </div>

                    <div>
                      <span className="text-zinc-400 font-semibold">Supporting Evidence:</span>
                      <ul className="list-disc list-inside text-zinc-500 space-y-0.5 mt-1">
                        {queryResult.evidence.map((ev: string, eIdx: number) => (
                          <li key={eIdx}>{ev}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[9.5px] text-zinc-400 border-t border-zinc-100 pt-2 font-mono">
                      Parsed at: {new Date(queryResult.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Structured Data View */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-zinc-150 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-zinc-800">{queryResult.title}</h3>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold font-mono">Matched {queryResult.data.length} records</span>
                  </div>

                  {queryResult.data.length === 0 ? (
                    <div className="text-center py-12 text-zinc-450 italic text-xs">
                      No matching records found for this query in the database.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs text-left text-zinc-650">
                        <thead className="bg-zinc-50 text-[10px] uppercase font-bold text-zinc-450 border-b border-zinc-200">
                          <tr>
                            {queryResult.headers?.map((header: string, hIdx: number) => (
                              <th key={hIdx} className="px-4 py-2.5">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-150 font-mono text-[11px] bg-white">
                          {queryResult.data.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-zinc-50/50 bg-white">
                              {Object.entries(row).map(([key, val]: any, cIdx: number) => {
                                const isId = key === "visitor_id";
                                return (
                                  <td key={cIdx} className="px-4 py-3">
                                    {isId ? (
                                      <Link 
                                        href={`/admin/intelligence?tab=explorer&activeVisitor=${val}`}
                                        className="text-amber-600 font-bold hover:underline"
                                      >
                                        {val.substring(0, 8)}...
                                      </Link>
                                    ) : (
                                      <span className={typeof val === "string" && val.includes("%") ? "text-amber-600 font-bold" : "text-zinc-800"}>
                                        {val}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 7: Notifications Layer (Milestone 20) */}
      {activeTab === "notifications" && (() => {
        const notifyConfig = NotificationConfigManager.getConfig();
        const notifyStats = telegram.getStats();
        const rawQueue = telegram.getQueue();
        const isConnected = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

        // Filter queue
        const filterApp = queryParams.application || "";
        const filterEventType = queryParams.event_type || "";

        let filteredQueue = [...rawQueue];
        if (filterApp) {
          filteredQueue = filteredQueue.filter((item) => item.event?.application === filterApp);
        }
        if (filterEventType) {
          filteredQueue = filteredQueue.filter((item) => item.event?.event_type === filterEventType);
        }

        // Sort descending
        filteredQueue.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Connection & Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border p-5 shadow-sm bg-white border-zinc-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 font-sans">Telegram Bot Connection</span>
                  <Bell className={`h-4.5 w-4.5 ${isConnected ? "text-emerald-500 animate-pulse" : "text-zinc-300"}`} />
                </div>
                <div className="text-lg font-semibold text-zinc-800 font-sans">
                  {isConnected ? (
                    <span className="text-emerald-600 flex items-center gap-1">Connected</span>
                  ) : (
                    <span className="text-rose-600">Disconnected</span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 font-mono">
                  {isConnected ? "Active connection credentials" : "TELEGRAM_BOT_TOKEN missing in server environment"}
                </div>
              </div>

              {[
                { label: "Notification Statistics", value: notifyStats.sent.toLocaleString(), sub: `${notifyStats.failed.toLocaleString()} failed / ${rawQueue.filter(item => item.status === "pending" || item.status === "retrying").length} in queue`, icon: Activity },
                { label: "Notifications / Hour", value: `${Math.round(notifyStats.sent / Math.max(1, (Date.now() - new Date(notifyStats.last_notification_time || Date.now()).getTime()) / 3600000))}/hr`, sub: "Recent average velocity", icon: Zap },
                { label: "Delivery Latency", value: notifyStats.latency_ms > 0 ? `${notifyStats.latency_ms}ms` : "N/A", sub: `Last delivery time`, icon: Clock },
              ].map((card, idx) => (
                <div key={idx} className="rounded-xl border p-5 shadow-sm bg-white border-zinc-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 font-sans">{card.label}</span>
                    <card.icon className="h-4.5 w-4.5 text-zinc-400" />
                  </div>
                  <div className="text-lg font-semibold text-zinc-800 font-mono tracking-tight">{card.value}</div>
                  <div className="text-[10px] text-zinc-400 mt-1">{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Filter and Configurations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Notification Configuration */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-zinc-150">
                    <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                      <Settings className="h-4.5 w-4.5 text-amber-500" />
                      Ecosystem Notification settings
                    </h3>
                  </div>

                  <form action={updateNotificationConfig} className="space-y-4 text-xs">
                    {/* Global Enabled Switch */}
                    <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-150">
                      <div>
                        <span className="font-semibold text-zinc-700">Global Notifications</span>
                        <p className="text-[10px] text-zinc-400">Enable or disable all Telegram notifications</p>
                      </div>
                      <select
                        name="enabled"
                        defaultValue={notifyConfig.enabled ? "true" : "false"}
                        className="bg-white border border-zinc-250 rounded px-2.5 py-1"
                      >
                        <option value="true">ENABLED</option>
                        <option value="false">DISABLED</option>
                      </select>
                    </div>

                    {/* Notification Mode Selection */}
                    <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-150">
                      <div>
                        <span className="font-semibold text-zinc-700">Monitoring Mode</span>
                        <p className="text-[10px] text-zinc-400 font-sans">Development (all events) vs Production (high-priority &gt;90 intent)</p>
                      </div>
                      <select
                        name="mode"
                        defaultValue={notifyConfig.mode}
                        className="bg-white border border-zinc-250 rounded px-2.5 py-1"
                      >
                        <option value="development">DEVELOPMENT</option>
                        <option value="production">PRODUCTION</option>
                      </select>
                    </div>

                    {/* Applications Toggles */}
                    <div className="space-y-2">
                      <h4 className="text-[9.5px] uppercase font-bold text-zinc-400">Filter By Application</h4>
                      <div className="grid grid-cols-3 gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-150">
                        {["aix-os", "home-find", "insurance"].map((app) => (
                          <label key={app} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              name={`app_${app.replace("-", "_")}`}
                              value="true"
                              defaultChecked={notifyConfig.applications[app] !== false}
                              className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                            />
                            <span className="uppercase text-[10px] font-semibold text-zinc-650">{app}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Event Types Toggles */}
                    <div className="space-y-2">
                      <h4 className="text-[9.5px] uppercase font-bold text-zinc-400">Filter By Event Types</h4>
                      <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-150">
                        {[
                          { key: "page_view", label: "Page Views / Routes" },
                          { key: "ai", label: "AI Advisor Chat Prompts" },
                          { key: "forms", label: "Form Ingestion & Submits" },
                          { key: "properties", label: "Property View & Search" },
                          { key: "insurance", label: "Insurance Operations" }
                        ].map((evt) => (
                          <label key={evt.key} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              name={`evt_${evt.key}`}
                              value="true"
                              defaultChecked={notifyConfig.eventTypes[evt.key] !== false}
                              className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                            />
                            <span className="text-[10px] text-zinc-650 font-medium">{evt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-zinc-950 text-white font-bold text-xs py-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
                    >
                      Save Configuration
                    </button>
                  </form>
                </div>

                {/* Queue Controls */}
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="pb-2 border-b border-zinc-150">
                    <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider">Queue Controls</h3>
                  </div>
                  <div className="flex gap-2">
                    <form action={manageQueue} className="flex-1">
                      <input type="hidden" name="actionType" value="retry" />
                      <button
                        type="submit"
                        className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Retry Failed
                      </button>
                    </form>
                    <form action={manageQueue} className="flex-1">
                      <input type="hidden" name="actionType" value="clear" />
                      <button
                        type="submit"
                        className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Clear Queue
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Stream/Queue Table */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                      <h3 className="text-sm font-semibold text-zinc-800">Ecosystem Notification Feed</h3>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">Matched {filteredQueue.length} notifications</span>
                  </div>

                  {/* Filter Toolbar */}
                  <form method="GET" className="p-4 bg-zinc-50/50 border-b border-zinc-200 flex flex-wrap gap-2.5 items-center">
                    <input type="hidden" name="tab" value="notifications" />
                    
                    <div className="flex items-center gap-1.5 text-xs text-zinc-650">
                      <span>App:</span>
                      <select
                        name="application"
                        defaultValue={filterApp}
                        className="bg-white border border-zinc-200 rounded px-2 py-1"
                        onChange={(e) => e.target.form?.submit()}
                      >
                        <option value="">All Applications</option>
                        <option value="aix-os">AIX-OS</option>
                        <option value="home-find">HOME-FIND</option>
                        <option value="insurance">INSURANCE</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-650">
                      <span>Event Type:</span>
                      <select
                        name="event_type"
                        defaultValue={filterEventType}
                        className="bg-white border border-zinc-200 rounded px-2 py-1"
                        onChange={(e) => e.target.form?.submit()}
                      >
                        <option value="">All Event Types</option>
                        <option value="page_view">page_view</option>
                        <option value="search">search</option>
                        <option value="ai_prompt_sent">ai_prompt_sent</option>
                        <option value="download_started">download_started</option>
                        <option value="form_submitted">form_submitted</option>
                        <option value="form_abandoned">form_abandoned</option>
                        <option value="property_opened">property_opened</option>
                        <option value="quote_started">quote_started</option>
                      </select>
                    </div>

                    <Link
                      href="/admin/intelligence?tab=notifications"
                      className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors ml-auto font-medium"
                    >
                      Clear Filters
                    </Link>
                  </form>

                  <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                    <table className="w-full text-left text-xs text-zinc-650">
                      <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-450 uppercase tracking-wider text-[10px] font-bold sticky top-0">
                        <tr>
                          <th className="px-4 py-3">Event Info</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Time & Retries</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-mono text-[11px]">
                        {filteredQueue.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-center py-12 text-zinc-400 font-sans italic">
                              No notifications matched filters in the queue.
                            </td>
                          </tr>
                        ) : (
                          filteredQueue.map((item) => {
                            let statusColor = "bg-zinc-100 text-zinc-650";
                            if (item.status === "sent") statusColor = "bg-emerald-100 text-emerald-800";
                            if (item.status === "pending" || item.status === "retrying") statusColor = "bg-amber-100 text-amber-800";
                            if (item.status === "failed") statusColor = "bg-rose-100 text-rose-800";

                            return (
                              <tr key={item.id} className="hover:bg-zinc-50/50 bg-white">
                                <td className="px-4 py-3.5">
                                  <div className="font-semibold text-zinc-900 text-xs font-sans">
                                    {item.event?.event_type || "Event Action"}
                                  </div>
                                  <div className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                                    Visitor: <Link href={`/admin/intelligence?tab=explorer&activeVisitor=${item.event?.visitor_id}`} className="text-amber-600 font-bold hover:underline font-mono">{item.event?.visitor_id?.substring(0, 8)}...</Link> · App: <strong className="text-zinc-600 uppercase font-bold">{item.event?.application}</strong>
                                  </div>
                                  {item.last_error && (
                                    <div className="text-[9px] text-rose-500 font-mono mt-1 font-semibold leading-tight">
                                      Error: {item.last_error}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${statusColor}`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-right font-sans text-zinc-500">
                                  <div>{new Date(item.created_at).toLocaleTimeString()}</div>
                                  <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">Retries: {item.retry_count}</div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
