"use client";

import { AdminTable } from "@/components/admin/table";
import { newsArticles } from "@/lib/demo-data";

export default function AdminNewsPage() {
  const rows = newsArticles.map((a) => ({
    ...a,
    aix_score: a.aix_score?.toFixed(1) ?? "—",
  }));

  return (
    <AdminTable
      title="Market Pulse"
      description="Gestionează articolele de știri analizate"
      basePath="/stiri"
      columns={[
        { key: "title", label: "Titlu" },
        { key: "category", label: "Categorie" },
        { key: "aix_score", label: "AiX Score" },
        { key: "status", label: "Status" },
      ]}
      data={rows as unknown as Record<string, unknown>[]}
    />
  );
}
