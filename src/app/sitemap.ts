import { MetadataRoute } from "next";
import { ALL_SERVICES_REGISTRY } from "../config/services.config";
import { getProperties } from "../lib/data";

export const revalidate = 3600; // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://os.cristianvaduva.com";

  // 1. Core static public routes
  const staticPublicRoutes = [
    "",
    "/proprietati",
    "/stiri",
    "/technology",
    "/sitemap",
    "/services",
    "/buyer",
    "/seller",
    "/insurance",
    "/anti-teapa",
    "/valuation",
    "/aix-score",
    "/ai",
    "/market",
    "/convenience",
    "/compare",
    "/company-search",
    "/document-intelligence",
    "/private-wealth",
    "/home-find",
    "/videos",
    "/newsroom",
    "/yachts",
    "/private-jets",
    "/cars",
    "/concierge",
    "/privacy",
    "/cookie-policy",
    "/cybersecurity",
    "/romania-property-report",
    "/despre",
    "/contact",
    "/join",
    "/dezvoltatori",
    "/agentii",
    "/research",
    "/ecosystem",
    "/learning",
  ];

  // 2. Service registry public internal routes
  const serviceRoutes = ALL_SERVICES_REGISTRY
    .filter((s) => !s.external && s.href && s.href.startsWith("/"))
    .map((s) => s.href);

  // 3. Dynamic public property routes
  let propertyRoutes: string[] = [];
  try {
    const properties = await getProperties();
    propertyRoutes = properties
      .filter((p) => p.slug && p.status === "Published")
      .map((p) => `/proprietati/${p.slug}`);
  } catch (err) {
    console.error("[sitemap] Failed to fetch dynamic properties:", err);
  }

  // Combine and deduplicate
  const combined = Array.from(new Set([...staticPublicRoutes, ...serviceRoutes, ...propertyRoutes]));

  // Strict Exclusion list for private/internal/admin/auth/API routes
  const excludedPatterns = [
    /^\/admin(\/.*)?$/,
    /^\/dashboard(\/.*)?$/,
    /^\/workspace(\/.*)?$/,
    /^\/api(\/.*)?$/,
    /^\/login(\/.*)?$/,
    /^\/forgot-password(\/.*)?$/,
    /^\/reset-password(\/.*)?$/,
    /^\/brain(\/.*)?$/,
    /example\.com/,
    /localhost/,
  ];

  const validPublicRoutes = combined.filter((route) => {
    return !excludedPatterns.some((pattern) => pattern.test(route));
  });

  const now = new Date();

  return validPublicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : route.startsWith("/proprietati/") ? 0.8 : 0.7,
  }));
}
