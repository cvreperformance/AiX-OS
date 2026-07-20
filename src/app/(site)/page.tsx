import { getFeaturedProperties, getFeaturedNews, getEcosystemStats } from "@/lib/data";
import HomeClientPage from "./HomeClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AiX OS™ — See market changes faster and make better decisions",
  description:
    "Evaluează dacă o proprietate își merită prețul înainte de a cumpăra. Monitorizare în timp real, calculatoare de yield, analiză cadastrală și asistență.",
};

export default async function HomePage() {
  const [featuredProperties, featuredNews, stats] = await Promise.all([
    getFeaturedProperties(),
    getFeaturedNews(2),
    getEcosystemStats(),
  ]);

  return (
    <HomeClientPage
      featuredProperties={featuredProperties}
      featuredNews={featuredNews}
      stats={stats}
    />
  );
}
