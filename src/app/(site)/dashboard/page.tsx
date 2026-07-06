import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Settings, Bookmark, FileText, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Control Center & Favorites | AiX OS",
  description: "Manage your bookmarked properties, developers, reading materials, searches, and recently viewed intelligence reports.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-light text-white">Your Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            Welcome back, {profile?.full_name || user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <User className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-white">Profile</h3>
                <p className="text-sm text-zinc-400">Manage account</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Update your personal details and preferences.
            </p>
            <button className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              Edit Profile &rarr;
            </button>
          </div>

          {/* Saved Properties */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="font-medium text-white">Saved Properties</h3>
                <p className="text-sm text-zinc-400">0 properties</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Properties you have bookmarked for later.
            </p>
            <button className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              View Favorites &rarr;
            </button>
          </div>

          {/* Forms */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-white">Your Requests</h3>
                <p className="text-sm text-zinc-400">0 requests</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Track the status of your submitted forms.
            </p>
            <button className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              View Status &rarr;
            </button>
          </div>

          {/* Searches */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <h3 className="font-medium text-white">Saved Searches</h3>
                <p className="text-sm text-zinc-400">0 alerts</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Manage your active market alerts and searches.
            </p>
            <button className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              Manage Alerts &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
