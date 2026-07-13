'use client';

import { useState, useEffect } from 'react';
import { getCompanyGraph } from '@/app/actions/company.actions';
import { CompanyProfile } from '@/modules/company-intelligence/types/company.types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCompanyGraph().then(data => {
      setCompanies(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Company Knowledge Graph</h1>
        <p className="text-zinc-400 mt-2">AiX Central Intelligence Engine. Aggregating live market signals into unified corporate entities.</p>
      </div>

      {isLoading ? (
        <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/30 text-center text-zinc-500">
          Synthesizing real-time entity graph...
        </div>
      ) : companies.length === 0 ? (
        <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/30 text-center text-zinc-500">
          No actionable companies detected in live feeds.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {companies.map(company => (
            <div key={company.id} className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-6 rounded-xl flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{company.name}</h2>
                  <p className="text-sm text-zinc-400 mt-1">{company.industry || 'Monitoring'} | {company.status}</p>
                </div>
                <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-semibold">
                  {company.opportunityScore} Score
                </div>
              </div>

              <p className="text-sm text-zinc-300 border-l-2 border-zinc-700 pl-3">
                {company.summary}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  <span className="text-xs text-zinc-500 uppercase font-semibold">Est. Commission</span>
                  <p className="text-lg font-bold text-emerald-400 mt-1">€{company.estimatedCommissionPotential.toLocaleString()}</p>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  <span className="text-xs text-zinc-500 uppercase font-semibold">Target Contact</span>
                  <p className="text-sm font-medium text-white mt-1">{company.contacts[0] || 'Pending'}</p>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <h3 className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Activity Timeline ({company.articles.length} signals)</h3>
                <ul className="space-y-2">
                  {company.articles.slice(0, 3).map((article, i) => (
                    <li key={i} className="text-xs text-zinc-400 truncate flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mr-2 shrink-0"></span>
                      {article.title}
                    </li>
                  ))}
                  {company.articles.length > 3 && (
                    <li className="text-xs text-zinc-500 italic ml-3.5">+ {company.articles.length - 3} more signals</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
