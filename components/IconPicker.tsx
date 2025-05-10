import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import { X } from "lucide-react-native";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

// Common emojis for tasks
const EMOJIS = [
  "📚",
  "💪",
  "🏃",
  "🧘",
  "🍎",
  "💧",
  "💊",
  "🧹",
  "🛒",
  "📝",
  "📞",
  "💻",
  "📧",
  "🎮",
  "🎬",
  "🎨",
  "🎸",
  "🚶",
  "🚴",
  "🏊",
  "⚽",
  "🏀",
  "🎯",
  "🎲",
  "🧩",
  "🌱",
  "🌞",
  "🌙",
  "⏰",
  "💤",
  "🍳",
  "🥗",
  "🥤",
  "💰",
  "💼",
  "🔍",
  "📊",
  "📈",
  "🗓️",
  "🔔",
  "🧠",
  "❤️",
  "🤝",
  "👨‍👩‍👧‍👦",
  "🐕",
  "🐈",
  "🌿",
  "🌊",
  "🔋",
  "✅",
  "🏅",
  "🏆",
  "🕒",
  "🏡",
  "🧑‍💻",
  "🧑‍🍳",
  "🧑‍🎓",
  "🧺",
  "🧽",
  "🚗",
  "🚿",
  "🛏️",
  "🛠️",
  "🧴",
  "🛀",
  "🥇",
  "🥈",
  "🥉",
  "🥾",
  "🥅",
  "🥋",
  "🥁",
  "🥒",
  "🥕",
  "🦷",
  "🦵",
  "🦶",
  "🧑‍🔬",
  "🧑‍🎨",
  "🧑‍⚕️",
  "🧑‍🏫",
  "🧑‍🌾",
  "🧑‍🔧",
  "🧑‍💼",
  "🧑‍🚀",
  "🧑‍✈️",
  "🧑‍🚒",
  "🧑‍🎤",
];

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.iconButton,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedIcon}>{value || "📌"}</Text>
        <Text style={[styles.iconButtonText, { color: theme.text }]}>
          {value ? "Change Icon" : "Select Icon"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Select an Icon
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={EMOJIS}
            numColumns={5}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.emojiButton,
                  {
                    backgroundColor: item === value ? theme.tint : theme.card,
                    margin: 6,
                    padding: 6,
                  },
                ]}
                onPress={() => {
                  onChange(item);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={[
              styles.emojiGrid,
              { paddingHorizontal: 8, paddingTop: 8, paddingBottom: 24 },
            ]}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  selectedIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  iconButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  searchInput: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  emojiGrid: {
    padding: 12,
  },
  emojiButton: {
    width: "16.66%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: "0.5%",
  },
  emoji: {
    fontSize: 28,
  },
});
