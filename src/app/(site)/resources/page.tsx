import type { Metadata } from "next";
import ResourcesClient from "./ResourcesClient";

export const metadata: Metadata = {
  title: "Public Registries & Resources Hub | AiX OS",
  description:
    "Direct links and outcome explanations for critical Romanian and European public registries. ANCPI, ONRC, ANAF, Eurostat, ECB and PMB Urbanism.",
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
