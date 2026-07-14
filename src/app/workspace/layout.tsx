import Link from 'next/link';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-[#050505]">
        <div className="p-6">
          <h2 className="text-xl font-bold font-display text-transparent bg-clip-text gradient-gold">AiX OS</h2>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Workspace</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-thin">
        {[
            { name: 'Today', href: '/workspace/today' },
            { name: 'Capture', href: '/workspace/capture' },
            { name: 'Calendar', href: '/workspace/calendar' },
            { name: 'Reminders', href: '/workspace/reminders' },
            { name: 'Ideas', href: '/workspace/ideas' },
            { name: '—', href: '#', disabled: true },
            { name: 'Action Center', href: '/workspace/actions' },
            { name: 'Market Radar', href: '/workspace/radar' },
            { name: 'Companies', href: '/workspace/companies' },
            { name: 'Agent Center', href: '/workspace/agents' },
            { name: '—', href: '#', disabled: true },
            { name: 'CRM', href: '/workspace/crm' },
          ].map((item) => (
            item.disabled ? (
              <div key={item.name} className="px-4 py-1 text-zinc-700 text-xs font-medium select-none">{item.name}</div>
            ) : (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 rounded-md hover:bg-zinc-800/50 hover:text-amber-400 transition-colors text-zinc-400 text-sm font-medium"
            >
              {item.name}
            </Link>
            )
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0a0a0a]">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
