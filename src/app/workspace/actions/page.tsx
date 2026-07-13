'use client';

import { useState, useMemo } from 'react';
import { ActionCenterService } from '@/modules/action-center/services/action-center.service';
import { mockActions } from '@/modules/action-center/mock/actions';
import { ActionCard } from '@/modules/action-center/components/ActionCard';

export default function ActionCenterPage() {
  // Initialize service once
  const [service] = useState(() => new ActionCenterService(mockActions));
  
  // State to trigger re-renders
  const [actions, setActions] = useState(service.loadActions());

  const handleStart = (id: string) => setActions([...service.start(id)]);
  const handleComplete = (id: string) => setActions([...service.complete(id)]);
  const handleIgnore = (id: string) => setActions([...service.ignore(id)]);
  const handleDefer = (id: string) => setActions([...service.defer(id)]);

  const stats = service.statistics();

  // Filter actions for display
  const pendingActions = actions.filter(a => a.status === 'Pending' || a.status === 'In Progress');
  const completedActions = actions.filter(a => a.status === 'Completed');

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Action Center</h1>
        <p className="text-zinc-400 mt-2">Your operational command center. Prioritized recommendations from the Morning Brief.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard label="Pending" value={stats.pendingCount} />
        <StatCard label="Completed" value={stats.completedCount} />
        <StatCard label="Ignored" value={stats.ignoredCount} />
        <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
        <StatCard label="Est. Revenue Won" value={`€${(stats.estimatedRevenueCompleted / 1000).toFixed(1)}k`} color="emerald" />
        <StatCard label="Revenue Remaining" value={`€${(stats.estimatedRevenueRemaining / 1000).toFixed(1)}k`} color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        {/* Priority Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
            Priority Queue
          </h2>
          {pendingActions.length === 0 ? (
            <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/30 text-center text-zinc-500">
              No pending actions. You're all caught up!
            </div>
          ) : (
            <div className="space-y-4">
              {pendingActions.map(action => (
                <ActionCard 
                  key={action.id} 
                  action={action} 
                  onStart={handleStart}
                  onComplete={handleComplete}
                  onIgnore={handleIgnore}
                  onDefer={handleDefer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Today */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Completed Today
          </h2>
          {completedActions.length === 0 ? (
            <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/30 text-center text-zinc-500 text-sm">
              No actions completed yet today.
            </div>
          ) : (
            <div className="space-y-3">
              {completedActions.map(action => (
                <div key={action.id} className="p-3 border border-zinc-800/50 bg-[#121212] rounded-lg opacity-60">
                  <p className="text-sm font-medium text-white line-through decoration-emerald-500">{action.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">Earned €{action.estimatedRevenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "white" }: { label: string, value: string | number, color?: string }) {
  const colorMap: Record<string, string> = {
    white: "text-white",
    emerald: "text-emerald-400",
    amber: "text-amber-500",
  };
  return (
    <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between">
      <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">{label}</span>
      <span className={`text-2xl font-bold mt-2 ${colorMap[color]}`}>{value}</span>
    </div>
  );
}
