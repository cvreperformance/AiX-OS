export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Category = 'Meeting' | 'Viewing' | 'Call' | 'Insurance' | 'Property' | 'Personal' | 'Idea' | 'Reminder' | 'Task';

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  priority: Priority;
  estimatedRevenue: number;
  status: string;
  category: Category;
  linkedCompany?: string;
  linkedProperty?: string;
  linkedClient?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Capture {
  id: string;
  userId: string;
  rawText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  date: string;
  priority: Priority;
  completed: boolean;
  linkedCapture?: string;
  linkedIdea?: string;
  createdAt: string;
  updatedAt: string;
}
