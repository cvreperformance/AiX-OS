import { getFeaturedProperties, getFeaturedNews } from "@/lib/data";
import HomeClientPage from "./HomeClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AiX OS — Know what is worth buying before everyone else.",
  description:
    "Economisește timp, bani și elimină riscul din tranzacțiile imobiliare. Analiză cadastrală AI, calculatoare financiare și asistență juridică.",
};

export default async function HomePage() {
  const [featuredProperties, featuredNews] = await Promise.all([
    getFeaturedProperties(),
    getFeaturedNews(2),
  ]);

  return <HomeClientPage featuredProperties={featuredProperties} featuredNews={featuredNews} />;
}
