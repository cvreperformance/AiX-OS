import { PersonalStorage } from '../storage/personal.storage';
import { getLiveActions } from '@/app/actions/revenue.actions';
import { ActionItem } from '@/modules/action-center/types/action.types';
import { CalendarEvent, Capture, Idea, Reminder } from '../types/personal.types';
import { getAgentState } from '@/app/actions/agent.actions';

export interface TodayData {
  mission: string;
  topActions: ActionItem[];
  reminders: Reminder[];
  calendarEvents: CalendarEvent[];
  recentCaptures: Capture[];
  recentIdeas: Idea[];
  estimatedPipeline: number;
  agentHealth: {
    activeCount: number;
    runningCount: number;
    lastRun: string;
  };
}

export class TodayService {
  private storage = new PersonalStorage();

  async getTodayData(): Promise<TodayData> {
    const today = new Date().toISOString().split('T')[0];

    const [
      calendarEvents,
      recentCaptures,
      recentIdeas,
      reminders,
      liveActions,
      agents
    ] = await Promise.all([
      this.storage.getEventsForDate(today),
      this.storage.getRecentCaptures(5),
      this.storage.getRecentIdeas(5),
      this.storage.getPendingReminders(5),
      getLiveActions(),
      getAgentState()
    ]);

    // Calculate agent health
    const activeCount = agents.filter(a => a.enabled).length;
    const runningCount = agents.filter(a => a.status === 'Running').length;
    
    // Find most recent lastRun
    let lastRun = 'Never';
    const runs = agents.filter(a => a.lastRun).map(a => new Date(a.lastRun!).getTime());
    if (runs.length > 0) {
      lastRun = new Date(Math.max(...runs)).toLocaleString();
    }

    // Top 3 revenue actions from live actions
    const topActions = liveActions.slice(0, 3);

    // Calculate pipeline (sum of top actions + today's events)
    let estimatedPipeline = 0;
    topActions.forEach(a => estimatedPipeline += (a.estimatedRevenue || 0));
    calendarEvents.forEach(e => estimatedPipeline += (e.estimatedRevenue || 0));

    return {
      mission: 'Dominate the market and maximize revenue output.',
      topActions,
      reminders,
      calendarEvents,
      recentCaptures,
      recentIdeas,
      estimatedPipeline,
      agentHealth: { activeCount, runningCount, lastRun }
    };
  }
}
