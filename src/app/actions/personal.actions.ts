'use server';

import { PersonalStorage } from '@/modules/personal/storage/personal.storage';
import { revalidatePath } from 'next/cache';
import { CalendarEvent } from '@/modules/personal/types/personal.types';

export async function saveCapture(text: string) {
  const storage = new PersonalStorage();
  const capture = await storage.createCapture(text);
  if (!capture) {
    throw new Error('Failed to save capture');
  }
  revalidatePath('/workspace/capture');
  return capture;
}

export async function getRecentCaptures(limit: number = 20) {
  const storage = new PersonalStorage();
  return await storage.getRecentCaptures(limit);
}

// Calendar Actions

export async function getEventsForDate(date: string) {
  const storage = new PersonalStorage();
  return await storage.getEventsForDate(date);
}

export async function getEventsForMonth(yearMonth: string) {
  const storage = new PersonalStorage();
  return await storage.getEventsForMonth(yearMonth);
}

export async function createCalendarEvent(event: Partial<CalendarEvent>) {
  const storage = new PersonalStorage();
  const newEvent = await storage.createCalendarEvent(event);
  revalidatePath('/workspace/calendar');
  return newEvent;
}

export async function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>) {
  const storage = new PersonalStorage();
  const updatedEvent = await storage.updateCalendarEvent(id, updates);
  revalidatePath('/workspace/calendar');
  return updatedEvent;
}

export async function deleteCalendarEvent(id: string) {
  const storage = new PersonalStorage();
  const success = await storage.deleteCalendarEvent(id);
  revalidatePath('/workspace/calendar');
  return success;
}
