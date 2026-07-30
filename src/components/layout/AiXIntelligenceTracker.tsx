"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { aix } from "@/lib/aix-sdk";

export function AiXIntelligenceTracker() {
  const pathname = usePathname();
  const lastPathname = useRef<string | null>(null);
  
  // Ref tracking time on current page
  const pageStartTime = useRef<number>(Date.now());

  // Ref tracking scroll depth states (boolean flags to prevent duplicate sends per page view)
  const scrollMilestones = useRef<{ [key: number]: boolean }>({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  // Ref tracking currently active form state for form abandonment metrics
  const activeFormId = useRef<string | null>(null);
  const activeFormSubmitted = useRef<boolean>(false);

  // Initialize SDK and track app startup once
  useEffect(() => {
    let environment: "local" | "preview" | "production" = "production";
    try {
      const hostname = window.location.hostname;
      if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
        environment = "local";
      } else if (hostname.includes("vercel.app") || hostname.includes("preview")) {
        environment = "preview";
      }
    } catch (e) {}

    aix.init({
      application: "aix-os",
      environment,
      enabled: true,
      samplingRate: 1.0,
    });

    aix.trackAppStart();
  }, []);

  // Track page transitions, view durations, and routing events
  useEffect(() => {
    if (!pathname) return;

    // Send page_leave for previous page before setting up the new one
    if (lastPathname.current && lastPathname.current !== pathname) {
      const timeSpent = Date.now() - pageStartTime.current;
      aix.trackPageLeave(timeSpent);

      // Trigger Form Abandonment if a form was started on the previous page
      if (activeFormId.current && !activeFormSubmitted.current) {
        aix.trackForm("abandoned", activeFormId.current);
      }

      // Track routing transition
      aix.track("route_change", {}, {
        from: lastPathname.current,
        to: pathname,
      });

      aix.track("internal_navigation", {}, {
        from: lastPathname.current,
        to: pathname,
      });
    }

    // Reset markers for the new page view
    pageStartTime.current = Date.now();
    lastPathname.current = pathname;
    scrollMilestones.current = { 25: false, 50: false, 75: false, 100: false };
    activeFormId.current = null;
    activeFormSubmitted.current = false;

    // Trigger page_view
    try {
      aix.track("page_view", {
        title: typeof document !== "undefined" ? document.title : "",
      });
    } catch (e) {}

    // Contextual patterns (Milestone 2 specific metrics derived from URL context)
    try {
      // 1. Property views
      if (pathname.startsWith("/proprietati/") && pathname !== "/proprietati") {
        const parts = pathname.split("/");
        const slug = parts[parts.length - 1];
        aix.trackPropertyAction("opened", slug);
      }

      // 2. Dashboards / Admin Command Centers
      if (pathname === "/admin" || pathname.startsWith("/dashboard") || pathname.startsWith("/workspace")) {
        aix.track("dashboard_opened", {}, { path: pathname });
      }

      // 3. Sub-modules inside dashboards
      if (pathname.includes("/workspace/crm") || pathname.includes("/admin/properties") || pathname.includes("/admin/news")) {
        const parts = pathname.split("/");
        const moduleName = parts.slice(2).join("/");
        aix.track("dashboard_module_opened", {}, { module: moduleName });
      }
    } catch (e) {}
  }, [pathname]);

  // Track page leave/durations when browser tab is closed/hidden
  useEffect(() => {
    const handleVisibilityOrUnload = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        const timeSpent = Date.now() - pageStartTime.current;
        aix.trackPageLeave(timeSpent);
        
        if (activeFormId.current && !activeFormSubmitted.current) {
          aix.trackForm("abandoned", activeFormId.current);
          activeFormId.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrUnload);
    window.addEventListener("pagehide", handleVisibilityOrUnload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrUnload);
      window.removeEventListener("pagehide", handleVisibilityOrUnload);
    };
  }, []);

  // Throttled Scroll Depth Telemetry Interceptor (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    let throttleTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (throttleTimeout) return;

      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;

        try {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;
          
          const totalScrollable = scrollHeight - clientHeight;
          if (totalScrollable <= 0) return;

          const percentage = Math.round((scrollTop / totalScrollable) * 100);

          [25, 50, 75, 100].forEach((milestone) => {
            if (percentage >= milestone && !scrollMilestones.current[milestone]) {
              scrollMilestones.current[milestone] = true;
              aix.trackScrollDepth(milestone);
            }
          });
        } catch (e) {}
      }, 250); // Evaluate every 250ms
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, []);

  // Passive click tracker for Outbound links, Downloads, Button engagements, and Search clicks
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleGlobalClicks = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement;
        const clickable = target.closest("a, button, [role='button']");
        if (!clickable) return;

        const tagName = clickable.tagName.toLowerCase();
        const elementText = clickable.textContent?.trim().substring(0, 80) || "";
        const href = clickable.getAttribute("href") || clickable.getAttribute("data-href");
        const elementId = clickable.id || clickable.getAttribute("name") || "";

        // 1. Generic Button Click tracking
        if (tagName === "button" || clickable.getAttribute("role") === "button") {
          aix.track("button_clicked", {}, {
            id: elementId || undefined,
            text: elementText,
          });
        }

        if (tagName === "a" && href) {
          // 2. Outbound Link click tracking
          const isOutbound = href.startsWith("http") && !href.includes(window.location.hostname);
          if (isOutbound) {
            aix.track("outbound_link_click", {}, {
              url: href,
              text: elementText,
            });
          }

          // 3. Download tracking (.pdf, .zip, etc or elements with 'download' attribute)
          const isDownload = clickable.hasAttribute("download") || 
            /\.(pdf|zip|xlsx|xls|csv|docx|doc)$/i.test(href.split("?")[0]);
          if (isDownload) {
            aix.track("download_started", {}, { url: href, filename: elementText });
            // Simulate completion telemetry passively
            setTimeout(() => {
              aix.track("download_completed", {}, { url: href });
            }, 1000);
          }

          // 4. Search result links click tracking
          if (href.includes("/proprietati/") && (pathname.includes("/proprietati") || pathname.includes("/search"))) {
            aix.trackSearchClick(pathname, href.split("/").pop() || href);
          }
        }
      } catch (err) {}
    };

    document.addEventListener("click", handleGlobalClicks, { passive: true });
    return () => {
      document.removeEventListener("click", handleGlobalClicks);
    };
  }, [pathname]);

  // Form Interactions Telemetry (started, abandoned, submitted)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleFocusIn = (event: FocusEvent) => {
      try {
        const target = event.target as HTMLElement;
        if (!target) return;

        const form = target.closest("form");
        if (!form) return;

        const formId = form.id || form.getAttribute("name") || "anonymous_form";

        // Mark form as started if new
        if (activeFormId.current !== formId) {
          activeFormId.current = formId;
          activeFormSubmitted.current = false;
          aix.trackForm("started", formId);
        }
      } catch (e) {}
    };

    const handleFormSubmit = (event: SubmitEvent) => {
      try {
        const form = event.target as HTMLFormElement;
        if (!form) return;

        const formId = form.id || form.getAttribute("name") || "anonymous_form";
        activeFormSubmitted.current = true;
        aix.trackForm("submitted", formId);
      } catch (e) {}
    };

    document.addEventListener("focusin", handleFocusIn, { passive: true });
    document.addEventListener("submit", handleFormSubmit, { passive: true });

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, []);

  // Global Exception & Rejection Interceptor (Error Event Telemetry)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRuntimeError = (event: ErrorEvent) => {
      try {
        aix.trackError(event.message, event.filename + ":" + event.lineno);
      } catch (e) {}
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      try {
        aix.trackError(
          event.reason?.message || "Promise Rejection Error",
          event.reason?.stack || ""
        );
      } catch (e) {}
    };

    window.addEventListener("error", handleRuntimeError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.removeEventListener("error", handleRuntimeError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  return null;
}
export default AiXIntelligenceTracker;
