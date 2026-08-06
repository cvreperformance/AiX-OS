"use client";

import { AdminTable } from "@/components/admin/table";
// Demo data imports removed for production
const properties: any[] = []; // placeholder array with explicit any[] type
import { formatPrice } from "@/lib/format";

export default function AdminPropertiesPage() {
  const rows = properties.map((p) => ({
    ...p,
    price: formatPrice(p.price, p.currency),
    aix_score: p.aix_score?.toFixed(1) ?? "—",
    video_tour: p.video_url ? `✓ ${p.video_provider || "Video"}` : "—",
  }));

  return (
    <AdminTable
      title="Proprietăți"
      description="Gestionează anunțurile imobiliare"
      basePath="/proprietati"
      columns={[
        { key: "title", label: "Titlu" },
        { key: "location", label: "Locație" },
        { key: "price", label: "Preț" },
        { key: "aix_score", label: "AiX Score" },
        { key: "video_tour", label: "Tur Video" },
        { key: "status", label: "Status" },
      ]}
      data={rows as unknown as Record<string, unknown>[]}
    />
  );
}
