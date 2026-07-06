import type { Metadata } from "next";
import UserDashboard from "./UserDashboard";

export const metadata: Metadata = {
  title: "My Control Center & Favorites | AiX OS",
  description: "Manage your bookmarked properties, developers, reading materials, searches, and recently viewed intelligence reports.",
};

export default function DashboardPage() {
  return <UserDashboard />;
}
