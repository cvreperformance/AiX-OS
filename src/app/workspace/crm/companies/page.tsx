export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Companies</h2>
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors">
          Add Company
        </button>
      </div>

      <div className="glass-card border border-zinc-800/50 rounded-xl p-8 text-center bg-[#0a0a0a]/80 backdrop-blur-sm">
        <p className="text-zinc-500">Companies list placeholder.</p>
        <p className="text-xs text-zinc-600 mt-2">Data will be populated from the CRM database.</p>
      </div>
    </div>
  );
}
