"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tabletSidebarCollapsed, setTabletSidebarCollapsed] = useState(true);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex h-screen bg-black text-white relative overflow-hidden">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden" 
          onClick={() => setMobileSidebarOpen(false)} 
        />
      )}

      {/* Tablet Backdrop */}
      {!tabletSidebarCollapsed && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs hidden md:block lg:hidden" 
          onClick={() => setTabletSidebarCollapsed(true)} 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-900 flex flex-col bg-[#050505] transition-transform duration-300 
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:transition-transform md:duration-300
          ${tabletSidebarCollapsed ? 'md:-translate-x-full lg:translate-x-0' : 'md:translate-x-0'} 
          lg:relative lg:translate-x-0 lg:flex`}
        aria-hidden={tabletSidebarCollapsed && mobileSidebarOpen ? undefined : undefined}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-transparent bg-clip-text gradient-gold">AiX OS</h2>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Workspace</p>
          </div>
          {/* Close drawer button for mobile */}
          <button 
            className="md:hidden p-1 text-zinc-400 hover:text-white rounded"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-thin">
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
              <div key={item.name} className="px-4 py-2 text-zinc-700 text-xs font-semibold uppercase tracking-wider select-none">{item.name}</div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setTabletSidebarCollapsed(true);
                }}
                className="block px-4 py-2.5 rounded-lg hover:bg-zinc-900 hover:text-amber-400 transition-colors text-zinc-400 text-sm font-medium"
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile/Tablet Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#050505] border-b border-zinc-900">
          <div className="flex items-center gap-2">
            {/* Hamburger for Mobile */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Collapse toggle for Tablet */}
            <button
              className="hidden md:block p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              onClick={() => setTabletSidebarCollapsed(!tabletSidebarCollapsed)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-2 font-medium tracking-tight text-white">Workspace</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
