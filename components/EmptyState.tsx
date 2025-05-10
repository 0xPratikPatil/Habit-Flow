import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}

export default function EmptyState({
  title,
  message,
  icon = "📝",
}: EmptyStateProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.subtext }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 300,
  },
});
