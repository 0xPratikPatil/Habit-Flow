import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import { Zap } from "lucide-react-native";

interface EnergySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function EnergySelector({
  value,
  onChange,
}: EnergySelectorProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  const energyLevels = [1, 2, 3, 5, 8, 10];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>Energy Required</Text>
      <Text style={[styles.description, { color: theme.subtext }]}>
        How much energy does this task require?
      </Text>

      <View style={styles.energyLevels}>
        {energyLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.energyButton,
              {
                backgroundColor: value === level ? theme.tint : theme.card,
                borderColor: value === level ? theme.tint : theme.card,
                borderWidth: 1,
                marginRight: 8,
                marginBottom: 8,
              },
            ]}
            onPress={() => onChange(level)}
          >
            <View style={styles.energyContent}>
              <Zap
                size={16}
                color={value === level ? "#fff" : theme.text}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.energyText,
                  { color: value === level ? "#fff" : theme.text },
                ]}
              >
                {level}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  energyLevels: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  energyButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  energyContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  energyText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
