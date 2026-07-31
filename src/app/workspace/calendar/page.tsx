import { PersonalStorage } from '@/modules/personal/storage/personal.storage';
import dynamic from 'next/dynamic';

const CalendarClient = dynamic(() => import('./CalendarClient'), {
  loading: () => (
    <div className="max-w-6xl mx-auto py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-zinc-800 rounded w-1/4"></div>
        <div className="h-64 bg-zinc-900 rounded-xl"></div>
      </div>
    </div>
  ),
});

export default async function CalendarPage() {
  const storage = new PersonalStorage();
  const today = new Date().toISOString().split('T')[0];
  const events = await storage.getEventsForDate(today);

  return <CalendarClient initialEvents={events} />;
}
