import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTaskStore } from "@/store/task-store";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import { X, Flame, CheckCircle, Award, Gift, Trophy } from "lucide-react-native";


export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  const getTaskById = useTaskStore((state) => state.getTaskById);
  const task = getTaskById(id);

  if (!task) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.errorText, { color: theme.error }]}>
          Task not found
        </Text>
      </SafeAreaView>
    );
  }

  // Calculate completion rate
  const calculateCompletionRate = (): string => {
    const totalEntries = Object.keys(task.completionHistory).length;
    if (totalEntries === 0) return "0";

    const completedEntries = Object.values(task.completionHistory).filter(
      Boolean
    ).length;
    const rate = (completedEntries / totalEntries) * 100;
    return rate.toFixed(0);
  };

  // Calculate longest streak
  const calculateLongestStreak = (): number => {
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.tint }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.taskHeader}>
          <Text style={styles.taskIcon}>{task.icon}</Text>
          <Text style={[styles.taskTitle, { color: theme.text }]}>
            {task.title}
          </Text>

          {task.description ? (
            <Text style={[styles.taskDescription, { color: theme.subtext }]}>
              {task.description}
            </Text>
          ) : null}
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Flame size={20} color={theme.warning} style={{ marginRight: 8 }} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>
                Current Streak
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {task.streak}
              </Text>
            </View>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: theme.border }]}
          />

          <View style={styles.statItem}>
            <CheckCircle size={20} color={theme.success} style={{ marginRight: 8 }} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>
                Completion Rate
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {calculateCompletionRate()}%
              </Text>
            </View>
          </View>

          <View
            style={[styles.statDivider, { backgroundColor: theme.border }]}
          />

          <View style={styles.statItem}>
            <Award size={20} color={theme.tint} style={{ marginRight: 8 }} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>
                Longest Streak
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {calculateLongestStreak()}{" "}
                {calculateLongestStreak() === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.calendarContainer, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Completion History
          </Text>
          <MonthlyCalendar completionHistory={task.completionHistory} />
        </View>

        {(task.dailyReward || task.weeklyReward || task.monthlyReward) && (
          <View style={styles.rewardsCardContainer}>
            <View style={[styles.rewardsHeader, { backgroundColor: theme.card }]}> 
              <Text style={[styles.rewardsHeaderText, { color: theme.text }]}>Rewards</Text>
            </View>
            {task.dailyReward && (
              <View>
                <View style={styles.rewardCardVertical}>
                  <View style={[styles.rewardIconBg, { backgroundColor: theme.success + '22' }]}> 
                    <Gift size={28} color={theme.success} />
                  </View>
                  <View style={styles.rewardTextContainer}>
                    <Text style={[styles.rewardTypeVertical, { color: theme.success }]}>Daily</Text>
                    <Text style={[styles.rewardValueVertical, { color: theme.text }]}>{task.dailyReward}</Text>
                  </View>
                </View>
                {(task.weeklyReward || task.monthlyReward) && <View style={[styles.rewardSeparatorVertical, { backgroundColor: theme.border }]} />}
              </View>
            )}
            {task.weeklyReward && (
              <View>
                <View style={styles.rewardCardVertical}>
                  <View style={[styles.rewardIconBg, { backgroundColor: theme.warning + '22' }]}> 
                    <Award size={28} color={theme.warning} />
                  </View>
                  <View style={styles.rewardTextContainer}>
                    <Text style={[styles.rewardTypeVertical, { color: theme.warning }]}>Weekly</Text>
                    <Text style={[styles.rewardValueVertical, { color: theme.text }]}>{task.weeklyReward}</Text>
                  </View>
                </View>
                {task.monthlyReward && <View style={[styles.rewardSeparatorVertical, { backgroundColor: theme.border }]} />}
              </View>
            )}
            {task.monthlyReward && (
              <View style={styles.rewardCardVertical}>
                <View style={[styles.rewardIconBg, { backgroundColor: theme.tint + '22' }]}> 
                  <Trophy size={28} color={theme.tint} />
                </View>
                <View style={styles.rewardTextContainer}>
                  <Text style={[styles.rewardTypeVertical, { color: theme.tint }]}>Monthly</Text>
                  <Text style={[styles.rewardValueVertical, { color: theme.text }]}>{task.monthlyReward}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  taskHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  taskIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  taskDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    maxWidth: "80%",
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  todayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  streakSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  calendarContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  statDivider: {
    height: 1,
    marginVertical: 8,
  },
  statTextContainer: {
    marginLeft: 12,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  rewardsCardContainer: {
    borderRadius: 18,
    padding: 0,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  rewardsHeader: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  rewardsHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  rewardSeparatorVertical: {
    height: 1,
    marginHorizontal: 12,
  },
  rewardCardVertical: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 64,
  },
  rewardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rewardTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rewardTypeVertical: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  rewardValueVertical: {
    fontWeight: '400',
    fontSize: 17,
    marginTop: 2,
    textAlign: 'left',
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
  rewardCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginHorizontal: 4,
  },
  rewardType: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  rewardSeparator: {
    height: 16,
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 4,
    marginHorizontal: 8,
  },
  rewardCardModern: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 110,
  },
  rewardPill: {
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 6,
    letterSpacing: 1,
  },
  rewardValueModern: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 6,
    textAlign: 'center',
  },
});
