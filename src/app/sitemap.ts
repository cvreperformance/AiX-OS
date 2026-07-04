import { MetadataRoute } from "next";
import { ALL_SERVICES_REGISTRY } from "@/config/services.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aixos.ro";

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
