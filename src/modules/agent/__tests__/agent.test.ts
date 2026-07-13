import { expect, describe, it, vi, beforeEach } from 'vitest';
import { AgentRegistry } from '../registry/agent.registry';
import { IAgent, AgentSchedule } from '../types/agent.types';
import { AgentStorage } from '../storage/agent.storage';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null })
  })
}));

const mockLogExecution = vi.spyOn(AgentStorage.prototype, 'logExecution').mockResolvedValue(undefined);
const mockUpdateAgentStatus = vi.spyOn(AgentStorage.prototype, 'updateAgentStatus').mockResolvedValue(undefined);
const mockGetAgentRuns = vi.spyOn(AgentStorage.prototype, 'getAgentRuns').mockResolvedValue([]);
const mockUpsertAgentRun = vi.spyOn(AgentStorage.prototype, 'upsertAgentRun').mockResolvedValue(null);

class MockAgent implements IAgent {
  name = 'MockAgent';
  description = 'A test agent';
  defaultSchedule: AgentSchedule = 'Daily';
  run = vi.fn().mockResolvedValue({ success: true, message: 'Mock execution' });
}

describe('Agent Engine', () => {
  let registry: AgentRegistry;
  let mockAgent: MockAgent;

  beforeEach(() => {
    registry = new AgentRegistry();
    mockAgent = new MockAgent();
    registry.register(mockAgent);
    vi.clearAllMocks();
  });

  it('should register and retrieve an agent', () => {
    const retrieved = registry.getAgent('MockAgent');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('MockAgent');
  });

  it('should execute an agent and record state in storage', async () => {
    await registry.run('user-1', 'MockAgent');

    // Should update status to Running, then Success
    expect(mockUpdateAgentStatus).toHaveBeenCalledWith('user-1', 'MockAgent', 'Running');
    // Success update includes a calculated nextRun timestamp
    expect(mockUpdateAgentStatus).toHaveBeenLastCalledWith('user-1', 'MockAgent', 'Success', expect.any(String));

    // Should record the execution log
    expect(mockLogExecution).toHaveBeenCalledWith(
      'user-1',
      'MockAgent',
      expect.any(String), // start
      expect.any(String), // finish
      expect.any(Number), // duration
      'Mock execution'
    );
  });

  it('should run all pending agents based on scheduler', async () => {
    // Mock DB run state where nextRun is in the past
    mockGetAgentRuns.mockResolvedValue([
      {
        agentName: 'MockAgent',
        enabled: true,
        schedule: 'Daily',
        nextRun: new Date(Date.now() - 10000).toISOString() // 10s ago
      }
    ]);

    await registry.runAllPending('user-1');

    // Since nextRun was in the past, it should have been executed
    expect(mockAgent.run).toHaveBeenCalledTimes(1);
  });

  it('should NOT run pending agent if nextRun is in the future', async () => {
    // Mock DB run state where nextRun is in the future
    mockGetAgentRuns.mockResolvedValue([
      {
        agentName: 'MockAgent',
        enabled: true,
        schedule: 'Daily',
        lastRun: new Date(Date.now() - 50000).toISOString(),
        nextRun: new Date(Date.now() + 100000).toISOString() // future
      }
    ]);

    await registry.runAllPending('user-1');

    expect(mockAgent.run).not.toHaveBeenCalled();
  });
});
