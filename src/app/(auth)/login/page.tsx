"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "../actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please fill in email and password.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: authData, error: clientAuthError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (clientAuthError) {
        setError(clientAuthError.message);
        window.dispatchEvent(new CustomEvent("aix:auth", { detail: { status: "failure", details: { email, error: clientAuthError.message } } }));
        setLoading(false);
        return;
      }

      window.dispatchEvent(new CustomEvent("aix:auth", { detail: { status: "success", details: { email } } }));

      try {
        await login(formData);
      } catch (err: any) {
        if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
          return;
        }
      }

      if (authData?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard/properties");
        }
        router.refresh();
      }
    } catch (err: any) {
      if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
        return;
      }
      setError(err?.message || "An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-50/80 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200/50 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-zinc-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 text-white font-bold text-xl mb-4 shadow-lg shadow-zinc-900/10">
            A
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Autentificare AiX OS
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Introduceți datele pentru a vă conecta la contul dvs.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-700 text-sm p-4 rounded-2xl animate-shake">
            {error}
          </div>
        )}

        <form method="POST" onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2"
              >
                Adresă Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="testadmin.aixos@gmail.com"
                className="w-full px-4 py-3 bg-white/50 border border-zinc-200 rounded-2xl text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
                placeholder="nume@exemplu.ro"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider"
                >
                  Parolă
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Ai uitat parola?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue="TestAdmin123456!"
                className="w-full px-4 py-3 bg-white/50 border border-zinc-200 rounded-2xl text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-2xl shadow-lg shadow-zinc-900/10 hover:shadow-zinc-900/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Se autentifică...</span>
                </>
              ) : (
                "Intră în cont"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-zinc-500 pt-4 border-t border-zinc-200/50">
          Nu ai un cont?{" "}
          <Link
            href="/join"
            className="font-semibold text-zinc-900 hover:underline transition-all"
          >
            Înregistrează-te
          </Link>
        </div>
      </div>
    </div>
  );
}
