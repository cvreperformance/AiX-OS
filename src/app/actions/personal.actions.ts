'use server';

import { PersonalStorage } from '@/modules/personal/storage/personal.storage';

export async function saveCapture(text: string) {
  const storage = new PersonalStorage();
  const capture = await storage.createCapture(text);
  if (!capture) {
    throw new Error('Failed to save capture');
  }
  return capture;
}
