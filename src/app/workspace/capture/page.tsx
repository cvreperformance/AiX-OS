import { PersonalStorage } from '@/modules/personal/storage/personal.storage';
import CaptureClient from './CaptureClient';

export default async function CapturePage() {
  const storage = new PersonalStorage();
  const captures = await storage.getRecentCaptures(20);

  return <CaptureClient initialCaptures={captures} />;
}
