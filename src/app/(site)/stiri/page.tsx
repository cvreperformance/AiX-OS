import type { Metadata } from "next";
import { NewsCard, PageHeader } from "@/components/ui";
import { getNews } from "@/lib/data";

export const metadata: Metadata = {
  title: "Market Pulse",
  description: "Știri analizate și evaluate cu AiX OS Score. Intelligence, not news.",
};

export default async function StiriPage() {
  const news = await getNews();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Market Pulse"
        title="Intelligence, Not News"
        subtitle="Fiecare articol răspunde la întrebarea: De ce ar trebui să pese unui investitor?"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((a) => (
          <NewsCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
