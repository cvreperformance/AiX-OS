"use client";

import { AdminTable } from "@/components/admin/table";
import { opportunities } from "@/lib/demo-data";
import { formatPrice } from "@/lib/format";

export default function AdminOpportunitiesPage() {
  const rows = opportunities.map((o) => ({
    ...o,
    min_investment: formatPrice(o.min_investment, o.currency),
    aix_score: o.aix_score?.toFixed(1) ?? "—",
  }));

  return (
    <AdminTable
      title="Oportunități"
      description="Gestionează oportunitățile investiționale"
      basePath="/proprietati"
      columns={[
        { key: "title", label: "Titlu" },
        { key: "opportunity_type", label: "Tip" },
        { key: "min_investment", label: "Investiție" },
        { key: "aix_score", label: "AiX Score" },
      ]}
      data={rows as unknown as Record<string, unknown>[]}
    />
  );
}
