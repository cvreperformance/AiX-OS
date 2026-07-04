import type { Metadata } from "next";
import WealthClient from "./WealthClient";

export const metadata: Metadata = {
  title: "Private Wealth Manager & Dashboard | AiX OS",
  description:
    "Real-time asset allocator, global macroeconomic trackers, BNR indicators, index rates, and investment resources.",
};

export default function WealthPage() {
  return <WealthClient />;
}
