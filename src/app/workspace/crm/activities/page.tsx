export default function ActivitiesPage() {
  const timeline = [
    { id: 1, date: 'Today', items: [
      { id: 't1', type: 'call', title: 'Call with Alice Johnson', desc: 'Discussed initial requirements and budget.', time: '10:30 AM', user: 'Mike T.' },
      { id: 't2', type: 'email', title: 'Email to Tech Solutions', desc: 'Sent the revised proposal for Q3.', time: '2:15 PM', user: 'Sarah L.' }
    ]},
    { id: 2, date: 'Yesterday', items: [
      { id: 'y1', type: 'meeting', title: 'On-site meeting at Global Retail', desc: 'Met with the procurement team.', time: '11:00 AM', user: 'Mike T.' },
      { id: 'y2', type: 'note', title: 'Internal Note on EduTech', desc: 'Client requested an extension on the current contract.', time: '4:45 PM', user: 'Sophia M.' }
    ]}
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'call': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>;
      case 'email': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
      case 'meeting': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
      case 'note': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
      default: return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-white">Activities</h2>
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors">
          Log Activity
        </button>
      </div>

      <div className="max-w-3xl">
        {timeline.map(group => (
          <div key={group.date} className="mb-8">
            <h3 className="text-sm font-medium text-zinc-500 mb-4 sticky top-0 bg-[#0a0a0a] py-2 z-10">{group.date}</h3>
            <div className="space-y-4">
              {group.items.map(item => (
                <div key={item.id} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-zinc-800 border-2 border-[#0a0a0a] flex items-center justify-center text-zinc-400">
                    {getIcon(item.type)}
                  </div>
                  {/* Timeline connector line */}
                  <div className="absolute left-[9px] top-6 bottom-[-24px] w-0.5 bg-zinc-800/50 last:hidden"></div>
                  
                  <div className="glass-card p-4 border border-zinc-800/50 rounded-xl bg-[#121212]/80 backdrop-blur-sm hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium text-zinc-200">{item.title}</h4>
                      <span className="text-xs text-zinc-500">{item.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-3">{item.desc}</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-[8px] text-zinc-300">
                        {item.user.charAt(0)}
                      </div>
                      <span className="text-xs text-zinc-500">{item.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
