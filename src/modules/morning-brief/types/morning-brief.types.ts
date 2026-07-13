export interface MBTask {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'High' | 'Medium' | 'Low';
  daysOverdue?: number;
}

export interface MBCalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  contactName?: string;
  isImportant: boolean;
}

export interface MBFollowUp {
  id: string;
  contactName: string;
  reason: string;
  dueDate: string;
  type: 'call' | 'email' | 'meeting' | 'insurance_renewal' | 'general';
}

export interface MBOpportunity {
  id: string;
  title: string;
  value: number;
  score: number;
  isNew: boolean;
}

export interface MorningBrief {
  date: string;
  overallPriorityScore: number;
  estimatedRevenue: number;
  topPriorities: MBOpportunity[];
  todayTasks: MBTask[];
  followUps: MBFollowUp[];
  calendarEvents: MBCalendarEvent[];
  recommendations: string[];
  businessHealth: 'Excellent' | 'Good' | 'Average' | 'Weak' | 'Critical';
  summary: string;
}
