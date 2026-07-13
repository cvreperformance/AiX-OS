'use client';

import { useState, useEffect } from 'react';
import { getAgentState, toggleAgent, runAgentManual, getAgentLogs } from '@/app/actions/agent.actions';

export default function AgentCenterPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadState = async () => {
    const [agentData, logData] = await Promise.all([
      getAgentState(),
      getAgentLogs(10)
    ]);
    setAgents(agentData);
    setLogs(logData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleToggle = async (name: string, current: boolean) => {
    await toggleAgent(name, !current);
    loadState();
  };

  const handleRun = async (name: string) => {
    setAgents(prev => prev.map(a => a.name === name ? { ...a, status: 'Running' } : a));
    try {
      await runAgentManual(name);
    } catch (e) {
      console.error(e);
    }
    loadState();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Agent Center</h1>
        <p className="text-zinc-400 mt-2">Autonomous task execution and orchestration.</p>
      </div>

      {isLoading ? (
        <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/30 text-center text-zinc-500">
          Loading system agents...
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white">Active Agents</h2>
            <div className="grid gap-4">
              {agents.map(agent => (
                <div key={agent.name} className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${agent.status === 'Running' ? 'bg-amber-500 text-black' : agent.status === 'Failed' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {agent.status}
                      </span>
                      {!agent.enabled && <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Disabled</span>}
                    </div>
                    <p className="text-sm text-zinc-400 mt-1">{agent.description}</p>
                    <div className="text-xs text-zinc-500 mt-3 flex gap-4">
                      <span>Schedule: {agent.schedule}</span>
                      <span>Last Run: {agent.lastRun ? new Date(agent.lastRun).toLocaleString() : 'Never'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleRun(agent.name)}
                      disabled={agent.status === 'Running' || !agent.enabled}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      Run Now
                    </button>
                    <button 
                      onClick={() => handleToggle(agent.name, agent.enabled)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      {agent.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Execution Logs</h2>
            <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl overflow-hidden">
              {logs.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">No execution history.</div>
              ) : logs.map(log => (
                <div key={log.id} className="p-4 border-b border-zinc-800/50 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-white">{log.agentName}</span>
                    <span className="text-xs text-zinc-500">{new Date(log.startTime).toLocaleTimeString()}</span>
                  </div>
                  <p className={`text-xs ${log.error ? 'text-rose-400' : 'text-zinc-400'}`}>
                    {log.error ? `Failed: ${log.error}` : log.resultSummary}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-2">Duration: {log.durationMs}ms</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
