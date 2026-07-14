import { MBOpportunity, MBTask, MBCalendarEvent, MBFollowUp } from '../types/morning-brief.types';

export const mockOpportunities: MBOpportunity[] = [
  { id: 'o1', title: 'Luxury Penthouse Listing', value: 2500000, score: 95, isNew: true },
  { id: 'o2', title: 'Opportunity 2', value: 150000, score: 88, why: 'Why 2', nextStep: 'Step 2', isNew: false },
  { id: 'o3', title: 'Opportunity 3', value: 120000, score: 92, why: 'Why 3', nextStep: 'Step 3', isNew: false },
  { id: 'o4', title: 'Opportunity 4', value: 30000, score: 70, why: 'Why 4', nextStep: 'Step 4', isNew: false },
  { id: 'o5', title: 'Opportunity 5', value: 40000, score: 60, why: 'Why 5', nextStep: 'Step 5', isNew: false },
  { id: 'o6', title: 'Opportunity 6', value: 10000, score: 50, why: 'Why 6', nextStep: 'Step 6', isNew: false },
  { id: 'o7', title: 'Opportunity 7', value: 5000000, score: 98, why: 'Why 7', nextStep: 'Step 7', isNew: false },
  { id: 'o8', title: 'Opportunity 8', value: 50000, score: 82, why: 'Why 8', nextStep: 'Step 8', isNew: false },
];

export const mockTasks: MBTask[] = [
  {
    id: 't1',
    title: 'Send Q3 Proposal',
    dueDate: '2026-07-10',
    status: 'overdue',
    priority: 'High',
    daysOverdue: 3,
  },
  {
    id: 't2',
    title: 'Clean office',
    dueDate: '2026-07-15',
    status: 'pending',
    priority: 'Low',
  },
];

export const mockCalendarEvents: MBCalendarEvent[] = [
  {
    id: 'c1',
    title: 'Meeting with Andrei',
    startTime: '09:00',
    endTime: '10:00',
    contactName: 'Andrei',
    isImportant: true,
  },
];

export const mockFollowUps: MBFollowUp[] = [
  {
    id: 'f1',
    contactName: 'Client 1',
    reason: 'Follow up',
    dueDate: '2026-07-14T00:00:00.000Z',
    type: 'insurance_renewal',
  },
];
