import type { Metadata } from "next";
import SitemapClientPage from "./SitemapClientPage";

export const metadata: Metadata = {
  title: "Sitemap — AiX OS",
  description:
    "Harta completă a site-ului AiX OS. Accesează rapid toate resursele, instrumentele și oportunitățile.",
  openGraph: {
    title: "Sitemap AiX OS",
    description: "Harta completă a sistemului decizional AiX OS.",
    type: "website",
  },
};

export default function SitemapPage() {
  return <SitemapClientPage />;
}
