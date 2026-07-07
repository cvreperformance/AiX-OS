import type { Metadata } from "next";
import TechnologyClient from "./TechnologyClient";

export const metadata: Metadata = {
  title: "Technology & Developer Hub | AiX OS™",
  description:
    "Explore recommended developer tools, automation stacks, open source applications, cybersecurity practices, and AI resources.",
};

export default function TechnologyPage() {
  return <TechnologyClient />;
}
