import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '@/types/settings';

interface SettingsState extends Settings {
  setDarkMode: (darkMode: boolean) => void;
  setNotifications: (notifications: boolean) => void;
  setUserName: (userName: string) => void;
  setDailyEnergyLimit: (limit: number) => void;
  setWakeUpTime: (time: string) => void;
  setBedTime: (time: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      notifications: true,
      userName: '',
      dailyEnergyLimit: 20,
      wakeUpTime: '06:00',
      bedTime: '22:00',
      setDarkMode: (darkMode) => set({ darkMode }),
      setNotifications: (notifications) => set({ notifications }),
      setUserName: (userName) => set({ userName }),
      setDailyEnergyLimit: (dailyEnergyLimit) => set({ dailyEnergyLimit }),
      setWakeUpTime: (wakeUpTime) => set({ wakeUpTime }),
      setBedTime: (bedTime) => set({ bedTime }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);