export default function LeadsPage() {
  const leads = [
    { id: 1, name: 'Alice Johnson', source: 'Website', status: 'New', value: '€150k', owner: 'Mike T.', lastContact: '2 hrs ago', nextFollowUp: 'Tomorrow' },
    { id: 2, name: 'Tech Solutions Inc', source: 'Referral', status: 'Contacted', value: '€450k', owner: 'Sarah L.', lastContact: 'Yesterday', nextFollowUp: 'Next Week' },
    { id: 3, name: 'Bob Smith', source: 'LinkedIn', status: 'Qualified', value: '€80k', owner: 'Mike T.', lastContact: '3 days ago', nextFollowUp: 'Today' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Leads</h2>
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors">
          Add Lead
        </button>
      </div>

      <div className="glass-card border border-zinc-800/50 rounded-xl overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50 border-b border-zinc-800/50 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Lead Name</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Last Contact</th>
                <th className="px-4 py-3 font-medium">Next Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-900/30 transition-colors group cursor-pointer">
                  <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                  <td className="px-4 py-3">{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{lead.value}</td>
                  <td className="px-4 py-3 flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-300">
                      {lead.owner.charAt(0)}
                    </div>
                    <span>{lead.owner}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{lead.lastContact}</td>
                  <td className="px-4 py-3 text-zinc-500">{lead.nextFollowUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
