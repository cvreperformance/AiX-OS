'use server';

import { createClient } from '@/lib/supabase/server';
import { getSystemAgentRegistry } from '@/modules/agent/agents/system.agents';
import { AgentStorage } from '@/modules/agent/storage/agent.storage';
import { AgentRun, AgentLog } from '@/modules/agent/types/agent.types';

export async function getAgentState() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const registry = getSystemAgentRegistry();
  const storage = new AgentStorage();
  const dbRuns = await storage.getAgentRuns(user.id);

  const agents = registry.getAllAgents().map(agent => {
    const dbState = dbRuns.find(r => r.agentName === agent.name);
    return {
      name: agent.name,
      description: agent.description,
      enabled: dbState ? dbState.enabled : true,
      schedule: dbState ? dbState.schedule : agent.defaultSchedule,
      status: dbState ? dbState.status : 'Idle',
      lastRun: dbState?.lastRun,
      nextRun: dbState?.nextRun
    };
  });

  return agents;
}

export async function toggleAgent(agentName: string, enabled: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const storage = new AgentStorage();
  await storage.toggleAgent(user.id, agentName, enabled);
}

export async function runAgentManual(agentName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const registry = getSystemAgentRegistry();
  await registry.run(user.id, agentName);
}

export async function getAgentLogs(limit: number = 20): Promise<AgentLog[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const storage = new AgentStorage();
  return await storage.getRecentLogs(user.id, limit);
}
