'use server';

import { PersonalStorage } from '@/modules/personal/storage/personal.storage';
import { revalidatePath } from 'next/cache';
import { CalendarEvent, Idea } from '@/modules/personal/types/personal.types';

// ─── CAPTURE ───────────────────────────────────────────
export async function saveCapture(text: string) {
  const storage = new PersonalStorage();
  const capture = await storage.createCapture(text);
  if (!capture) throw new Error('Failed to save capture');
  revalidatePath('/workspace/capture');
  revalidatePath('/workspace/today');
  return capture;
}

export async function getRecentCaptures(limit: number = 20) {
  const storage = new PersonalStorage();
  return await storage.getRecentCaptures(limit);
}

export async function deleteCapture(id: string) {
  const storage = new PersonalStorage();
  await storage.deleteCapture(id);
  revalidatePath('/workspace/capture');
  revalidatePath('/workspace/today');
}

// ─── CALENDAR ──────────────────────────────────────────
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
  revalidatePath('/workspace/today');
  return newEvent;
}

export async function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>) {
  const storage = new PersonalStorage();
  const updatedEvent = await storage.updateCalendarEvent(id, updates);
  revalidatePath('/workspace/calendar');
  revalidatePath('/workspace/today');
  return updatedEvent;
}

export async function deleteCalendarEvent(id: string) {
  const storage = new PersonalStorage();
  const success = await storage.deleteCalendarEvent(id);
  revalidatePath('/workspace/calendar');
  revalidatePath('/workspace/today');
  return success;
}

// ─── REMINDERS ─────────────────────────────────────────
export async function getReminders(limit: number = 50) {
  const storage = new PersonalStorage();
  return await storage.getPendingReminders(limit);
}

export async function completeReminder(id: string) {
  const storage = new PersonalStorage();
  await storage.completeReminder(id);
  revalidatePath('/workspace/reminders');
  revalidatePath('/workspace/today');
}

export async function createReminder(data: { title: string; date: string; priority: string }) {
  const storage = new PersonalStorage();
  const reminder = await storage.createReminder(data);
  revalidatePath('/workspace/reminders');
  revalidatePath('/workspace/today');
  return reminder;
}

// ─── IDEAS ─────────────────────────────────────────────
export async function getIdeas(limit: number = 50) {
  const storage = new PersonalStorage();
  return await storage.getRecentIdeas(limit);
}

export async function createIdea(data: Partial<Idea>) {
  const storage = new PersonalStorage();
  const idea = await storage.createIdea(data);
  revalidatePath('/workspace/ideas');
  revalidatePath('/workspace/today');
  return idea;
}
