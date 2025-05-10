import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/store/task-store';
import { useSettingsStore } from '@/store/settings-store';
import Colors from '@/constants/colors';
import TaskCard from '@/components/TaskCard';
import EmptyState from '@/components/EmptyState';
import { Zap } from 'lucide-react-native';

export default function TodayScreen() {
  const router = useRouter();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const userName = useSettingsStore((state) => state.userName);
  const dailyEnergyLimit = useSettingsStore((state) => state.dailyEnergyLimit);
  const theme = darkMode ? Colors.dark : Colors.light;
  
  // Get tasks for today
  const tasks = useTaskStore((state) => state.tasks);
  const getTodayTasks = useTaskStore((state) => state.getTodayTasks);
  const addTask = useTaskStore((state) => state.addTask);
  const wakeUpTime = useSettingsStore((state) => state.wakeUpTime);
  const bedTime = useSettingsStore((state) => state.bedTime);
  
  // Ensure Wake Up and Bedtime tasks exist
  useEffect(() => {
    // Only run if tasks are loaded
    if (!tasks) return;
    const hasWakeUp = tasks.some(t => t.title === 'Wake Up');
    const hasBedtime = tasks.some(t => t.title === 'Bedtime');
    if (!hasWakeUp) {
      addTask({
        title: 'Wake Up',
        description: '',
        icon: '☀️',
        repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        time: wakeUpTime,
        energyPoints: 0,
        dailyReward: '',
        weeklyReward: '',
        monthlyReward: '',
      });
    }
    if (!hasBedtime) {
      addTask({
        title: 'Bedtime',
        description: '',
        icon: '🛌',
        repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        time: bedTime,
        energyPoints: 0,
        dailyReward: '',
        weeklyReward: '',
        monthlyReward: '',
      });
    }
  }, [tasks, wakeUpTime, bedTime, addTask]);
  
  // Calculate total energy for today's tasks (excluding Wake Up and Bedtime)
  const todayEnergy = getTodayTasks().filter(task => task.energyPoints > 0).reduce((sum, task) => sum + (task.energyPoints || 0), 0);
  
  // Check if user has completed onboarding
  useEffect(() => {
    if (!userName || userName.trim() === "") {
      router.replace('/onboarding');
    }
  }, [userName, router]);
  
  // Sort tasks by time, but always put Wake Up first and Bedtime last if present
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.title === 'Wake Up') return -1;
    if (b.title === 'Wake Up') return 1;
    if (a.title === 'Bedtime') return 1;
    if (b.title === 'Bedtime') return -1;
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0];
    }
    return timeA[1] - timeB[1];
  });
  
  const today = new Date();
  const minimalDate = `${today.toLocaleString('default', { weekday: 'long' })}, ${today.getDate()} ${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Hello, {userName || 'there'}
          </Text>
          <Text style={{ color: theme.subtext, fontSize: 13, marginTop: 2 }}>
            {minimalDate}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.energyBadge, { backgroundColor: theme.card }]}
          onPress={() => router.push('/energy-monitor')}
        >
          <Zap size={16} color={theme.tint} />
          <Text style={[styles.energyText, { color: theme.tint }]}>
            {todayEnergy}/{dailyEnergyLimit}
          </Text>
        </TouchableOpacity>
      </View>
      
      {sortedTasks.length > 0 ? (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TaskCard 
              task={item} 
              isFirst={index === 0}
              isLast={index === sortedTasks.length - 1}
              prevTime={index > 0 ? sortedTasks[index - 1].time : undefined}
              nextTime={index < sortedTasks.length - 1 ? sortedTasks[index + 1].time : undefined}
            />
          )}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No tasks for today"
          message="Add tasks to start building your daily routine."
          icon="🎯"
        />
      )}
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
  },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  energyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskList: {
    padding: 20,
    paddingBottom: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});