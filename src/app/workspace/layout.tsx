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
            { name: 'Overview', href: '/workspace' },
            { name: 'Dashboard', href: '/workspace/dashboard' },
            { name: 'CRM', href: '/workspace/crm' },
            { name: 'Knowledge', href: '/workspace/knowledge' },
            { name: 'Memory', href: '/workspace/memory' },
            { name: 'Projects', href: '/workspace/projects' },
            { name: 'Documents', href: '/workspace/documents' },
            { name: 'Tasks', href: '/workspace/tasks' },
            { name: 'Calendar', href: '/workspace/calendar' },
            { name: 'AI', href: '/workspace/ai' },
            { name: 'Settings', href: '/workspace/settings' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 rounded-md hover:bg-zinc-800/50 hover:text-amber-400 transition-colors text-zinc-400 text-sm font-medium"
            >
              {item.name}
            </Link>
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
