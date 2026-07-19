// src/app/(site)/results/page.tsx

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Results – AiX OS",
  description: "Proof of how buyers, sellers and investors benefit from the AiX ecosystem.",
};

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 py-12 overflow-x-hidden">
      {/* Hero */}
      <section id="hero" className="text-center py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-gold">
          Real Results.<br />Real Decisions.<br />Real People.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          See how buyers, sellers and investors make better decisions using the AiX ecosystem.
        </p>
        <Link href="/home-find" className="inline-block mt-4 px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors">
          See real results →
        </Link>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Case Studies</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6 text-center">
            <p className="text-gray-500 italic">Verified case study coming soon.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-500 italic">Verified case study coming soon.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-500 italic">Verified case study coming soon.</p>
          </div>
        </div>
      </section>

      {/* Negotiation Stories */}
      <section id="negotiation-stories" className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Negotiation Stories</h2>
        <ul className="list-disc list-inside space-y-3 text-lg text-gray-300">
          <li>Buyer avoided overpaying on a luxury villa.</li>
          <li>Seller received multiple offers for a historic manor.</li>
          <li>Investor identified a high‑potential opportunity before public listing.</li>
          <li>Insurance prevented a costly loss after a flood event.</li>
        </ul>
      </section>

      {/* Results Dashboard */}
      <section id="results-dashboard" className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Results Dashboard</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6 text-center">
            <p className="text-gray-500 italic">Live metrics coming soon.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-500 italic">Live metrics coming soon.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-500 italic">Live metrics coming soon.</p>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section id="how-we-help" className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">How We Help</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex-1 text-center">
            <h3 className="text-xl font-semibold mb-2">Problem</h3>
            <p className="text-gray-400">Hidden fees and opaque listings.</p>
          </div>
          <div className="text-2xl text-gray-600">→</div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-semibold mb-2">Our Approach</h3>
            <p className="text-gray-400">Direct owner connections with transparent pricing.</p>
          </div>
          <div className="text-2xl text-gray-600">→</div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-semibold mb-2">Outcome</h3>
            <p className="text-gray-400">Save thousands and close faster.</p>
          </div>
        </div>
      </section>

      {/* Client Stories */}
      <section id="client-stories" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Client Stories</h2>
        <div className="glass-card p-8 text-center">
          <p className="text-gray-500 italic">
            This space will feature verified client stories.
          </p>
        </div>
      </section>

      {/* Why This Matters */}
      <section id="why-matters" className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Why This Matters</h2>
        <div className="space-y-4 text-lg text-gray-300">
          <p>Representation matters because it protects buyers and sellers from hidden costs.</p>
          <p>Negotiation matters – skilled negotiation secures better prices and terms.</p>
          <p>Due‑diligence matters – thorough analysis reduces risk and improves investment outcomes.</p>
          <p>Insurance matters – it safeguards assets against unexpected events.</p>
          <p>Time matters – our platform automates workflows, saving hours of manual effort.</p>
        </div>
      </section>
    </div>
  );
}
