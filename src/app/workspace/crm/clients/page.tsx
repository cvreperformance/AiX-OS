export default function ClientsPage() {
  const clients = [
    { id: 1, name: 'Emily Davis', company: 'Design Studio', email: 'emily@designstudio.com', phone: '+40 722 123 456', status: 'Active', revenue: '€45k' },
    { id: 2, name: 'Michael Chen', company: 'Logistics Pro', email: 'm.chen@logisticspro.com', phone: '+40 733 987 654', status: 'At Risk', revenue: '€120k' },
    { id: 3, name: 'Sophia Martinez', company: 'EduTech', email: 'sophia@edutech.io', phone: '+40 744 555 666', status: 'Active', revenue: '€85k' },
    { id: 4, name: 'David Wilson', company: 'Wilson Consulting', email: 'david@wilsonconsulting.net', phone: '+40 755 111 222', status: 'Inactive', revenue: '€20k' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Clients</h2>
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors">
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map(client => (
          <div key={client.id} className="glass-card p-5 border border-zinc-800/50 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm hover:border-zinc-700 transition-colors group cursor-pointer flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm text-zinc-300 font-medium">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">{client.name}</h3>
                    <p className="text-xs text-zinc-500">{client.company}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                  client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                  client.status === 'At Risk' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {client.status}
                </span>
              </div>
              
              <div className="space-y-2 mt-4 text-sm text-zinc-400">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
              <span className="text-xs text-zinc-500">Total Revenue</span>
              <span className="text-sm font-medium text-white">{client.revenue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
