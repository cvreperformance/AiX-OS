"use client";

import { AdminTable } from "@/components/admin/table";
import { developers } from "@/lib/demo-data";

export default function AdminDevelopersPage() {
  const rows = developers.map((d) => ({
    ...d,
    aix_score: d.aix_score?.toFixed(1) ?? "—",
  }));

  return (
    <AdminTable
      title="Dezvoltatori"
      description="Gestionează dezvoltatorii imobiliari"
      basePath="/dezvoltatori"
      columns={[
        { key: "name", label: "Nume" },
        { key: "city", label: "Oraș" },
        { key: "projects_count", label: "Proiecte" },
        { key: "aix_score", label: "AiX Score" },
      ]}
      data={rows as unknown as Record<string, unknown>[]}
    />
  );
}
