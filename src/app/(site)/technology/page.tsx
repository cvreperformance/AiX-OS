import type { Metadata } from "next";
import TechnologyClient from "./TechnologyClient";

export const metadata: Metadata = {
  title: "Technology & Developer Hub",
  description:
    "Explore recommended developer tools, automation stacks, open source applications, cybersecurity practices, and AI resources.",
  alternates: {
    canonical: "https://os.cristianvaduva.com/technology",
  },
  openGraph: {
    title: "Technology & Developer Hub",
    description:
      "Explore recommended developer tools, automation stacks, open source applications, cybersecurity practices, and AI resources.",
    url: "https://os.cristianvaduva.com/technology",
    siteName: "AiX OS™",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technology & Developer Hub",
    description:
      "Explore recommended developer tools, automation stacks, open source applications, cybersecurity practices, and AI resources.",
  },
};

export default function TechnologyPage() {
  return <TechnologyClient />;
}
