import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import { ChevronRight } from "lucide-react-native";

interface SettingsItemProps {
  title: string;
  description?: string;
  type: "toggle" | "link";
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}

export default function SettingsItem({
  title,
  description,
  type,
  value,
  onToggle,
  onPress,
}: SettingsItemProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: theme.border }]}
      onPress={type === "link" ? onPress : undefined}
      disabled={type !== "link"}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: theme.subtext }]}>
            {description}
          </Text>
        ) : null}
      </View>

      {type === "toggle" && onToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#767577", true: theme.tint }}
          thumbColor="#f4f3f4"
        />
      ) : (
        <ChevronRight size={20} color={theme.subtext} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});
