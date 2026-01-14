export type TaskHistoryStatus = 'Hoàn thành' | 'Cảnh báo đầy' | 'Sự cố xe';

export interface TaskHistoryItem {
  id: string;
  date: string;
  timeRange: string;
  area: string;
  progress: {
    current: number;
    total: number;
  };
  weight: string;
  status: TaskHistoryStatus;
}

export interface TaskHistoryStats {
  monthlyTasks: number;
  taskDiff: number;
  totalWeight: string;
  avgWeightPerDay: string;
  avgTimePerRoute: string;
  timeDiff: string;
}