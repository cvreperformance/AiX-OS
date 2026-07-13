import { MBTask, MBCalendarEvent, MBFollowUp, MBOpportunity } from '../types/morning-brief.types';

export const mockTasks: MBTask[] = [
  { id: 't1', title: 'Send Q3 Proposal', dueDate: '2026-07-10', status: 'overdue', priority: 'High', daysOverdue: 3 },
  { id: 't2', title: 'Review Property Listing', dueDate: '2026-07-13', status: 'pending', priority: 'Medium' },
  { id: 't3', title: 'Update CRM Contacts', dueDate: '2026-07-13', status: 'pending', priority: 'Low' },
  { id: 't4', title: 'Draft NDA for Tech Solutions', dueDate: '2026-07-14', status: 'pending', priority: 'High' },
  { id: 't5', title: 'Sign Lease Agreement', dueDate: '2026-07-11', status: 'overdue', priority: 'High', daysOverdue: 2 },
  { id: 't6', title: 'Follow up on invoice #1023', dueDate: '2026-07-13', status: 'pending', priority: 'Medium' },
  { id: 't7', title: 'Team Sync Prep', dueDate: '2026-07-13', status: 'pending', priority: 'Low' },
  { id: 't8', title: 'Market Research Report', dueDate: '2026-07-15', status: 'pending', priority: 'Medium' },
  { id: 't9', title: 'Prepare Tax Documents', dueDate: '2026-07-09', status: 'overdue', priority: 'High', daysOverdue: 4 },
  { id: 't10', title: 'Office Supplies Order', dueDate: '2026-07-13', status: 'completed', priority: 'Low' }
];

export const mockCalendarEvents: MBCalendarEvent[] = [
  { id: 'c1', title: 'Kickoff with Andrei', startTime: '09:00', endTime: '10:00', contactName: 'Andrei', isImportant: true },
  { id: 'c2', title: 'Weekly Standup', startTime: '10:30', endTime: '11:00', isImportant: false },
  { id: 'c3', title: 'Lunch with Investor', startTime: '12:30', endTime: '14:00', contactName: 'Sarah L.', isImportant: true },
  { id: 'c4', title: 'Property Viewing', startTime: '15:00', endTime: '16:00', contactName: 'Mike T.', isImportant: true },
  { id: 'c5', title: 'Internal Review', startTime: '16:30', endTime: '17:00', isImportant: false },
  { id: 'c6', title: 'Pitch Presentation', startTime: '17:00', endTime: '18:00', contactName: 'Acme Corp', isImportant: true },
  { id: 'c7', title: 'Quick Sync', startTime: '18:00', endTime: '18:15', isImportant: false },
  { id: 'c8', title: 'Client Onboarding', startTime: '14:00', endTime: '15:00', contactName: 'Tech Innovators', isImportant: true },
  { id: 'c9', title: 'Vendor Call', startTime: '11:00', endTime: '11:30', isImportant: false },
  { id: 'c10', title: 'Marketing Planning', startTime: '08:00', endTime: '09:00', isImportant: false }
];

export const mockFollowUps: MBFollowUp[] = [
  { id: 'f1', contactName: 'John Doe', reason: 'Insurance policy renewal', dueDate: '2026-07-14', type: 'insurance_renewal' },
  { id: 'f2', contactName: 'Alice Smith', reason: 'Post-meeting check-in', dueDate: '2026-07-13', type: 'call' },
  { id: 'f3', contactName: 'Bob Builder', reason: 'Construction update', dueDate: '2026-07-13', type: 'email' },
  { id: 'f4', contactName: 'Eve Hacker', reason: 'Cybersecurity audit review', dueDate: '2026-07-15', type: 'meeting' },
  { id: 'f5', contactName: 'Charlie Brown', reason: 'Portfolio review', dueDate: '2026-07-13', type: 'general' },
  { id: 'f6', contactName: 'Diana Prince', reason: 'Liability Insurance expires', dueDate: '2026-07-14', type: 'insurance_renewal' },
  { id: 'f7', contactName: 'Clark Kent', reason: 'Send property listings', dueDate: '2026-07-13', type: 'email' },
  { id: 'f8', contactName: 'Bruce Wayne', reason: 'Discuss merger', dueDate: '2026-07-13', type: 'call' },
  { id: 'f9', contactName: 'Barry Allen', reason: 'Speed up contract signing', dueDate: '2026-07-13', type: 'call' },
  { id: 'f10', contactName: 'Arthur Curry', reason: 'Yacht insurance quote', dueDate: '2026-07-14', type: 'insurance_renewal' }
];

export const mockOpportunities: MBOpportunity[] = [
  { id: 'o1', title: 'Luxury Penthouse Listing', value: 2500000, score: 95, isNew: true },
  { id: 'o2', title: 'Tech Startup Office Lease', value: 120000, score: 88, isNew: false },
  { id: 'o3', title: 'Corporate Insurance Package', value: 50000, score: 92, isNew: false },
  { id: 'o4', title: 'Suburban Villa Sale', value: 850000, score: 75, isNew: true },
  { id: 'o5', title: 'Commercial Warehouse', value: 3400000, score: 65, isNew: false },
  { id: 'o6', title: 'Retail Space Rental', value: 45000, score: 40, isNew: false },
  { id: 'o7', title: 'Boutique Hotel Investment', value: 5000000, score: 98, isNew: true },
  { id: 'o8', title: 'High-Net-Worth Wealth Management', value: 150000, score: 82, isNew: false },
  { id: 'o9', title: 'Automotive Fleet Insurance', value: 75000, score: 70, isNew: false },
  { id: 'o10', title: 'Small Business Health Plan', value: 12000, score: 55, isNew: false }
];
