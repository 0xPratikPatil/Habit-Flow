import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import { format, getCurrentWeekDates, isToday } from "@/utils/date";

interface WeeklyCalendarProps {
  completionHistory: Record<string, boolean>;
}

export default function WeeklyCalendar({
  completionHistory,
}: WeeklyCalendarProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  const weekDates = getCurrentWeekDates();

  return (
    <View style={styles.container}>
      {weekDates.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayName = format(date, "EEE");
        const dayNum = date.getDate();

        const isCompleted = completionHistory[dateStr];
        const isTodayDate = isToday(date);

        return (
          <View key={dateStr} style={styles.dayColumn}>
            <Text
              style={[
                styles.dayName,
                { color: isTodayDate ? theme.tint : theme.subtext },
              ]}
            >
              {dayName}
            </Text>

            <View
              style={[
                styles.dateCircle,
                {
                  backgroundColor: isCompleted ? theme.success : "transparent",
                  borderColor: isTodayDate
                    ? theme.tint
                    : isCompleted === false
                    ? theme.error
                    : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.dateNumber,
                  {
                    color: isCompleted
                      ? darkMode
                        ? "#000"
                        : "#fff"
                      : isTodayDate
                      ? theme.tint
                      : theme.text,
                  },
                ]}
              >
                {dayNum}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  dayColumn: {
    alignItems: "center",
    width: 40,
  },
  dayName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: "500",
  },
});
