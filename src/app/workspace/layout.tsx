"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [mobileSidebarOpen]);


  return (
    <div className="flex h-screen bg-black text-white relative">
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={`w-64 border-r border-zinc-800 flex flex-col bg-[#050505] transition-transform duration-300 lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:block`}
        aria-hidden={!mobileSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024}
      >
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
        {/* Mobile Header with menu button */}
        <header className="lg:hidden flex items-center p-4 bg-[#050505] border-b border-zinc-800">
          <button
            className="p-2 text-zinc-300 hover:text-white"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation drawer"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-2 font-medium">Workspace</span>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
