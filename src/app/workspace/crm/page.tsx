import { RevenueFeedService } from '@/modules/revenue-feed/services/revenue-feed.service';

export default async function CRMHomePage() {
  const feedService = new RevenueFeedService();
  
  // Await the live RSS feeds
  const opportunities = await feedService.loadFeeds();

  const developerCount = opportunities.filter(o => o.category === 'Developer').length;
  const b2bCount = opportunities.filter(o => o.category === 'B2B').length;
  const investmentCount = opportunities.filter(o => o.category === 'Investment').length;
  const topAction = opportunities.length > 0 ? opportunities[0].title.substring(0, 30) + '...' : 'No actions available';

  const stats = [
    { name: "Today's Opportunities", value: opportunities.length.toString() },
    { name: 'Latest Developer News', value: developerCount.toString() },
    { name: 'Insurance Opportunities', value: b2bCount.toString() },
    { name: 'Investment Opportunities', value: investmentCount.toString() },
    { name: 'Top Action', value: topAction },
  ];

  const activities = opportunities.slice(0, 3).map((o, idx) => ({
    id: idx + 1,
    text: o.title,
    time: `${o.source} • ${o.category}`
  }));

  return (
    <div className="space-y-8">
      {/* Dynamic LIVE KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 border border-zinc-800/50 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-zinc-500">{stat.name}</h3>
            <p className="mt-2 text-3xl font-light text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent LIVE Activity */}
      <div>
        <h2 className="text-xl font-medium text-white mb-4">Latest Radar Intel</h2>
        <div className="glass-card border border-zinc-800/50 rounded-xl overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-sm">
          <ul className="divide-y divide-zinc-800/50">
            {activities.length > 0 ? activities.map((activity) => (
              <li key={activity.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                <span className="text-sm text-zinc-300 truncate w-3/4 pr-4">{activity.text}</span>
                <span className="text-xs text-zinc-500 whitespace-nowrap">{activity.time}</span>
              </li>
            )) : (
              <li className="p-4 text-sm text-zinc-500">No recent intel available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
