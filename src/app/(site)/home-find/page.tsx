import { Metadata } from "next";
import HomeFindClientPage from "./HomeFindClientPage";

export const metadata: Metadata = {
  title: "Home Find | Direct Real Estate Access",
  description: "Find homes directly from owners and save on agent commissions with automated filtering on Home Find. Powered by AiX OS™.",
};

export default function HomeFindPage() {
  return <HomeFindClientPage />;
}
