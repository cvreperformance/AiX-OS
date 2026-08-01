export interface SessionMetrics {
  sessionId: string;
  visitorId: string;
  application: string;
  duration: number; // in minutes
  firstVisit: boolean;
  returningVisitor: boolean;
  country: string;
  city: string;
  device: string;
  browser: string;
  referrer: string;
  landingPage: string;
  exitPage: string;
  pagesViewed: number;
  propertiesViewed: number;
  propertiesOpened: number;
  repeatedPropertyViews: number;
  searches: number;
  filterChanges: number;
  guideDownloads: number;
  formsStarted: number;
  formsSubmitted: number;
  callbackRequests: number;
  buyerRequests: number;
  sellerRequests: number;
  insuranceQuotes: number;
  insuranceForms: number;
  aiQuestions: number;
  aiResponses: number;
  decisionGenerated: number;
  lastActivity: string;
}

export class SessionAggregator {
  public static aggregate(sessionEvents: any[], isReturningVisitor: boolean = false): SessionMetrics {
    if (!sessionEvents || sessionEvents.length === 0) {
      return this.getEmptyMetrics(isReturningVisitor);
    }

    const pages = new Set<string>();
    const properties = new Set<string>();
    const propertyViewCounts: Record<string, number> = {};

    let propertyOpens = 0;
    let searches = 0;
    let filterChanges = 0;
    let guideDownloads = 0;
    let formsStarted = 0;
    let formsSubmitted = 0;
    let callbackRequests = 0;
    let buyerRequests = 0;
    let sellerRequests = 0;
    let insuranceQuotes = 0;
    let insuranceForms = 0;
    let aiQuestions = 0;
    let aiResponses = 0;
    let decisionGenerated = 0;

    let country = "Romania";
    let city = "Bucharest";
    let device = "Desktop";
    let browser = "Chrome";
    let referrer = "Google";

    let landingPage = sessionEvents[0]?.page || "/";
    let exitPage = sessionEvents[sessionEvents.length - 1]?.page || "/";
    let minTime = Infinity;
    let maxTime = -Infinity;

    sessionEvents.forEach((e, idx) => {
      if (idx === 0 && e.page) landingPage = e.page;
      exitPage = e.page || exitPage;

      if (e.page) pages.add(e.page);
      if (e.country) country = e.country;
      if (e.metadata?.city) city = e.metadata.city;
      if (e.metadata?.device) device = e.metadata.device;
      if (e.metadata?.browser) browser = e.metadata.browser;
      if (e.metadata?.referrer) referrer = e.metadata.referrer;

      const type = (e.event_type || "").toLowerCase().trim().replace(/[ -]/g, "_");
      const payload = e.payload || {};
      const metadata = e.metadata || {};

      const propTitle = payload.property_title || metadata.property_title || payload.title;
      if (propTitle) {
        properties.add(propTitle);
        propertyViewCounts[propTitle] = (propertyViewCounts[propTitle] || 0) + 1;
        propertyOpens++;
      } else if (type.includes("property")) {
        propertyOpens++;
      }

      if (type.includes("search")) searches++;
      if (type.includes("filter")) filterChanges++;
      if (type.includes("download") || type.includes("guide")) guideDownloads++;
      if (type.includes("ai_prompt_sent") || type.includes("ai_interaction")) aiQuestions++;
      if (type.includes("ai_prompt_received")) aiResponses++;
      if (type.includes("decision")) decisionGenerated++;
      if (type.includes("form_start") || type.includes("contact_start")) formsStarted++;
      if (type.includes("form_submit") || type.includes("contact_submit")) formsSubmitted++;
      if (type.includes("callback")) callbackRequests++;
      if (type.includes("quote")) insuranceQuotes++;
      if (type.includes("insurance_form")) insuranceForms++;
      if (type.includes("buyer")) buyerRequests++;
      if (type.includes("seller")) sellerRequests++;

      const ts = new Date(e.timestamp || e.created_at || Date.now()).getTime();
      if (ts < minTime) minTime = ts;
      if (ts > maxTime) maxTime = ts;
    });

    let repeatedPropertyViews = 0;
    Object.values(propertyViewCounts).forEach((c) => {
      if (c > 1) repeatedPropertyViews += c - 1;
    });

    const durationMs = maxTime > minTime ? maxTime - minTime : 0;
    const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
    const firstEvt = sessionEvents[0];

    return {
      sessionId: firstEvt?.session_id || "session_unknown",
      visitorId: firstEvt?.visitor_id || "visitor_unknown",
      application: firstEvt?.application || "aix-os",
      duration: durationMinutes,
      firstVisit: !isReturningVisitor,
      returningVisitor: isReturningVisitor,
      country,
      city,
      device,
      browser,
      referrer,
      landingPage,
      exitPage,
      pagesViewed: Math.max(1, pages.size),
      propertiesViewed: properties.size || Math.min(propertyOpens, 1),
      propertiesOpened: propertyOpens,
      repeatedPropertyViews,
      searches,
      filterChanges,
      guideDownloads,
      formsStarted,
      formsSubmitted,
      callbackRequests,
      buyerRequests,
      sellerRequests,
      insuranceQuotes,
      insuranceForms,
      aiQuestions,
      aiResponses,
      decisionGenerated,
      lastActivity: new Date(maxTime > 0 ? maxTime : Date.now()).toISOString()
    };
  }

  private static getEmptyMetrics(isReturningVisitor: boolean): SessionMetrics {
    return {
      sessionId: "session_empty",
      visitorId: "visitor_empty",
      application: "aix-os",
      duration: 1,
      firstVisit: !isReturningVisitor,
      returningVisitor: isReturningVisitor,
      country: "Romania",
      city: "Bucharest",
      device: "Desktop",
      browser: "Chrome",
      referrer: "Google",
      landingPage: "/",
      exitPage: "/",
      pagesViewed: 1,
      propertiesViewed: 0,
      propertiesOpened: 0,
      repeatedPropertyViews: 0,
      searches: 0,
      filterChanges: 0,
      guideDownloads: 0,
      formsStarted: 0,
      formsSubmitted: 0,
      callbackRequests: 0,
      buyerRequests: 0,
      sellerRequests: 0,
      insuranceQuotes: 0,
      insuranceForms: 0,
      aiQuestions: 0,
      aiResponses: 0,
      decisionGenerated: 0,
      lastActivity: new Date().toISOString()
    };
  }
}
