import { expect, describe, it, vi, beforeEach } from 'vitest';
import { PersonalStorage } from '../storage/personal.storage';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } })
  },
  from: vi.fn()
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase))
}));

describe('PersonalStorage', () => {
  let storage: PersonalStorage;

  beforeEach(() => {
    storage = new PersonalStorage();
    vi.clearAllMocks();
  });

  it('should fetch and map calendar events for today', async () => {
    const mockData = [
      {
        id: 'event-1',
        user_id: 'user-1',
        title: 'Meeting with Client',
        date: '2026-07-14',
        time: '10:00',
        priority: 'High',
        estimated_revenue: 50000,
        status: 'Scheduled',
        category: 'Meeting'
      }
    ];

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      order: mockOrder
    } as any);

    const events = await storage.getEventsForDate('2026-07-14');

    expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events');
    expect(mockEq).toHaveBeenCalledWith('date', '2026-07-14');
    expect(events.length).toBe(1);
    expect(events[0].title).toBe('Meeting with Client');
    expect(events[0].estimatedRevenue).toBe(50000);
    expect(events[0].category).toBe('Meeting');
  });

  it('should fetch recent captures safely', async () => {
    const mockData = [
      { id: 'cap-1', raw_text: 'Buy milk' }
    ];

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockResolvedValue({ data: mockData, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      order: mockOrder,
      limit: mockLimit
    } as any);

    const captures = await storage.getRecentCaptures(5);

    expect(mockSupabase.from).toHaveBeenCalledWith('captures');
    expect(captures.length).toBe(1);
    expect(captures[0].rawText).toBe('Buy milk');
  });

  it('should handle unauthenticated users', async () => {
    // Mock user out
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } } as any);

    const captures = await storage.getRecentCaptures(5);
    expect(captures.length).toBe(0);
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });
});
