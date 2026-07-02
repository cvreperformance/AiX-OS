import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aix-os.com";
  
  const routes = [
    "",
    "/proprietati",
    "/market",
    "/wealth",
    "/ai",
    "/luxury",
    "/services",
    "/despre",
    "/contact",
    "/agentii",
    "/stiri",
    "/buyer",
    "/seller",
    "/insurance",
    "/investments",
    "/private-jets",
    "/cars",
    "/yachts",
    "/network",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
