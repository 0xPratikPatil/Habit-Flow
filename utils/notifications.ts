import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Task } from '@/types/task';
import { parseTimeString } from './date';

/**
 * Requests notification permissions from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationsPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Cancels all scheduled notifications for a given task.
 */
export async function cancelTaskNotifications(taskId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.data?.taskId === taskId) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
}

/**
 * Schedules notifications for a task based on its repeat days and time.
 * Handles daily, weekly, and one-time tasks.
 */
export async function scheduleTaskNotification(task: Task): Promise<string[] | null> {
  if (Platform.OS === 'web') return null;
  const hasPermission = await requestNotificationsPermission();
  if (!hasPermission) {
    console.warn('Notification permission not granted');
    return null;
  }

  await cancelTaskNotifications(task.id);

  const { hours, minutes } = parseTimeString(task.time);
  const notificationIds: string[] = [];
  const now = new Date();

  // Map day string to day number (0 = Sunday, 1 = Monday, etc.)
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  // Helper to schedule a notification
  async function schedule(content: Notifications.NotificationContentInput, trigger: Notifications.NotificationTriggerInput) {
    try {
      const id = await Notifications.scheduleNotificationAsync({ content, trigger });
      notificationIds.push(id);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  // If repeatDays is empty, schedule a one-time notification for the next occurrence
  if (!task.repeatDays || task.repeatDays.length === 0) {
    const triggerDate = new Date(now);
    triggerDate.setHours(hours, minutes, 0, 0);
    // If the time has already passed today, schedule for tomorrow
    if (triggerDate <= now) triggerDate.setDate(triggerDate.getDate() + 1);
    await schedule(
      {
        title: task.title,
        body: task.description || "It's time for your scheduled task!",
        data: { taskId: task.id },
        sound: true,
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      }
    );
    return notificationIds;
  }

  // If all 7 days are selected, treat as daily
  if (task.repeatDays.length === 7) {
    // Schedule a daily notification
    await schedule(
      {
        title: task.title,
        body: task.description || "It's time for your daily task!",
        data: { taskId: task.id },
        sound: true,
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      }
    );
    return notificationIds;
  }

  // Otherwise, schedule for each selected weekday
  for (const day of task.repeatDays) {
    const weekday = dayMap[day];
    if (weekday === undefined) continue;
    // Expo uses 1-7 for weekdays (1 = Sunday)
    const expoWeekday = weekday + 1;
    await schedule(
      {
        title: task.title,
        body: task.description || `It's time for your ${day} task!`,
        data: { taskId: task.id },
        sound: true,
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: expoWeekday,
        hour: hours,
        minute: minutes,
      }
    );
  }

  return notificationIds;
}

/**
 * Sets up notification handlers and channels.
 * Should be called once on app startup.
 */
export async function setupNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    await requestNotificationsPermission();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.error('Failed to setup notification handler:', error);
  }
}