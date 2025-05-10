import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/store/task-store';
import { useSettingsStore } from '@/store/settings-store';
import Colors from '@/constants/colors';
import { X, Zap, Battery, BatteryCharging } from 'lucide-react-native';
import { Task } from '@/types/task';

export default function EnergyMonitorScreen() {
  const router = useRouter();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const dailyEnergyLimit = useSettingsStore((state) => state.dailyEnergyLimit);
  const theme = darkMode ? Colors.dark : Colors.light;
  
  const tasks = useTaskStore((state) => state.tasks);
  const getTodayTasks = useTaskStore((state) => state.getTodayTasks);
  const todayTasks = getTodayTasks();
  
  // Remove Wake Up and Bedtime (energyPoints === 0) from all calculations and displays
  const filteredTasks = tasks.filter(task => task.energyPoints > 0);
  const filteredTodayTasks = todayTasks.filter(task => task.energyPoints > 0);

  // Calculate total energy for all tasks
  const totalEnergy = filteredTasks.reduce((sum, task) => sum + (task.energyPoints || 0), 0);
  
  // Calculate total energy for today's tasks
  const todayEnergy = filteredTodayTasks.reduce((sum, task) => sum + (task.energyPoints || 0), 0);
  
  // Calculate energy usage percentage
  const energyPercentage = Math.min(100, (todayEnergy / dailyEnergyLimit) * 100);
  
  // Group tasks by energy level
  const tasksByEnergy: Record<number, Task[]> = {};
  filteredTasks.forEach((task) => {
    const energy = task.energyPoints || 0;
    if (!tasksByEnergy[energy]) {
      tasksByEnergy[energy] = [];
    }
    tasksByEnergy[energy].push(task);
  });
  
  // Sort energy levels in descending order
  const energyLevels = Object.keys(tasksByEnergy)
    .map(Number)
    .sort((a, b) => b - a);

  // Determine bar color based on energy percentage
  let barColor = theme.tint;
  if (energyPercentage > 80) barColor = theme.error;
  else if (energyPercentage > 50) barColor = theme.warning;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <X size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Energy Monitor</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.energyOverview}>
          <View style={styles.energyHeader}>
            <Text style={[styles.energyTitle, { color: theme.text }]}>Today's Energy</Text>
            <View style={styles.energyBadge}>
              <Zap size={16} color={theme.tint} />
              <Text style={[styles.energyBadgeText, { color: theme.tint }]}> {todayEnergy} / {dailyEnergyLimit} </Text>
            </View>
          </View>
          <View style={[styles.energyBarContainer, { backgroundColor: theme.card }]}> 
            <View style={[styles.energyBar, { width: `${energyPercentage}%`, backgroundColor: barColor }]} />
          </View>
          <View style={styles.energyStatus}>
            {energyPercentage <= 50 ? (
              <BatteryCharging size={20} color={theme.success} />
            ) : energyPercentage <= 80 ? (
              <Battery size={20} color={theme.warning} />
            ) : (
              <Battery size={20} color={theme.error} />
            )}
            <Text style={[
              styles.energyStatusText, 
              { 
                color: energyPercentage <= 50 
                  ? theme.success 
                  : energyPercentage <= 80 
                    ? theme.warning 
                    : theme.error 
              }
            ]}>
              {energyPercentage <= 50 
                ? "Good energy balance" 
                : energyPercentage <= 80 
                  ? "Moderate energy usage" 
                  : "High energy consumption"}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Energy Distribution</Text>
          {energyLevels.map((energy) => (
            <View key={energy} style={[styles.energyGroup, { backgroundColor: theme.card }]}> 
              <View style={styles.energyGroupHeader}>
                <View style={styles.energyLevel}>
                  <Zap size={16} color={theme.text} />
                  <Text style={[styles.energyLevelText, { color: theme.text }]}> {energy} {energy === 1 ? 'point' : 'points'} </Text>
                </View>
                <Text style={[styles.energyCount, { color: theme.subtext }]}> {tasksByEnergy[energy].length} {tasksByEnergy[energy].length === 1 ? 'task' : 'tasks'} </Text>
              </View>
              <View style={styles.taskList}>
                {tasksByEnergy[energy].map((task: Task) => (
                  <View 
                    key={task.id} 
                    style={[styles.taskItem, { borderBottomColor: theme.border }]}
                  >
                    <Text style={styles.taskIcon}>{task.icon}</Text>
                    <View style={styles.taskDetails}>
                      <Text style={[styles.taskTitle, { color: theme.text }]}>{task.title}</Text>
                      <Text style={[styles.taskSchedule, { color: theme.subtext }]}> {task.repeatDays.join(', ')} at {task.time} </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.tips}>
          <Text style={[styles.tipsTitle, { color: theme.text }]}>Energy Tips</Text>
          <View style={[styles.tipCard, { backgroundColor: theme.card }]}> 
            <Text style={[styles.tipText, { color: theme.text }]}>• Balance high and low energy tasks throughout your day</Text>
            <Text style={[styles.tipText, { color: theme.text }]}>• Schedule demanding tasks during your peak energy hours</Text>
            <Text style={[styles.tipText, { color: theme.text }]}>• Take short breaks between high energy tasks</Text>
            <Text style={[styles.tipText, { color: theme.text }]}>• Consider reducing your daily energy limit if you feel overwhelmed</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  energyOverview: {
    marginBottom: 24,
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  energyBadgeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  energyBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  energyBar: {
    height: '100%',
    borderRadius: 6,
  },
  energyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  energyStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  energyGroup: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  energyGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  energyLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  energyLevelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  energyCount: {
    fontSize: 14,
  },
  taskList: {
    padding: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  taskIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskSchedule: {
    fontSize: 14,
  },
  tips: {
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipCard: {
    padding: 16,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
});