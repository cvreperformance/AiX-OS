import type { Metadata } from "next";
import BrainClient from "./BrainClient";

export const metadata: Metadata = {
  title: "AiX Brain Central Router | AiX OS",
  description: "Interact with our multi-module cognitive intelligence router linking real estate, markets, and legal parameters.",
};

export default function BrainPage() {
  return <BrainClient />;
}
