'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/modules/personal/types/personal.types';
import { getEventsForDate, getEventsForMonth, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/app/actions/personal.actions';

interface CalendarClientProps {
  initialEvents: CalendarEvent[];
}

export default function CalendarClient({ initialEvents }: CalendarClientProps) {
  const [view, setView] = useState<'today' | 'month'>('today');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'Medium',
    category: 'Meeting',
    status: 'Scheduled',
    estimatedRevenue: 0
  });

  const loadEvents = async () => {
    try {
      if (view === 'today') {
        const today = new Date().toISOString().split('T')[0];
        const data = await getEventsForDate(today);
        setEvents(data);
      } else {
        const yearMonth = new Date().toISOString().slice(0, 7);
        const data = await getEventsForMonth(yearMonth);
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [view]);

  const handleOpenModal = (event?: CalendarEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time,
        priority: event.priority,
        category: event.category,
        status: event.status,
        estimatedRevenue: event.estimatedRevenue || 0
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        priority: 'Medium',
        category: 'Meeting',
        status: 'Scheduled',
        estimatedRevenue: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingEvent) {
        await updateCalendarEvent(editingEvent.id!, formData);
      } else {
        await createCalendarEvent(formData);
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCalendarEvent(id);
      setIsModalOpen(false);
      loadEvents();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
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
            onClick={() => handleOpenModal()}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
          >
            + New Event
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {view === 'today' ? "Today's Schedule" : "Month View"}
        </h2>
        
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              No events scheduled for {view === 'today' ? 'today' : 'this month'}.
            </div>
          ) : events.map(event => (
            <div key={event.id} onClick={() => handleOpenModal(event)} className="p-5 border border-zinc-800/80 rounded-xl bg-zinc-900/30 flex items-start cursor-pointer hover:border-amber-500/50 transition-colors">
              <div className="w-32 shrink-0 text-amber-500 font-bold text-lg">
                {view === 'month' && <div className="text-xs text-zinc-500">{event.date}</div>}
                {event.time.slice(0, 5)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-lg">{event.title}</h3>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{event.priority}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">{event.category} {event.linkedCompany && `| ${event.linkedCompany}`}</p>
                {event.description && <p className="text-sm text-zinc-500 mt-3">{event.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={formData.date || ''} 
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={formData.time || ''} 
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                  <select 
                    value={formData.category || 'Meeting'}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Viewing">Viewing</option>
                    <option value="Call">Call</option>
                    <option value="Personal">Personal</option>
                    <option value="Task">Task</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
                  <select 
                    value={formData.priority || 'Medium'}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white h-24 resize-none focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
              {editingEvent ? (
                <button 
                  onClick={() => handleDelete(editingEvent.id!)}
                  className="text-red-500 hover:text-red-400 text-sm font-medium px-4 py-2"
                >
                  Delete
                </button>
              ) : <div></div>}
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
