import { IAgent, AgentSchedule } from '../types/agent.types';
import { AgentStorage } from '../storage/agent.storage';

export class AgentRegistry {
  private agents: Map<string, IAgent> = new Map();
  private storage = new AgentStorage();

  register(agent: IAgent): void {
    this.agents.set(agent.name, agent);
  }

  unregister(agentName: string): void {
    this.agents.delete(agentName);
  }

  getAgent(name: string): IAgent | undefined {
    return this.agents.get(name);
  }

  getAllAgents(): IAgent[] {
    return Array.from(this.agents.values());
  }

  async run(userId: string, agentName: string): Promise<void> {
    const agent = this.agents.get(agentName);
    if (!agent) throw new Error(`Agent ${agentName} not found`);

    const startTime = new Date();
    await this.storage.updateAgentStatus(userId, agentName, 'Running');

    try {
      const result = await agent.run(userId);
      const finishTime = new Date();
      const durationMs = finishTime.getTime() - startTime.getTime();
      
      const nextRun = this.calculateNextRun(agent.defaultSchedule);
      
      await this.storage.updateAgentStatus(userId, agentName, 'Success', nextRun);
      await this.storage.logExecution(
        userId, agentName, startTime.toISOString(), finishTime.toISOString(), durationMs, result.message
      );
    } catch (error: any) {
      const finishTime = new Date();
      const durationMs = finishTime.getTime() - startTime.getTime();
      await this.storage.updateAgentStatus(userId, agentName, 'Failed');
      await this.storage.logExecution(
        userId, agentName, startTime.toISOString(), finishTime.toISOString(), durationMs, 'Execution failed', error.message
      );
    }
  }

  async runAllPending(userId: string): Promise<void> {
    const dbRuns = await this.storage.getAgentRuns(userId);
    const now = new Date();

    for (const agent of this.agents.values()) {
      const dbRun = dbRuns.find(r => r.agentName === agent.name);
      
      // If never run or not in DB, upsert and run
      if (!dbRun) {
        await this.storage.upsertAgentRun(userId, agent.name, agent.defaultSchedule);
        await this.run(userId, agent.name);
        continue;
      }

      // If disabled, skip
      if (!dbRun.enabled) continue;

      // Check schedule
      if (dbRun.nextRun && new Date(dbRun.nextRun) <= now) {
        await this.run(userId, agent.name);
      } else if (!dbRun.lastRun) {
        // Never executed but exists in DB
        await this.run(userId, agent.name);
      }
    }
  }

  private calculateNextRun(schedule: AgentSchedule): string | undefined {
    const now = new Date();
    if (schedule === 'Manual') return undefined;
    if (schedule === 'Hourly') {
      now.setHours(now.getHours() + 1);
    } else if (schedule === 'Daily') {
      now.setDate(now.getDate() + 1);
    } else if (schedule === 'Weekly') {
      now.setDate(now.getDate() + 7);
    }
    return now.toISOString();
  }
}
