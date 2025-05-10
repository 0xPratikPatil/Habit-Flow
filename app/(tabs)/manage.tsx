import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/store/task-store';
import { useSettingsStore } from '@/store/settings-store';
import Colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { Edit2, Trash2, Plus, Zap } from 'lucide-react-native';
import { Alert } from 'react-native';

export default function ManageScreen() {
  const router = useRouter();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;
  
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  
  const handleDeleteTask = (id: string, title: string) => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => deleteTask(id),
          style: "destructive"
        }
      ]
    );
  };
  
  // Exclude Wake Up and Bedtime tasks
  const filteredTasks = tasks.filter(t => t.title !== 'Wake Up' && t.title !== 'Bedtime');
  // Sort tasks by time
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0];
    }
    return timeA[1] - timeB[1];
  });
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Manage Tasks
        </Text>
      </View>
      
      {tasks.length > 0 ? (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.taskCard, { backgroundColor: theme.card }]}>
              <View style={styles.taskInfo}>
                <View style={[styles.taskIconContainer, { backgroundColor: theme.background }]}>
                  <Text style={styles.taskIcon}>{item.icon}</Text>
                </View>
                <View style={styles.taskDetails}>
                  <Text style={[styles.taskTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <Text style={[styles.taskSchedule, { color: theme.subtext }]}>
                      {item.repeatDays.join(', ')} at {item.time}
                    </Text>
                    
                    {item.energyPoints > 0 && (
                      <View style={styles.energyPoints}>
                        <Zap size={12} color={theme.tint} />
                        <Text style={[styles.energyPointsText, { color: theme.tint }]}>
                          {item.energyPoints}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.card }]}
                  onPress={() => router.push(`/task/${item.id}`)}
                >
                  <Edit2 size={18} color={theme.text} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                  onPress={() => handleDeleteTask(item.id, item.title)}
                >
                  <Trash2 size={18} color={theme.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No tasks yet"
          message="Add your first task to get started with your routine."
          icon="📝"
        />
      )}
      
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={() => router.push('/task/new')}
      >
        <View style={[styles.fab, { backgroundColor: theme.tint }]}> 
          <Plus size={24} color="#fff" />
        </View>
      </TouchableOpacity>
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
    paddingBottom: 100,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskIcon: {
    fontSize: 20,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  taskSchedule: {
    fontSize: 14,
  },
  energyPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyPointsText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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