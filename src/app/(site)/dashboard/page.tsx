import { createClient } from "@/lib/supabase/server";
import UserDashboard from "./UserDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AiX OS™ Command Center | Live Intelligence Terminal",
  description: "Real-time AI activity, real estate intelligence, investment signals, and verified luxury opportunities.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Try to retrieve user session to enable authenticated controls
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = data;
    } catch (e) {
      console.warn("Could not query user profile details", e);
    }
  }

  return <UserDashboard user={user} profile={profile} />;
}
