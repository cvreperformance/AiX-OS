import type { Metadata } from "next";
import DocIntelClient from "./DocIntelClient";

export const metadata: Metadata = {
  title: "Document Cognitive Intelligence | AiX OS™",
  description: "Securely upload PDF, DOCX, or images for immediate OCR analysis, legal summaries, and transaction risk auditing.",
};

export default function DocIntelPage() {
  return <DocIntelClient />;
}
