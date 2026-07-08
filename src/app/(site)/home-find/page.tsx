import { Metadata } from "next";
import HomeFindClientPage from "./HomeFindClientPage";

export const metadata: Metadata = {
  title: "Home Find | Premium Real Estate Platform",
  description: "Home Find is a premium international AI-powered real estate platform. Powered by AiX OS™.",
};

export default function HomeFindPage() {
  return <HomeFindClientPage />;
}
