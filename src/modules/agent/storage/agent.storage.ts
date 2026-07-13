import { createClient } from '@/lib/supabase/server';
import { AgentRun, AgentLog, AgentStatus, AgentSchedule } from '../types/agent.types';

export class AgentStorage {
  async getAgentRuns(userId: string): Promise<AgentRun[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching agent runs:', error);
      return [];
    }

    return (data || []).map(this.mapRunToCamel);
  }

  async upsertAgentRun(userId: string, agentName: string, schedule: AgentSchedule): Promise<AgentRun | null> {
    const supabase = await createClient();
    
    // Attempt to insert, on conflict update nothing just to ensure it exists
    const { data, error } = await supabase
      .from('agent_runs')
      .upsert({ user_id: userId, agent_name: agentName, schedule }, { onConflict: 'user_id, agent_name' })
      .select()
      .single();

    if (error) {
      console.error('Error upserting agent run:', error);
      return null;
    }

    return this.mapRunToCamel(data);
  }

  async updateAgentStatus(userId: string, agentName: string, status: AgentStatus, nextRun?: string): Promise<void> {
    const supabase = await createClient();
    const updatePayload: any = { status, updated_at: new Date().toISOString() };
    
    if (status === 'Success' || status === 'Failed') {
      updatePayload.last_run = new Date().toISOString();
    }
    if (nextRun) {
      updatePayload.next_run = nextRun;
    }

    await supabase
      .from('agent_runs')
      .update(updatePayload)
      .eq('user_id', userId)
      .eq('agent_name', agentName);
  }

  async toggleAgent(userId: string, agentName: string, enabled: boolean): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from('agent_runs')
      .update({ enabled })
      .eq('user_id', userId)
      .eq('agent_name', agentName);
  }

  async logExecution(
    userId: string, 
    agentName: string, 
    startTime: string, 
    finishTime: string, 
    durationMs: number, 
    resultSummary: string, 
    errorMessage?: string
  ): Promise<void> {
    const supabase = await createClient();
    await supabase.from('agent_logs').insert({
      user_id: userId,
      agent_name: agentName,
      start_time: startTime,
      finish_time: finishTime,
      duration_ms: durationMs,
      result_summary: resultSummary,
      error: errorMessage || null
    });
  }

  async getRecentLogs(userId: string, limit: number = 20): Promise<AgentLog[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agent_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }

    return (data || []).map(this.mapLogToCamel);
  }

  private mapRunToCamel(row: any): AgentRun {
    return {
      id: row.id,
      userId: row.user_id,
      agentName: row.agent_name,
      enabled: row.enabled,
      schedule: row.schedule,
      status: row.status,
      lastRun: row.last_run,
      nextRun: row.next_run,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapLogToCamel(row: any): AgentLog {
    return {
      id: row.id,
      userId: row.user_id,
      agentName: row.agent_name,
      startTime: row.start_time,
      finishTime: row.finish_time,
      durationMs: row.duration_ms,
      resultSummary: row.result_summary,
      error: row.error,
      createdAt: row.created_at
    };
  }
}
