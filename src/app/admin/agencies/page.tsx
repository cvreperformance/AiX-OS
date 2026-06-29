"use client";

import { AdminTable } from "@/components/admin/table";
import { agencies } from "@/lib/demo-data";

export default function AdminAgenciesPage() {
  const rows = agencies.map((a) => ({
    ...a,
    aix_score: a.aix_score?.toFixed(1) ?? "—",
  }));

  return (
    <AdminTable
      title="Agenții Imobiliare"
      description="Gestionează agențiile partenere"
      basePath="/agentii"
      columns={[
        { key: "name", label: "Nume" },
        { key: "city", label: "Oraș" },
        { key: "properties_count", label: "Proprietăți" },
        { key: "aix_score", label: "AiX Score" },
      ]}
      data={rows as unknown as Record<string, unknown>[]}
    />
  );
}
