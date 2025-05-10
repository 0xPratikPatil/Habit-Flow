import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/store/task-store';
import { useSettingsStore } from '@/store/settings-store';
import Colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import { Task } from '@/types/task';

export default function StreaksScreen() {
  const router = useRouter();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;
  
  const tasks = useTaskStore((state) => state.tasks);
  
  // Find Wake Up and Bedtime tasks
  const wakeUpTask = tasks.find(t => t.title === 'Wake Up');
  const bedTimeTask = tasks.find(t => t.title === 'Bedtime');
  // Filter out Wake Up and Bedtime from the main list
  const otherTasks = tasks.filter(t => t.title !== 'Wake Up' && t.title !== 'Bedtime');
  // Sort other tasks by streak (highest first)
  const sortedOtherTasks = [...otherTasks].sort((a, b) => b.streak - a.streak);
  // Compose final list: Wake Up, others, Bedtime
  const streakTasks = [
    ...(wakeUpTask ? [wakeUpTask] : []),
    ...sortedOtherTasks,
    ...(bedTimeTask ? [bedTimeTask] : [])
  ];
  
  // Calculate longest streak for each task
  const calculateLongestStreak = (task: Task) => {
    const history = task.completionHistory;
    let longestStreak = 0;
    let currentStreak = 0;
    
    // Convert dates to array and sort
    const dates = Object.keys(history).sort();
    
    for (let i = 0; i < dates.length; i++) {
      if (history[dates[i]]) {
        currentStreak++;
        
        // Check if this is a new longest streak
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Streaks
        </Text>
      </View>
      
      {tasks.length > 0 ? (
        <FlatList
          data={streakTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const longestStreak = calculateLongestStreak(item);
            
            return (
              <TouchableOpacity
                style={[styles.taskCard, { backgroundColor: theme.card }]}
                onPress={() => router.push(`/task-detail/${item.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskIcon}>{item.icon}</Text>
                    <View style={styles.taskDetails}>
                      <Text style={[styles.taskTitle, { color: theme.text }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.taskSchedule, { color: theme.subtext }]}>
                        {item.repeatDays.join(', ')} at {item.time}
                      </Text>
                    </View>
                  </View>
                  
                </View>
                
                <View style={styles.calendarContainer}>
                  <WeeklyCalendar completionHistory={item.completionHistory} />
                </View>
                
                <View style={styles.streakStats}>
                  <View style={styles.streakStat}>
                    <Text style={[styles.streakStatLabel, { color: theme.subtext }]}>
                      Current Streak
                    </Text>
                    <Text style={[styles.streakStatValue, { color: theme.text }]}>
                      {item.streak} {item.streak === 1 ? 'day' : 'days'}
                    </Text>
                  </View>
                  
                  <View style={styles.streakStat}>
                    <Text style={[styles.streakStatLabel, { color: theme.subtext }]}>
                      Longest Streak
                    </Text>
                    <Text style={[styles.streakStatValue, { color: theme.text }]}>
                      {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No streaks yet"
          message="Complete your tasks consistently to build streaks."
          icon="🔥"
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  taskList: {
    padding: 20,
    paddingBottom: 40,
  },
  taskCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskSchedule: {
    fontSize: 14,
  },
  streakContainer: {
    marginLeft: 12,
  },
  calendarContainer: {
    paddingHorizontal: 8,
  },
  streakStats: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  streakStat: {
    flex: 1,
  },
  streakStatLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  streakStatValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});