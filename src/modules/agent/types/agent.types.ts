export type AgentSchedule = 'Manual' | 'Hourly' | 'Daily' | 'Weekly';
export type AgentStatus = 'Idle' | 'Running' | 'Failed' | 'Success';

export interface AgentRun {
  id: string;
  userId: string;
  agentName: string;
  enabled: boolean;
  schedule: AgentSchedule;
  status: AgentStatus;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentLog {
  id: string;
  userId: string;
  agentName: string;
  startTime: string;
  finishTime?: string;
  durationMs?: number;
  resultSummary?: string;
  error?: string;
  createdAt: string;
}

export interface IAgent {
  name: string;
  description: string;
  defaultSchedule: AgentSchedule;
  run(userId: string): Promise<{ success: boolean; message: string }>;
}
