import type { Metadata } from "next";
import ComparisonCenter from "./ComparisonCenter";

export const metadata: Metadata = {
  title: "Multi-Asset Comparison Center | AiX OS",
  description: "Compare properties, developers, luxury assets, equities, and insurance parameters side-by-side.",
};

export default function ComparePage() {
  return <ComparisonCenter />;
}
