import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WeekDay } from "@/types/task";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";

interface DaySelectorProps {
  selectedDays: WeekDay[];
  onChange: (days: WeekDay[]) => void;
}

const WEEKDAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DaySelector({
  selectedDays,
  onChange,
}: DaySelectorProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  const toggleDay = (day: WeekDay) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  const toggleAll = () => {
    if (selectedDays.length === WEEKDAYS.length) {
      onChange([]);
    } else {
      onChange([...WEEKDAYS]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {WEEKDAYS.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              style={styles.dayButtonContainer}
            >
              <View
                style={[
                  styles.day,
                  {
                    backgroundColor: isSelected ? theme.tint : theme.card,
                    borderColor: isSelected ? theme.tint : theme.border,
                  },
                ]}
              >
                <Text style={[styles.dayText, { color: theme.text }]}>
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={toggleAll}
        style={[
          styles.toggleAllButton,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
      >
        <Text style={[styles.toggleAllText, { color: theme.text }]}>
          {selectedDays.length === WEEKDAYS.length ? "Clear All" : "Select All"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  dayButtonContainer: {
    minWidth: 45,
  },
  day: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggleAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  toggleAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
