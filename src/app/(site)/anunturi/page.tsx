import type { Metadata } from "next";
import { PageHeader, PropertyCard } from "@/components/ui";
import { getProperties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Proprietăți",
  description: "Proprietăți imobiliare evaluate cu AiX OS Score.",
};

export default async function AnunturiPage() {
  const properties = await getProperties();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Proprietăți"
        title="Imobiliare Evaluate"
        subtitle="Fiecare proprietate este analizată și evaluată cu sistemul proprietar AiX OS Score."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
