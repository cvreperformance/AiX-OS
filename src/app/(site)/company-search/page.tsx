import type { Metadata } from "next";
import CompanySearchClient from "./CompanySearchClient";

export const metadata: Metadata = {
  title: "Business Lookup & Registries Hub | AiX OS",
  description:
    "Direct links and tools to look up business indicators, shareholders, VAT status, and registry records in Romania and Europe.",
};

export default function CompanySearchPage() {
  return <CompanySearchClient />;
}
