import { createClient } from '@/lib/supabase/server';
import { CalendarEvent, Capture, Idea, Reminder } from '../types/personal.types';

export class PersonalStorage {
  async getEventsForDate(date: string): Promise<CalendarEvent[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }

    // Map snake_case to camelCase
    return (data || []).map(this.mapEventToCamel);
  }

  async getRecentCaptures(limit: number = 5): Promise<Capture[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching captures:', error);
      return [];
    }

    return (data || []).map(this.mapCaptureToCamel);
  }

  async createCapture(rawText: string): Promise<Capture | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('captures')
      .insert({ user_id: user.id, raw_text: rawText })
      .select()
      .single();

    if (error) {
      console.error('Error creating capture:', error);
      return null;
    }

    return this.mapCaptureToCamel(data);
  }

  async getRecentIdeas(limit: number = 5): Promise<Idea[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching ideas:', error);
      return [];
    }

    return (data || []).map(this.mapIdeaToCamel);
  }

  async getPendingReminders(limit: number = 5): Promise<Reminder[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false)
      .order('date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }

    return (data || []).map(this.mapReminderToCamel);
  }

  // Mappers
  private mapEventToCamel(row: any): CalendarEvent {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      date: row.date,
      time: row.time,
      priority: row.priority,
      estimatedRevenue: row.estimated_revenue,
      status: row.status,
      category: row.category,
      linkedCompany: row.linked_company,
      linkedProperty: row.linked_property,
      linkedClient: row.linked_client,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapCaptureToCamel(row: any): Capture {
    return {
      id: row.id,
      userId: row.user_id,
      rawText: row.raw_text,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapIdeaToCamel(row: any): Idea {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      tags: row.tags,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapReminderToCamel(row: any): Reminder {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      date: row.date,
      priority: row.priority,
      completed: row.completed,
      linkedCapture: row.linked_capture,
      linkedIdea: row.linked_idea,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
