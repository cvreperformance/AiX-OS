import { ActionItem } from '../types/action.types';

export const mockActions: ActionItem[] = [
  {
    id: 'a1',
    title: 'Luxury Penthouse Listing',
    source: 'Morning Brief',
    opportunityScore: 95,
    estimatedRevenue: 2500000,
    reason: 'High value opportunity added today.',
    recommendedAction: 'Contact immediately and prioritize pipeline.',
    dueTime: '10:00',
    status: 'Pending'
  },
  {
    id: 'a2',
    title: 'Boutique Hotel Investment',
    source: 'Morning Brief',
    opportunityScore: 98,
    estimatedRevenue: 5000000,
    reason: 'New Premium Listing detected by rules.',
    recommendedAction: 'Draft investment proposal.',
    dueTime: '11:00',
    status: 'Pending'
  },
  {
    id: 'a3',
    title: 'Tech Startup Office Lease',
    source: 'CRM',
    opportunityScore: 88,
    estimatedRevenue: 120000,
    reason: 'Sign Lease Agreement is overdue by 2 days.',
    recommendedAction: 'Call client to finalize terms.',
    dueTime: '09:00',
    status: 'Pending'
  },
  {
    id: 'a4',
    title: 'Corporate Insurance Package',
    source: 'Morning Brief',
    opportunityScore: 92,
    estimatedRevenue: 50000,
    reason: 'Insurance renewal expires tomorrow.',
    recommendedAction: 'Send renewal quote.',
    dueTime: '14:00',
    status: 'Pending'
  },
  {
    id: 'a5',
    title: 'Automotive Fleet Insurance',
    source: 'Tasks',
    opportunityScore: 70,
    estimatedRevenue: 75000,
    reason: 'Follow up on previous email.',
    recommendedAction: 'Send follow-up email.',
    dueTime: '15:00',
    status: 'Pending'
  }
];
