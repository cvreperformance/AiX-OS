import Link from "next/link";
import { LayoutDashboard, Search, Shield } from "lucide-react";

export default function EcosystemPage() {
  return (
    <section className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-light text-zinc-900">AiX OS™ Ecosystem</h1>
        <p className="text-lg text-gray-600">
          The central operating system that connects all our premium platforms.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* AiX OS */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center">
          <LayoutDashboard className="w-12 h-12 text-amber-600 mb-4" />
          <h2 className="text-xl font-medium mb-2">AiX OS™</h2>
          <p className="text-sm text-gray-700 mb-4">
            Organize work, automate processes, manage opportunities, centralize information, and improve productivity.
          </p>
        </div>
        {/* Home Find */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center">
          <Search className="w-12 h-12 text-emerald-600 mb-4" />
          <h2 className="text-xl font-medium mb-2">Home Find</h2>
          <p className="text-sm text-gray-700 mb-4">
            Discover, publish, and connect buyers and sellers for premium properties.
          </p>
          <Link href="https://homefind.cristianvaduva.com" target="_blank" rel="noopener noreferrer" className="mt-auto inline-block bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-500 transition-colors">
            Open Home Find →
          </Link>
        </div>
        {/* Insurance */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center">
          <Shield className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-medium mb-2">Insurance</h2>
          <p className="text-sm text-gray-700 mb-4">
            Request, compare, and protect homes, investments, and businesses.
          </p>
          <Link href="https://insurance.cristianvaduva.com" target="_blank" rel="noopener noreferrer" className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-colors">
            Open Insurance →
          </Link>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="mt-12 flex justify-center">
        <svg viewBox="0 0 400 120" className="w-full max-w-xl h-auto">
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#4B5563" />
            </marker>
          </defs>
          <text x="20" y="30" className="text-sm fill-gray-600">Visitor</text>
          <line x1="80" y1="30" x2="130" y2="30" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="140" y="30" className="text-sm fill-gray-600">Home Find</text>
          <line x1="200" y1="30" x2="250" y2="30" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="260" y="30" className="text-sm fill-gray-600">AiX OS™</text>
          <line x1="320" y1="30" x2="370" y2="30" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="380" y="30" className="text-sm fill-gray-600">Insurance</text>
          <text x="200" y="70" className="text-sm fill-gray-600 text-center">Long‑term relationship</text>
        </svg>
      </div>
    </section>
  );
}
