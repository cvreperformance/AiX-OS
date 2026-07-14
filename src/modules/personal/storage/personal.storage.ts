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

    return (data || []).map(this.mapEventToCamel);
  }

  async getEventsForMonth(yearMonth: string): Promise<CalendarEvent[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const startDate = `${yearMonth}-01`;
    const endDate = `${yearMonth}-31`;

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events for month:', error);
      return [];
    }

    return (data || []).map(this.mapEventToCamel);
  }

  async createCalendarEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated. Please log in again.');

    const dbEvent = {
      user_id: user.id,
      title: event.title,
      description: event.description || null,
      date: event.date,
      time: event.time,
      priority: event.priority || 'Medium',
      estimated_revenue: event.estimatedRevenue || 0,
      status: event.status || 'Scheduled',
      category: event.category || 'Meeting',
      linked_company: event.linkedCompany || null,
      linked_property: event.linkedProperty || null,
      linked_client: event.linkedClient || null,
      notes: event.notes || null,
    };

    const { data, error } = await supabase
      .from('calendar_events')
      .insert(dbEvent)
      .select()
      .single();

    if (error) {
      console.error('Error creating calendar event:', error);
      throw new Error(`Database error: ${error.message} (code: ${error.code})`);
    }

    return this.mapEventToCamel(data);
  }

  async updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated. Please log in again.');

    const dbUpdates: Record<string, any> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.time !== undefined) dbUpdates.time = updates.time;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.estimatedRevenue !== undefined) dbUpdates.estimated_revenue = updates.estimatedRevenue;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.category !== undefined) dbUpdates.category = updates.category;

    const { data, error } = await supabase
      .from('calendar_events')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating calendar event:', error);
      throw new Error(`Database error: ${error.message} (code: ${error.code})`);
    }

    return this.mapEventToCamel(data);
  }

  async deleteCalendarEvent(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated. Please log in again.');

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error(`Database error: ${error.message} (code: ${error.code})`);
    }

    return true;
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
    if (!user) throw new Error('Not authenticated. Please log in again.');

    const { data, error } = await supabase
      .from('captures')
      .insert({ user_id: user.id, raw_text: rawText })
      .select()
      .single();

    if (error) {
      console.error('Error creating capture:', error);
      throw new Error(`Database error: ${error.message} (code: ${error.code})`);
    }

    return this.mapCaptureToCamel(data);
  }

  async deleteCapture(id: string): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated. Please log in again.');

    const { error } = await supabase
      .from('captures')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting capture:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async completeReminder(id: string): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated.');

    const { error } = await supabase
      .from('reminders')
      .update({ completed: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error completing reminder:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async createReminder(data: { title: string; date: string; priority: string }): Promise<Reminder | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated.');

    const { data: row, error } = await supabase
      .from('reminders')
      .insert({ user_id: user.id, title: data.title, date: data.date, priority: data.priority, completed: false })
      .select()
      .single();

    if (error) {
      console.error('Error creating reminder:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return this.mapReminderToCamel(row);
  }

  async createIdea(data: Partial<Idea>): Promise<Idea | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated.');

    const { data: row, error } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        priority: data.priority || 'Medium',
        tags: data.tags || [],
        status: 'New',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating idea:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return this.mapIdeaToCamel(row);
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
      updatedAt: row.updated_at,
    };
  }

  private mapCaptureToCamel(row: any): Capture {
    return {
      id: row.id,
      userId: row.user_id,
      rawText: row.raw_text,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapIdeaToCamel(row: any): Idea {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      tags: row.tags || [],
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
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
      updatedAt: row.updated_at,
    };
  }
}
