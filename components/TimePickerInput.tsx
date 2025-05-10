import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  SafeAreaView,
} from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { X, Clock } from "lucide-react-native";

interface TimePickerInputProps {
  value: string;
  onChange: (time: string) => void;
}

export default function TimePickerInput({
  value,
  onChange,
}: TimePickerInputProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempTime, setTempTime] = useState(() => {
    // Parse the time string to create a Date object
    const now = new Date();
    if (value) {
      const [hours, minutes] = value.split(":").map(Number);
      now.setHours(hours, minutes, 0, 0);
    }
    return now;
  });

  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;

  const handleConfirm = () => {
    const hours = tempTime.getHours().toString().padStart(2, "0");
    const minutes = tempTime.getMinutes().toString().padStart(2, "0");
    onChange(`${hours}:${minutes}`);
    setModalVisible(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setModalVisible(false);
    }

    if (selectedTime) {
      setTempTime(selectedTime);

      if (Platform.OS === "android") {
        const hours = selectedTime.getHours().toString().padStart(2, "0");
        const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
        onChange(`${hours}:${minutes}`);
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.timeButton,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Clock size={16} color={theme.text} style={styles.clockIcon} />
        <Text style={[styles.timeButtonText, { color: theme.text }]}>
          {value || "Select Time"}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "ios" ? (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView
            style={[
              styles.modalContainer,
              { backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
          >
            <View
              style={[styles.modalContent, { backgroundColor: theme.card }]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Select Time
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <X size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={styles.picker}
                textColor={theme.text}
              />

              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: theme.tint }]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      ) : (
        modalVisible && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  clockIcon: {
    marginRight: 8,
  },
  timeButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  picker: {
    height: 200,
  },
  confirmButton: {
    padding: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
