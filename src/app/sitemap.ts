import { MetadataRoute } from "next";
import { ALL_SERVICES_REGISTRY } from "@/config/services.config";

import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = "https://os.cristianvaduva.com";
  try {
    const headersList = await headers();
    const host = headersList.get("host") || headersList.get("x-forwarded-host");
    if (host) {
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      baseUrl = `${protocol}://${host}`;
    }
  } catch (e) {
    // ignore outside request context
  }

  // Get unique internal routes from service registry
  const internalRoutes = Array.from(
    new Set(
      ALL_SERVICES_REGISTRY.filter((s) => !s.external && s.href.startsWith("/"))
        .map((s) => s.href)
    )
  );

  // Add the root path
  const allPaths = ["", ...internalRoutes];

  const routes = allPaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
