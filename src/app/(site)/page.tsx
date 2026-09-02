import { getFeaturedProperties, getFeaturedNews, getEcosystemStats } from "@/lib/data";
import HomeClientPage from "./HomeClientPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "AiX OS™ — See market changes faster and make better decisions",
  },
  description:
    "Evaluează dacă o proprietate își merită prețul înainte de a cumpăra. Monitorizare în timp real, calculatoare de yield, analiză cadastrală și asistență.",
  alternates: {
    canonical: "https://os.cristianvaduva.com",
  },
  openGraph: {
    title: "AiX OS™ — See market changes faster and make better decisions",
    description:
      "Evaluează dacă o proprietate își merită prețul înainte de a cumpăra. Monitorizare în timp real, calculatoare de yield, analiză cadastrală și asistență.",
    url: "https://os.cristianvaduva.com",
    siteName: "AiX OS™",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiX OS™ — See market changes faster and make better decisions",
    description:
      "Evaluează dacă o proprietate își merită prețul înainte de a cumpăra. Monitorizare în timp real, calculatoare de yield, analiză cadastrală și asistență.",
  },
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
