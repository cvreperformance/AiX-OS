import Link from 'next/link';

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Overview', href: '/workspace/crm' },
    { name: 'Leads', href: '/workspace/crm/leads' },
    { name: 'Clients', href: '/workspace/crm/clients' },
    { name: 'Companies', href: '/workspace/crm/companies' },
    { name: 'Pipeline', href: '/workspace/crm/pipeline' },
    { name: 'Activities', href: '/workspace/crm/activities' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-display text-white font-bold tracking-tight">CRM</h1>
        
        {/* Sub-navigation */}
        <nav className="flex items-center space-x-1 border-b border-zinc-800 pb-px">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white border-b-2 border-transparent hover:border-zinc-700 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
