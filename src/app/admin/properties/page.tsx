"use client";

import { AdminTable } from "@/components/admin/table";
import { properties } from "@/lib/demo-data";
import { formatPrice } from "@/lib/format";

export default function AdminPropertiesPage() {
  const rows = properties.map((p) => ({
    ...p,
    price: formatPrice(p.price, p.currency),
    aix_score: p.aix_score?.toFixed(1) ?? "—",
  }));

  return (
    <AdminTable
      title="Proprietăți"
      description="Gestionează anunțurile imobiliare"
      basePath="/anunturi"
      columns={[
        { key: "title", label: "Titlu" },
        { key: "location", label: "Locație" },
        { key: "price", label: "Preț" },
        { key: "aix_score", label: "AiX Score" },
        { key: "status", label: "Status" },
      ]}
      data={rows as unknown as Record<string, unknown>[]}
    />
  );
}
