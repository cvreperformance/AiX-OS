import { ActionItem } from '../types/action.types';

interface ActionCardProps {
  action: ActionItem;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onIgnore: (id: string) => void;
  onDefer: (id: string) => void;
}

export function ActionCard({ action, onStart, onComplete, onIgnore, onDefer }: ActionCardProps) {
  return (
    <div className="glass-card border border-zinc-800/80 bg-[#0a0a0a]/90 rounded-xl p-5 shadow-lg flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
              {action.source}
            </span>
            <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Score: {action.opportunityScore}
            </span>
            <span className="text-xs text-zinc-400">Due: {action.dueTime}</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{action.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Est. Revenue</p>
          <p className="text-sm font-medium text-emerald-400">€{action.estimatedRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 p-3 rounded-md border border-zinc-800/50">
        <p className="text-xs font-semibold text-zinc-400 mb-1">Reason</p>
        <p className="text-sm text-zinc-200">{action.reason}</p>
      </div>

      <div className="bg-amber-500/5 p-3 rounded-md border border-amber-500/10">
        <p className="text-xs font-semibold text-amber-500/80 mb-1">Recommended Action</p>
        <p className="text-sm text-amber-100">{action.recommendedAction}</p>
      </div>

      {action.explanation && (
        <div className="bg-emerald-500/5 p-3 rounded-md border border-emerald-500/10 whitespace-pre-line">
          <p className="text-xs font-semibold text-emerald-500/80 mb-1">Engine Decision</p>
          <p className="text-xs text-emerald-100/90 leading-relaxed">{action.explanation}</p>
        </div>
      )}

      <div className="pt-2 flex flex-wrap gap-2 items-center justify-between border-t border-zinc-800/80">
        <div className="text-xs font-medium text-zinc-500 uppercase">
          Status: <span className="text-zinc-300">{action.status}</span>
        </div>
        <div className="flex space-x-2">
          {action.status === 'Pending' && (
            <button onClick={() => onStart(action.id)} className="px-3 py-1.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-500/20 transition">Start</button>
          )}
          {(action.status === 'Pending' || action.status === 'In Progress') && (
            <button onClick={() => onComplete(action.id)} className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition">Complete</button>
          )}
          {action.status !== 'Completed' && (
            <button onClick={() => onDefer(action.id)} className="px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 rounded hover:bg-zinc-700 transition">Defer</button>
          )}
          {action.status !== 'Completed' && (
            <button onClick={() => onIgnore(action.id)} className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition">Ignore</button>
          )}
        </div>
      </div>
    </div>
  );
}
