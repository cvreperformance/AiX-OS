import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Building2, UserPlus, Inbox, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure user is admin (Double check, even if middleware handles it)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch quick stats placeholders
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-light text-white">Admin Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            System overview and intelligence metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-zinc-400">Total Users</h3>
              <Users className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-light text-white">{usersCount || 0}</p>
          </div>

          {/* Properties */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-zinc-400">Total Properties</h3>
              <Building2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-light text-white">124</p>
          </div>

          {/* Leads */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-zinc-400">Total Leads</h3>
              <UserPlus className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-3xl font-light text-white">48</p>
          </div>

          {/* Requests */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-zinc-400">Contact Requests</h3>
              <Inbox className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-light text-white">12</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
           <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50 min-h-[300px] flex items-center justify-center">
             <div className="text-center">
                <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500">Activity Chart Placeholder</p>
             </div>
           </div>
           <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50 min-h-[300px] flex items-center justify-center">
             <div className="text-center">
                <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500">Recent Registrations Placeholder</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
