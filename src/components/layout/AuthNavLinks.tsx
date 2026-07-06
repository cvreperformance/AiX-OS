"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/(auth)/actions";
import { User as UserIcon, LogOut, Shield } from "lucide-react";

export function AuthNavLinks() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    async function loadSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setProfile(null);
      } else {
        // reload profile if needed
        loadSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="w-16 h-8 animate-pulse bg-zinc-800/50 rounded-full" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400 transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        )}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 sm:px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400 transition-all shadow-sm whitespace-nowrap"
        >
          <UserIcon className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <button
          onClick={() => signout()}
          className="flex items-center justify-center rounded-full border border-zinc-700/50 hover:bg-zinc-800 px-2 py-1.5 text-zinc-400 hover:text-white transition-all shadow-sm"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href="/login"
        className="rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white px-2.5 sm:px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition-all whitespace-nowrap"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-amber-500 hover:bg-amber-400 px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-950 transition-all shadow-sm whitespace-nowrap"
      >
        Create Account
      </Link>
    </div>
  );
}
