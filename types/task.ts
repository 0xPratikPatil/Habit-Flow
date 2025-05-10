export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface CompletionHistory {
  [date: string]: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  icon: string;
  repeatDays: WeekDay[];
  time: string;
  energyPoints: number;
  dailyReward?: string;
  weeklyReward?: string;
  monthlyReward?: string;
  streak: number;
  completionHistory: CompletionHistory;
  createdAt: string;
  updatedAt: string;
  notificationIds?: string[];
}

export type TaskFormData = Omit<Task, 'id' | 'streak' | 'completionHistory' | 'createdAt' | 'updatedAt' | 'notificationIds'>;