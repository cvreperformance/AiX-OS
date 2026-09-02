import type { Metadata } from "next";
import SitemapClientPage from "./SitemapClientPage";

export const metadata: Metadata = {
  title: "Harta Site-ului (Sitemap)",
  description:
    "Harta completă a site-ului AiX OS™. Accesează rapid toate resursele, instrumentele și oportunitățile.",
  alternates: {
    canonical: "https://os.cristianvaduva.com/sitemap",
  },
  openGraph: {
    title: "Harta Site-ului (Sitemap) | AiX OS™",
    description: "Harta completă a sistemului decizional AiX OS™.",
    url: "https://os.cristianvaduva.com/sitemap",
    siteName: "AiX OS™",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harta Site-ului (Sitemap) | AiX OS™",
    description: "Harta completă a sistemului decizional AiX OS™.",
  },
};

export default function SitemapPage() {
  return <SitemapClientPage />;
}
