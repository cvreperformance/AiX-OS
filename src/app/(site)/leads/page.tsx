import type { Metadata } from "next";
import LeadsDashboard from "./LeadsDashboard";

export const metadata: Metadata = {
  title: "Internal Leads Control Center | AiX OS",
  description: "Monitor and manage user lead captures, verification parameters, and status queues in real-time.",
};

export default function LeadsPage() {
  return <LeadsDashboard />;
}
