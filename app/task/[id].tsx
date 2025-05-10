import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '@/store/task-store';
import { useSettingsStore } from '@/store/settings-store';
import Colors from '@/constants/colors';
import { TaskFormData, WeekDay } from '@/types/task';
import DaySelector from '@/components/DaySelector';
import IconPicker from '@/components/IconPicker';
import TimePickerInput from '@/components/TimePickerInput';
import EnergySelector from '@/components/EnergySelector';
import { scheduleTaskNotification, cancelTaskNotifications } from '@/utils/notifications';
import { ChevronDown, ChevronUp, X } from 'lucide-react-native';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const notifications = useSettingsStore((state) => state.notifications);
  const theme = darkMode ? Colors.dark : Colors.light;
  
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  
  const task = getTaskById(id);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    icon: '📝',
    repeatDays: ['Mon', 'Wed', 'Fri'],
    time: '09:00',
    energyPoints: 3,
    dailyReward: '',
    weeklyReward: '',
    monthlyReward: '',
  });
  
  const [showRewards, setShowRewards] = useState(false);
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        icon: task.icon,
        repeatDays: task.repeatDays,
        time: task.time,
        energyPoints: task.energyPoints || 3,
        dailyReward: task.dailyReward,
        weeklyReward: task.weeklyReward,
        monthlyReward: task.monthlyReward,
      });
      
      // Show rewards section if any rewards are set
      if (task.dailyReward || task.weeklyReward || task.monthlyReward) {
        setShowRewards(true);
      }
    }
  }, [task]);
  
  const handleChange = (key: keyof TaskFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }
    
    if (formData.repeatDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }
    
    // Sort the repeat days in correct order
    const dayOrder: Record<WeekDay, number> = {
      'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6
    };
    
    const sortedDays = [...formData.repeatDays].sort(
      (a, b) => dayOrder[a] - dayOrder[b]
    );
    
    updateTask(id, { ...formData, repeatDays: sortedDays });
    
    // Handle notifications
    if (Platform.OS !== 'web' && notifications) {
      try {
        await cancelTaskNotifications(id);
        await scheduleTaskNotification({
          ...task!,
          ...formData,
          repeatDays: sortedDays,
        });
      } catch (error) {
        console.log('Failed to update notifications:', error);
      }
    }
    
    router.back();
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            if (Platform.OS !== 'web') {
              try {
                await cancelTaskNotifications(id);
              } catch (error) {
                console.log('Failed to cancel notifications:', error);
              }
            }
            deleteTask(id);
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Task not found</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Task</Text>
        <View style={styles.placeholder} />
      </View>
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Task Icon</Text>
            <IconPicker
              value={formData.icon}
              onChange={(icon) => handleChange('icon', icon)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              value={formData.title}
              onChangeText={(text) => handleChange('title', text)}
              placeholder="Enter task title"
              placeholderTextColor={theme.subtext}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Description (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              placeholder="Enter task description"
              placeholderTextColor={theme.subtext}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Repeat Days</Text>
            <DaySelector
              selectedDays={formData.repeatDays}
              onChange={(days) => handleChange('repeatDays', days)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Time</Text>
            <TimePickerInput
              value={formData.time}
              onChange={(time) => handleChange('time', time)}
            />
          </View>
          
          <EnergySelector
            value={formData.energyPoints}
            onChange={(value) => handleChange('energyPoints', value)}
          />
          
          <TouchableOpacity 
            style={styles.rewardsHeader}
            onPress={() => setShowRewards(!showRewards)}
          >
            <Text style={[styles.label, { color: theme.text }]}>Rewards (Optional)</Text>
            {showRewards ? (
              <ChevronUp size={20} color={theme.text} />
            ) : (
              <ChevronDown size={20} color={theme.text} />
            )}
          </TouchableOpacity>
          
          {showRewards && (
            <View style={styles.formGroup}>
              <View style={styles.rewardGroup}>
                <Text style={[styles.rewardLabel, { color: theme.subtext }]}>Daily Reward</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.rewardInput,
                    { 
                      backgroundColor: theme.card,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={formData.dailyReward}
                  onChangeText={(text) => handleChange('dailyReward', text)}
                  placeholder="Daily reward (optional)"
                  placeholderTextColor={theme.subtext}
                />
              </View>
              
              <View style={styles.rewardGroup}>
                <Text style={[styles.rewardLabel, { color: theme.subtext }]}>Weekly Reward (7+ days)</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.rewardInput,
                    { 
                      backgroundColor: theme.card,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={formData.weeklyReward}
                  onChangeText={(text) => handleChange('weeklyReward', text)}
                  placeholder="Weekly reward (optional)"
                  placeholderTextColor={theme.subtext}
                />
              </View>
              
              <View style={styles.rewardGroup}>
                <Text style={[styles.rewardLabel, { color: theme.subtext }]}>Monthly Reward (30+ days)</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.rewardInput,
                    { 
                      backgroundColor: theme.card,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={formData.monthlyReward}
                  onChangeText={(text) => handleChange('monthlyReward', text)}
                  placeholder="Monthly reward (optional)"
                  placeholderTextColor={theme.subtext}
                />
              </View>
            </View>
          )}
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleSave}
            >
              <View style={[styles.saveButton, { backgroundColor: theme.tint }]}>
                <Text style={styles.saveButtonText}>Save</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: theme.error }]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 20,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
  },
  rewardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardGroup: {
    marginBottom: 12,
  },
  rewardLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  rewardInput: {
    marginBottom: 0,
  },
  buttonGroup: {
    marginTop: 12,
    marginBottom: 40,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});