export type TaskStatus = 'OVERLOADED' | 'FULL' | 'SCHEDULED' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  status: TaskStatus;
  timeAgo: string;
  completedAt?: string;
}

export interface TaskSummaryData {
  total: number;
  completed: number;
  urgent: number;
}