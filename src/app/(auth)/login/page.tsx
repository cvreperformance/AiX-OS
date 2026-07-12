"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { login } from "../actions";
import { Brain, Home, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-50/80 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200/50 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/10 blur-[80px] pointer-events-none" />

        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-all z-10"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>

        <div className="relative text-center">
          <Brain className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-6 text-3xl font-light text-zinc-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to access your intelligence dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="sr-only">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-zinc-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center border-t border-zinc-200/50 pt-6 mt-6">
          <p className="text-sm font-medium text-zinc-900 mb-1">Need access?</p>
          <p className="text-sm text-zinc-500 mb-4">Contact us to request platform access.</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}
