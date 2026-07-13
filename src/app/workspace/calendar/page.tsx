import { PersonalStorage } from '@/modules/personal/storage/personal.storage';
import CalendarClient from './CalendarClient';

export default async function CalendarPage() {
  const storage = new PersonalStorage();
  const today = new Date().toISOString().split('T')[0];
  const events = await storage.getEventsForDate(today);

  return <CalendarClient initialEvents={events} />;
}
