export default function CRMHomePage() {
  const stats = [
    { name: 'Total Leads', value: '1,284' },
    { name: 'Active Clients', value: '342' },
    { name: 'Open Opportunities', value: '89' },
    { name: 'Expected Revenue', value: '€2.4M' },
    { name: 'Follow-ups Today', value: '14' },
    { name: 'Conversion Rate', value: '18.2%' },
  ];

  const activities = [
    { id: 1, text: 'Meeting scheduled with John Doe', time: '2 hours ago' },
    { id: 2, text: 'Proposal sent to Acme Corp', time: '5 hours ago' },
    { id: 3, text: 'New lead assigned: Jane Smith', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 border border-zinc-800/50 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-zinc-500">{stat.name}</h3>
            <p className="mt-2 text-3xl font-light text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-medium text-white mb-4">Recent Activity</h2>
        <div className="glass-card border border-zinc-800/50 rounded-xl overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-sm">
          <ul className="divide-y divide-zinc-800/50">
            {activities.map((activity) => (
              <li key={activity.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                <span className="text-sm text-zinc-300">{activity.text}</span>
                <span className="text-xs text-zinc-500">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
