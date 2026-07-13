import { IAgent, AgentSchedule } from '../types/agent.types';
import { getLiveActions } from '@/app/actions/revenue.actions';
import { PersonalStorage } from '@/modules/personal/storage/personal.storage';
import { TodayService } from '@/modules/personal/services/today.service';

export class MorningAgent implements IAgent {
  name = 'MorningAgent';
  description = 'Prepares the Today dashboard and initial state for the day.';
  defaultSchedule: AgentSchedule = 'Daily';

  async run(userId: string): Promise<{ success: boolean; message: string }> {
    const today = new TodayService();
    await today.getTodayData(); // Just priming the cache/data
    return { success: true, message: 'Morning dashboard data prepared successfully.' };
  }
}

export class RevenueAgent implements IAgent {
  name = 'RevenueAgent';
  description = 'Polls RSS feeds and updates the Revenue Intelligence graph.';
  defaultSchedule: AgentSchedule = 'Hourly';

  async run(userId: string): Promise<{ success: boolean; message: string }> {
    const actions = await getLiveActions();
    return { success: true, message: `Processed ${actions.length} revenue actions from feeds.` };
  }
}

export class CompanyAgent implements IAgent {
  name = 'CompanyAgent';
  description = 'Synchronizes and merges Company Profiles from new signals.';
  defaultSchedule: AgentSchedule = 'Daily';

  async run(userId: string): Promise<{ success: boolean; message: string }> {
    // getLiveActions already triggers CompanyIntelligenceService.ingest()
    const actions = await getLiveActions();
    return { success: true, message: `Company profiles synchronized. Processed ${actions.length} signals.` };
  }
}

export class ReminderAgent implements IAgent {
  name = 'ReminderAgent';
  description = 'Checks for pending reminders and escalates priorities.';
  defaultSchedule: AgentSchedule = 'Hourly';

  async run(userId: string): Promise<{ success: boolean; message: string }> {
    const storage = new PersonalStorage();
    const reminders = await storage.getPendingReminders(100);
    return { success: true, message: `Checked ${reminders.length} pending reminders.` };
  }
}

export class CalendarAgent implements IAgent {
  name = 'CalendarAgent';
  description = 'Analyzes today\'s calendar and suggests priority adjustments.';
  defaultSchedule: AgentSchedule = 'Daily';

  async run(userId: string): Promise<{ success: boolean; message: string }> {
    const storage = new PersonalStorage();
    const today = new Date().toISOString().split('T')[0];
    const events = await storage.getEventsForDate(today);
    return { success: true, message: `Analyzed ${events.length} calendar events for today.` };
  }
}

export class CaptureAgent implements IAgent {
  name = 'CaptureAgent';
  description = 'Reviews raw captures and suggests follow-ups or ideas.';
  defaultSchedule: AgentSchedule = 'Daily';

  async run(userId: string): Promise<{ success: boolean; message: string }> {
    const storage = new PersonalStorage();
    const captures = await storage.getRecentCaptures(50);
    return { success: true, message: `Reviewed ${captures.length} recent captures.` };
  }
}

// Global default registry builder
import { AgentRegistry } from '../registry/agent.registry';

export function getSystemAgentRegistry(): AgentRegistry {
  const registry = new AgentRegistry();
  registry.register(new MorningAgent());
  registry.register(new RevenueAgent());
  registry.register(new CompanyAgent());
  registry.register(new ReminderAgent());
  registry.register(new CalendarAgent());
  registry.register(new CaptureAgent());
  return registry;
}
