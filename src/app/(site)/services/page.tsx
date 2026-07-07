import type { Metadata } from "next";
import ServicesDirectoryClient from "./ServicesDirectoryClient";

export const metadata: Metadata = {
  title: "Services Directory — Everything AiX OS™ Offers | AiX OS™",
  description:
    "Complete directory of all AiX OS™ services: AI advisory, real estate intelligence, investments, cybersecurity, luxury, law, education and more. Everything you need before making a six-figure decision.",
};

export default function ServicesDirectoryPage() {
  return <ServicesDirectoryClient />;
}
