import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează echipa AiX OS pentru consultații de investiții.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Contact"
        title="Hai să vorbim"
        subtitle="Consultații private pentru investitori, buyer representation și market intelligence."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: siteConfig.contact.email },
            { icon: Phone, label: "Telefon", value: siteConfig.contact.phone },
            { icon: MessageCircle, label: "Telegram", value: "AiX OS Market Pulse", href: siteConfig.contact.telegram },
            { icon: MapPin, label: "Locație", value: "București, România" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">{item.label}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:text-amber-400 transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-zinc-200">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-500">Nume</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/30"
              placeholder="Numele tău"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-500">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/30"
              placeholder="email@exemplu.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-500">Subiect</label>
            <select className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/30">
              <option>Consultație investiții</option>
              <option>Buyer Representation</option>
              <option>Oportunitate off-market</option>
              <option>Parteneriat / Agenție</option>
              <option>Altceva</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-zinc-500">Mesaj</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/30 resize-none"
              placeholder="Descrie ce cauți..."
            />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-amber-500/90 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all"
          >
            Trimite Mesaj
          </button>
          <p className="text-xs text-zinc-600 text-center">
            Formular demo — conectează Supabase sau email service pentru trimitere reală.
          </p>
        </form>
      </div>
    </div>
  );
}
