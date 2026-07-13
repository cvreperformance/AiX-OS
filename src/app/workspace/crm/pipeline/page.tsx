export default function PipelinePage() {
  const columns = [
    { title: 'New', count: 3, cards: [{ id: 1, name: 'Alice Johnson', value: '€150k', company: 'Self' }] },
    { title: 'Qualified', count: 2, cards: [{ id: 2, name: 'Tech Solutions Inc', value: '€450k', company: 'Tech Solutions' }] },
    { title: 'Meeting', count: 1, cards: [{ id: 3, name: 'Global Retail', value: '€1.2M', company: 'Global Retail' }] },
    { title: 'Proposal', count: 2, cards: [] },
    { title: 'Negotiation', count: 1, cards: [] },
    { title: 'Won', count: 12, cards: [] },
    { title: 'Lost', count: 5, cards: [] },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Pipeline</h2>
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors">
          Add Deal
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex space-x-4 h-full items-start min-w-max">
          {columns.map((col) => (
            <div key={col.title} className="w-72 flex flex-col max-h-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-medium text-zinc-400">{col.title}</h3>
                <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">{col.count}</span>
              </div>
              
              <div className="flex-1 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-2 space-y-2 overflow-y-auto">
                {col.cards.map(card => (
                  <div key={card.id} className="bg-[#121212] border border-zinc-800 p-3 rounded-lg shadow-sm hover:border-zinc-700 cursor-pointer transition-colors group">
                    <h4 className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors">{card.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{card.company}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-500/90">{card.value}</span>
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                        {card.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty State placeholder if needed, just a visual drop zone */}
                <div className="h-2 rounded bg-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
