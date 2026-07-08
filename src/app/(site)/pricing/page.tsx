import type { Metadata } from "next";
import PricingClientPage from "./PricingClientPage";

export const metadata: Metadata = {
  title: "Pricing & Access | AiX OS™ Ecosystem",
  description: "Complete monetization and pricing ecosystem for AiX OS, Home Find, and the complete luxury real estate and digital presence ecosystem.",
};

export default function PricingPage() {
  return <PricingClientPage />;
}
