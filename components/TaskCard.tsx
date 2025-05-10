import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Task } from "@/types/task";
import { format } from "@/utils/date";
import { useSettingsStore } from "@/store/settings-store";
import { useTaskStore } from "@/store/task-store";
import Colors from "@/constants/colors";
import { Check } from "lucide-react-native";

interface TaskCardProps {
  task: Task;
  isFirst?: boolean;
  isLast?: boolean;
  prevTime?: string;
  nextTime?: string;
}

export default function TaskCard({
  task,
  isFirst = false,
  isLast = false,
  prevTime,
  nextTime,
}: TaskCardProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const toggleTaskCompletion = useTaskStore(
    (state) => state.toggleTaskCompletion
  );
  const theme = darkMode ? Colors.dark : Colors.light;

  const today = format(new Date(), "yyyy-MM-dd");
  const isCompleted = task.completionHistory[today] || false;

  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id, today, !isCompleted);
  };

  // Calculate timeline line heights based on time gaps
  const getLineHeight = (from?: string, to?: string) => {
    if (!from || !to) return 20;
    const [h1, m1] = from.split(":").map(Number);
    const [h2, m2] = to.split(":").map(Number);
    const diff = Math.abs(h2 * 60 + m2 - (h1 * 60 + m1));
    // Minimum 20, max 60 for big gaps
    return Math.max(20, Math.min(20 + diff, 60));
  };

  return (
    <View style={styles.timelineContainer}>
      {/* Timeline elements */}
      <View style={styles.timelineWrapper}>
        {task.time && (
          <Text style={[styles.timelineTime, { color: theme.subtext }]}>
            {task.time}
          </Text>
        )}
        {!isFirst && (
          <View
            style={[
              styles.timelineLineTop,
              {
                backgroundColor: theme.border,
                height: getLineHeight(prevTime, task.time),
              },
            ]}
          />
        )}
        <View
          style={[
            styles.timelineDot,
            {
              backgroundColor: isCompleted ? theme.success : theme.background,
              borderColor: isCompleted ? theme.success : theme.border,
            },
          ]}
        />
        {!isLast && (
          <View
            style={[
              styles.timelineLineBottom,
              {
                backgroundColor: theme.border,
                height: getLineHeight(task.time, nextTime),
              },
            ]}
          />
        )}
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={handleToggleCompletion}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{task.icon}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                  textDecorationLine: isCompleted ? "line-through" : "none",
                },
              ]}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text
                style={[
                  styles.description,
                  {
                    color: theme.subtext,
                    textDecorationLine: isCompleted ? "line-through" : "none",
                  },
                ]}
                numberOfLines={1}
              >
                {task.description}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.completionButton,
            {
              backgroundColor: isCompleted ? theme.success : theme.background,
              borderColor: theme.border,
            },
          ]}
          onPress={handleToggleCompletion}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isCompleted ? <Check size={16} color="#fff" /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineContainer: {
    flexDirection: "row",
    marginBottom: 4,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  timelineWrapper: {
    width: 40,
    alignItems: "center",
    marginRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  timelineLineTop: {
    width: 2,
    marginBottom: -2,
  },
  timelineLineBottom: {
    width: 2,
    marginTop: -2,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 1,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 0,
    borderWidth: 0,
    alignItems: "center",
    backgroundColor: "transparent",
    minHeight: 56,
    paddingVertical: 4,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    paddingRight: 44,
    minHeight: 40,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    marginRight: 4,
  },
  time: {
    fontSize: 12,
    marginRight: 8,
  },
  streakContainer: {
    marginLeft: 4,
  },
  streakBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  streakText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  completionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginRight: 16,
  },
  checkmark: {
    width: 12,
    height: 12,
    position: "relative",
  },
  checkmarkStem: {
    position: "absolute",
    width: 2,
    height: 8,
    backgroundColor: "#fff",
    left: 2,
    top: 0,
    transform: [{ rotate: "45deg" }],
  },
  checkmarkKick: {
    position: "absolute",
    width: 2,
    height: 5,
    backgroundColor: "#fff",
    left: 0,
    top: 5,
    transform: [{ rotate: "-45deg" }],
  },
  timelineTime: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: "center",
    width: "100%",
    fontWeight: "500",
  },
});
