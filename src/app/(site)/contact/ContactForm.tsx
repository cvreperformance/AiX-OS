"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const SUBJECTS = [
  "Consultație investiții",
  "Buyer Representation",
  "Seller Representation / Evaluare",
  "Asigurare locuință / viață",
  "AntiȚeapă — verificare proprietate",
  "Oportunitate off-market",
  "Luxury Concierge",
  "Rețea privată / Networking",
  "Parteneriat / Agenție",
  "Altceva",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    budget: "",
    message: "",
  });

  function update(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    // POST to /api/leads — stores in Supabase or logs to server console
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          subject: formData.subject,
          budget: formData.budget || undefined,
          message: formData.message || undefined,
          source: "contact-form",
          page: "/contact",
        }),
      });
      if (!res.ok) throw new Error("API error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all";

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-12 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-light text-white">Mesaj trimis cu succes!</h3>
        <p className="text-zinc-400">
          Te vom contacta în maxim 24h. Dacă e urgent, folosește WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFormData({ name: "", email: "", phone: "", subject: "", budget: "", message: "" });
          }}
          className="text-sm text-amber-500/80 hover:text-amber-400 transition-colors"
        >
          Trimite alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-zinc-500">
            Nume <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Prenumele tău"
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-zinc-500">
            Telefon <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+40 7XX XXX XXX"
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-zinc-500">Email</label>
        <input
          type="email"
          placeholder="email@exemplu.com"
          value={formData.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-zinc-500">
          Subiect <span className="text-red-400">*</span>
        </label>
        <select
          required
          value={formData.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={inputClass}
        >
          <option value="">Selectează subiectul…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-zinc-500">
          Budget estimat (optional)
        </label>
        <select
          value={formData.budget}
          onChange={(e) => update("budget", e.target.value)}
          className={inputClass}
        >
          <option value="">Selectează intervalul…</option>
          <option>Sub €50,000</option>
          <option>€50,000 — €100,000</option>
          <option>€100,000 — €250,000</option>
          <option>€250,000 — €500,000</option>
          <option>€500,000 — €1,000,000</option>
          <option>Peste €1,000,000</option>
          <option>Prefer să nu specific</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-zinc-500">Mesaj</label>
        <textarea
          rows={4}
          placeholder="Descrie ce cauți, ce obiective ai sau orice altceva relevant…"
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          A apărut o eroare. Încearcă din nou sau folosește WhatsApp.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-amber-500/90 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Se trimite…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Trimite Mesaj
          </>
        )}
      </button>

      <p className="text-xs text-zinc-600 text-center">
        Răspundem în maxim 24h. Datele tale sunt confidențiale.
      </p>
    </form>
  );
}
