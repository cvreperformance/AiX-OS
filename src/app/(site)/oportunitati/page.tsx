import type { Metadata } from "next";
import { OpportunityCard, PageHeader } from "@/components/ui";
import { getOpportunities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Oportunități Investiționale",
  description: "Oportunități verificate și evaluate cu AiX OS Score.",
};

export default async function OportunitatiPage() {
  const opportunities = await getOpportunities();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Oportunități"
        title="Investiții Verificate"
        subtitle="Off-market deals, dezvoltări și portofolii evaluate cu AiX OS Score."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((o) => (
          <OpportunityCard key={o.id} opportunity={o} />
        ))}
      </div>
    </div>
  );
}
