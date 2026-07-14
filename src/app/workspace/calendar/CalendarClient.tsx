'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/modules/personal/types/personal.types';
import {
  getEventsForDate,
  getEventsForMonth,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/app/actions/personal.actions';

interface CalendarClientProps {
  initialEvents: CalendarEvent[];
}

const defaultForm = (): Partial<CalendarEvent> => ({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  priority: 'Medium',
  category: 'Meeting',
  status: 'Scheduled',
  estimatedRevenue: 0,
});

export default function CalendarClient({ initialEvents }: CalendarClientProps) {
  const [view, setView] = useState<'today' | 'month'>('today');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<Partial<CalendarEvent>>(defaultForm());

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: CalendarEvent[];
      if (view === 'today') {
        const today = new Date().toISOString().split('T')[0];
        data = await getEventsForDate(today);
      } else {
        const yearMonth = new Date().toISOString().slice(0, 7);
        data = await getEventsForMonth(yearMonth);
      }
      setEvents(data);
    } catch (e) {
      console.error('Failed to load events:', e);
    } finally {
      setIsLoading(false);
    }
  }, [view]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const openNew = () => {
    setEditingEvent(null);
    setFormData(defaultForm());
    setModalError('');
    setIsModalOpen(true);
  };

  const openEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time.slice(0, 5), // ensure HH:MM format
      priority: event.priority,
      category: event.category,
      status: event.status,
      estimatedRevenue: event.estimatedRevenue || 0,
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      setModalError('Title is required.');
      return;
    }
    if (!formData.date) {
      setModalError('Date is required.');
      return;
    }
    if (!formData.time) {
      setModalError('Time is required.');
      return;
    }
    setIsSaving(true);
    setModalError('');
    try {
      if (editingEvent) {
        const updated = await updateCalendarEvent(editingEvent.id!, formData);
        if (!updated) throw new Error('Update returned null — check RLS policies or field constraints.');
      } else {
        const created = await createCalendarEvent(formData);
        if (!created) throw new Error('Create returned null — check RLS policies or field constraints.');
      }
      setIsModalOpen(false);
      await loadEvents();
    } catch (e: any) {
      console.error('Save failed:', e);
      setModalError(e?.message || 'Save failed. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    setModalError('');
    try {
      const ok = await deleteCalendarEvent(id);
      if (!ok) throw new Error('Delete failed — check RLS policies.');
      setIsModalOpen(false);
      await loadEvents();
    } catch (e: any) {
      console.error('Delete failed:', e);
      setModalError(e?.message || 'Delete failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Calendar</h1>
          <p className="text-zinc-400 mt-2">AiX Private OS Schedule.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-900 rounded-lg p-1 flex">
            <button
              onClick={() => setView('today')}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${view === 'today' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Today
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${view === 'month' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Month
            </button>
          </div>
          <button
            onClick={openNew}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
          >
            + New Event
          </button>
        </div>
      </div>

      {/* Event List */}
      <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {view === 'today' ? "Today's Schedule" : 'This Month'}
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading events…</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 mb-4">No events scheduled for {view === 'today' ? 'today' : 'this month'}.</p>
            <button
              onClick={openNew}
              className="text-amber-500 hover:text-amber-400 text-sm font-medium underline underline-offset-2"
            >
              Create your first event →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => openEdit(event)}
                className="p-5 border border-zinc-800/80 rounded-xl bg-zinc-900/30 flex items-start cursor-pointer hover:border-amber-500/50 transition-colors"
              >
                <div className="w-32 shrink-0 text-amber-500 font-bold text-lg">
                  {view === 'month' && <div className="text-xs text-zinc-500">{event.date}</div>}
                  {event.time.slice(0, 5)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-lg">{event.title}</h3>
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{event.priority}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">
                    {event.category}
                    {event.linkedCompany && ` | ${event.linkedCompany}`}
                  </p>
                  {event.description && <p className="text-sm text-zinc-500 mt-3">{event.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">
              {editingEvent ? 'Edit Event' : 'New Event'}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Meeting with client"
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Time *</label>
                  <input
                    type="time"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                  <select
                    value={formData.category || 'Meeting'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Viewing">Viewing</option>
                    <option value="Call">Call</option>
                    <option value="Personal">Personal</option>
                    <option value="Task">Task</option>
                    <option value="Property">Property</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
                  <select
                    value={formData.priority || 'Medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional notes…"
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white h-24 resize-none focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Error */}
              {modalError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {modalError}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
              {editingEvent ? (
                <button
                  onClick={() => handleDelete(editingEvent.id!)}
                  disabled={isSaving}
                  className="text-red-500 hover:text-red-400 text-sm font-medium px-4 py-2 disabled:opacity-50"
                >
                  {isSaving ? 'Deleting…' : 'Delete'}
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
