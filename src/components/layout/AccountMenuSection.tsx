"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/(auth)/actions";
import { User, LogIn, UserPlus, LogOut, LayoutDashboard, Shield } from "lucide-react";

export function AccountMenuSection({ language }: { language: string }) {
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
      if (!session) setProfile(null);
      else loadSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
        <User className="h-4.5 w-4.5 text-zinc-400" />
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 font-mono">
          {language === "ro" ? "Cont" : "Account"}
        </h4>
      </div>
      <ul className="space-y-2.5">
        {loading ? (
          <li><span className="text-xs text-zinc-600 block">Loading...</span></li>
        ) : session ? (
          <>
            {profile?.role === "admin" && (
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-all font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {language === "ro" ? "Panou Admin" : "Admin Panel"}
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-xs text-amber-500 hover:text-amber-400 transition-all font-medium"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {language === "ro" ? "Dashboard" : "Dashboard"}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-all font-medium"
              >
                <User className="w-3.5 h-3.5" />
                {language === "ro" ? "Profil" : "Profile"}
              </Link>
            </li>
            <li>
              <button
                onClick={() => signout()}
                className="flex w-full items-center gap-2 text-xs text-zinc-500 hover:text-rose-400 transition-all font-medium text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                {language === "ro" ? "Deconectare" : "Sign Out"}
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href="/register"
                className="flex items-center gap-2 text-xs text-amber-500 hover:text-amber-400 transition-all font-bold"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {language === "ro" ? "Creare Cont" : "Create Account"}
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-all font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                {language === "ro" ? "Autentificare" : "Login"}
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
