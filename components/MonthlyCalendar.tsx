import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import { format } from "@/utils/date";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface MonthlyCalendarProps {
  completionHistory: Record<string, boolean>;
  month?: Date;
}

export default function MonthlyCalendar({
  completionHistory,
  month: initialMonth,
}: MonthlyCalendarProps) {
  const [month, setMonth] = useState(initialMonth || new Date());
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  // Get first day of month
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  // Get last day of month
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();

  // Calculate days to display (previous month, current month, next month)
  const daysInMonth = lastDay.getDate();

  // Create array of dates to display
  const calendarDays = [];

  // Add days from previous month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const date = new Date(firstDay);
    date.setDate(date.getDate() - (firstDayOfWeek - i));
    calendarDays.push({
      date,
      isCurrentMonth: false,
    });
  }

  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i);
    calendarDays.push({
      date,
      isCurrentMonth: true,
    });
  }

  // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(lastDay);
    date.setDate(date.getDate() + i);
    calendarDays.push({
      date,
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setMonth(newMonth);
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <ChevronLeft size={20} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.monthTitle, { color: theme.text }]}>
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
        </Text>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <ChevronRight size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text key={index} style={[styles.weekDay, { color: theme.subtext }]}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {calendarDays.map((item, index) => {
          const dateStr = format(item.date, "yyyy-MM-dd");
          const isCompleted = completionHistory[dateStr];
          const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;

          return (
            <View key={index} style={styles.dayCell}>
              <View
                style={[
                  styles.dayCircle,
                  isToday && { borderColor: theme.tint, borderWidth: 1 },
                  isCompleted === true && { backgroundColor: theme.success },
                  isToday && { borderColor: theme.tint, borderWidth: 1 },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isCompleted
                        ? darkMode
                          ? "#000"
                          : "#fff"
                        : isToday
                        ? theme.tint
                        : item.isCurrentMonth
                        ? theme.text
                        : theme.subtext,
                    },
                  ]}
                >
                  {item.date.getDate()}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  weekDaysContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: "80%",
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
