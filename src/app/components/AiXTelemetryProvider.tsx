"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAiXIntelligence, aix } from "@aix/intelligence-sdk";

export default function AiXTelemetryProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  // Initialize once
  useEffect(() => {
    if (!isInitialized.current) {
      initAiXIntelligence({
        application: "aix-os",
        apiKey: "aix-os-default-api-key-key-value",
        apiUrl: "/api/aix-intelligence/v1/ingest",
        environment: "production",
        debug: false,
      });
      isInitialized.current = true;
    }

    // Listen to custom login events
    const handleAuthEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { status, details } = customEvent.detail || {};
      if (status === "success") {
        aix.track("login_success", {}, details || {});
      } else {
        aix.track("login_failure", {}, details || {});
      }
    };

    window.addEventListener("aix:auth", handleAuthEvent);
    return () => {
      window.removeEventListener("aix:auth", handleAuthEvent);
    };
  }, []);

  // Track page view and routes/tabs changes
  useEffect(() => {
    if (!isInitialized.current) return;

    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    aix.trackPage(fullPath);

    // Track dashboard_view
    if (pathname === "/dashboard" || pathname === "/admin/intelligence") {
      aix.track("dashboard_view", {}, { path: fullPath });
    }

    // Track intelligence_query_executed
    if (pathname === "/admin/intelligence" && searchParams.get("queryText")) {
      aix.track("intelligence_query_executed", {}, {
        query: searchParams.get("queryText") || "",
      });
    }

    // Track visitor profile opened and knowledge profile viewed
    if (searchParams.get("activeVisitor")) {
      aix.track("visitor_profile_opened", {}, { visitor_id: searchParams.get("activeVisitor") || "" });
      aix.track("knowledge_profile_viewed", {}, { visitor_id: searchParams.get("activeVisitor") || "" });
    }

    // Track visitor explorer searches
    if (
      pathname === "/admin/intelligence" &&
      searchParams.get("tab") === "explorer" &&
      (searchParams.get("visitor_id") || searchParams.get("session_id") || searchParams.get("page"))
    ) {
      aix.track("visitor_search", {}, {
        filter_visitor_id: searchParams.get("visitor_id") || "",
        filter_session_id: searchParams.get("session_id") || "",
        filter_page: searchParams.get("page") || "",
      });
    }
  }, [pathname, searchParams]);

  return null;
}
