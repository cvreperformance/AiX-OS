import type { Metadata } from "next";
import PricingClientPage from "./PricingClientPage";

export const metadata: Metadata = {
  title: "Pricing & Access | AiX OS™ Ecosystem",
  description: "Find the right tier to start listing properties, tracking price trends, and managing your real estate portfolio from one place.",
};

export default function PricingPage() {
  return <PricingClientPage />;
}
