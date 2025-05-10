import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, WeekDay } from '@/types/task';
import { format } from '@/utils/date';

interface TaskState {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'streak' | 'completionHistory' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string, date: string, completed: boolean) => void;
  getTaskById: (id: string) => Task | undefined;
  getTodayTasks: () => Task[];
  getTasksForDay: (day: WeekDay) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => {
        const now = new Date().toISOString();
        // Use crypto.randomUUID if available, otherwise fallback to timestamp + random
        const uniqueId =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const newTask: Task = {
          id: uniqueId,
          ...taskData,
          streak: 0,
          completionHistory: {},
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      
      updateTask: (id, taskData) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...taskData,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      toggleTaskCompletion: (id, date, completed) => {
        set((state) => {
          const tasks = [...state.tasks];
          const taskIndex = tasks.findIndex((t) => t.id === id);
          
          if (taskIndex === -1) return state;
          
          const task = { ...tasks[taskIndex] };
          
          // Update completion history
          task.completionHistory = {
            ...task.completionHistory,
            [date]: completed,
          };
          
          // Update streak
          if (completed) {
            // Check if yesterday was completed to continue streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
            
            if (task.completionHistory[yesterdayStr] || task.streak === 0) {
              task.streak += 1;
            }
          } else {
            // If today is uncompleted, reset streak
            const today = format(new Date(), 'yyyy-MM-dd');
            if (date === today) {
              task.streak = 0;
            }
          }
          
          tasks[taskIndex] = task;
          
          return { tasks };
        });
      },
      
      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },
      
      getTodayTasks: () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Map JavaScript day to our WeekDay type
        const dayMap: Record<number, WeekDay> = {
          0: 'Sun',
          1: 'Mon',
          2: 'Tue',
          3: 'Wed',
          4: 'Thu',
          5: 'Fri',
          6: 'Sat',
        };
        
        const todayWeekDay = dayMap[dayOfWeek];
        
        return get().tasks.filter((task) => task.repeatDays.includes(todayWeekDay));
      },
      
      getTasksForDay: (day) => {
        return get().tasks.filter((task) => task.repeatDays.includes(day));
      },
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);