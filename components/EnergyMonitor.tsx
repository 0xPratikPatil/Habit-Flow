import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import { useTaskStore } from "@/store/task-store";
import Colors from "@/constants/colors";
import { Zap, Battery, BatteryCharging } from "lucide-react-native";

interface EnergyMonitorProps {
  compact?: boolean;
}

export default function EnergyMonitor({ compact = false }: EnergyMonitorProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const dailyEnergyLimit = useSettingsStore((state) => state.dailyEnergyLimit);
  const theme = darkMode ? Colors.dark : Colors.light;

  // Only include real user tasks (exclude Wake Up and Bedtime)
  const getTodayTasks = useTaskStore((state) => state.getTodayTasks);
  const todayTasks = getTodayTasks().filter(
    (task) => task.title !== "Wake Up" && task.title !== "Bedtime"
  );

  // Calculate total energy for today's tasks
  const todayEnergy = todayTasks.reduce(
    (sum, task) => sum + (task.energyPoints || 0),
    0
  );

  // Calculate energy usage percentage
  const energyPercentage = Math.min(
    100,
    (todayEnergy / dailyEnergyLimit) * 100
  );

  // Determine bar color based on energy percentage
  let barColor = theme.tint;
  if (energyPercentage > 80) barColor = theme.error;
  else if (energyPercentage > 50) barColor = theme.warning;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Zap size={16} color={theme.tint} style={{ marginRight: 4 }} />
          <Text style={[styles.compactText, { color: theme.text }]}>
            {todayEnergy} / {dailyEnergyLimit}
          </Text>
        </View>

        <View
          style={[styles.energyBarContainer, { backgroundColor: theme.card }]}
        >
          <View
            style={[
              styles.energyBar,
              { width: `${energyPercentage}%`, backgroundColor: barColor },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Energy Monitor
        </Text>
        <View style={styles.energyBadge}>
          <Zap size={16} color={theme.tint} style={{ marginRight: 4 }} />
          <Text style={[styles.energyText, { color: theme.tint }]}>
            {todayEnergy} / {dailyEnergyLimit}
          </Text>
        </View>
      </View>

      <View
        style={[styles.energyBarContainer, { backgroundColor: theme.card }]}
      >
        <View
          style={[
            styles.energyBar,
            { width: `${energyPercentage}%`, backgroundColor: barColor },
          ]}
        />
      </View>

      <View style={styles.status}>
        {energyPercentage <= 50 ? (
          <BatteryCharging
            size={20}
            color={theme.success}
            style={{ marginRight: 8 }}
          />
        ) : energyPercentage <= 80 ? (
          <Battery size={20} color={theme.warning} style={{ marginRight: 8 }} />
        ) : (
          <Battery size={20} color={theme.error} style={{ marginRight: 8 }} />
        )}

        <Text
          style={[
            styles.statusText,
            {
              color:
                energyPercentage <= 50
                  ? theme.success
                  : energyPercentage <= 80
                  ? theme.warning
                  : theme.error,
            },
          ]}
        >
          {energyPercentage <= 50
            ? "Good energy balance"
            : energyPercentage <= 80
            ? "Moderate energy usage"
            : "High energy consumption"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  energyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  energyBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  energyBar: {
    height: "100%",
    borderRadius: 6,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  compactContainer: {
    padding: 12,
  },
  compactHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  compactText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
