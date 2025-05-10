import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Alert,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { useSettingsStore } from "@/store/settings-store";
import Colors from "@/constants/colors";
import { Moon, Bell, User, Github, Zap } from "lucide-react-native";
import TimePickerInput from "@/components/TimePickerInput";

export default function SettingsScreen() {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const notifications = useSettingsStore((state) => state.notifications);
  const userName = useSettingsStore((state) => state.userName);
  const dailyEnergyLimit = useSettingsStore((state) => state.dailyEnergyLimit);

  const setDarkMode = useSettingsStore((state) => state.setDarkMode);
  const setNotifications = useSettingsStore((state) => state.setNotifications);
  const setUserName = useSettingsStore((state) => state.setUserName);
  const setDailyEnergyLimit = useSettingsStore(
    (state) => state.setDailyEnergyLimit
  );
  const setWakeUpTime = useSettingsStore((state) => state.setWakeUpTime);
  const setBedTime = useSettingsStore((state) => state.setBedTime);

  const theme = darkMode ? Colors.dark : Colors.light;

  const [isEditingEnergy, setIsEditingEnergy] = useState(false);
  const [energyValue, setEnergyValue] = useState(dailyEnergyLimit.toString());

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);

  const openGithub = () => {
    Linking.openURL("https://github.com/0xpratikpatil");
  };

  const handleSaveEnergyLimit = () => {
    const newLimit = parseInt(energyValue);
    if (!isNaN(newLimit) && newLimit > 0) {
      setDailyEnergyLimit(newLimit);
      setIsEditingEnergy(false);
    } else {
      Alert.alert(
        "Invalid Value",
        "Please enter a valid number greater than 0"
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Account
          </Text>
          <TouchableOpacity
            style={[styles.settingsCard, { backgroundColor: theme.card }]}
            onPress={() => setShowAccountModal(true)}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <User size={20} color={theme.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Account Settings
                </Text>
                <Text
                  style={[styles.settingDescription, { color: theme.subtext }]}
                >
                  Name: {userName || "Not set"} | Wake:{" "}
                  {useSettingsStore((state) => state.wakeUpTime)} | Bed:{" "}
                  {useSettingsStore((state) => state.bedTime)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Modal
            visible={showAccountModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAccountModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalCard,
                  {
                    backgroundColor: theme.card,
                    padding: 24,
                    borderRadius: 16,
                  },
                ]}
              >
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Name
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                        borderWidth: 1,
                        borderRadius: 12,
                        height: 50,
                      },
                    ]}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.subtext}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Wake Up Time
                  </Text>
                  <View
                    style={{
                      borderColor: theme.text,
                      borderWidth: 1,
                      borderRadius: 12,
                    }}
                  >
                    <TimePickerInput
                      value={useSettingsStore((state) => state.wakeUpTime)}
                      onChange={setWakeUpTime}
                    />
                  </View>
                </View>
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Bedtime
                  </Text>
                  <View
                    style={{
                      borderColor: theme.text,
                      borderWidth: 1,
                      borderRadius: 12,
                    }}
                  >
                    <TimePickerInput
                      value={useSettingsStore((state) => state.bedTime)}
                      onChange={setBedTime}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.tint,
                    marginTop: 24,
                    borderRadius: 10,
                    paddingVertical: 16,
                    alignItems: "center",
                    width: "100%",
                  }}
                  onPress={() => {
                    if (!userName || userName.trim() === "") {
                      Alert.alert("Name Required", "Please enter your name.");
                      return;
                    }
                    setShowAccountModal(false);
                  }}
                >
                  <Text
                    style={{
                      color: theme.background,
                      fontWeight: "600",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Energy Monitoring
          </Text>
          <TouchableOpacity
            style={[styles.settingsCard, { backgroundColor: theme.card }]}
            onPress={() => setShowEnergyModal(true)}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Zap size={20} color={theme.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Energy Settings
                </Text>
                <Text
                  style={[styles.settingDescription, { color: theme.subtext }]}
                >
                  Daily Limit: {dailyEnergyLimit}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Modal
            visible={showEnergyModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowEnergyModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalCard,
                  {
                    backgroundColor: theme.background,
                    padding: 24,
                    borderRadius: 16,
                  },
                ]}
              >
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Daily Energy Limit
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                        borderWidth: 1,
                        borderRadius: 12,
                        height: 50,
                      },
                    ]}
                    value={energyValue}
                    onChangeText={setEnergyValue}
                    keyboardType="number-pad"
                    placeholder="Enter daily energy limit"
                    placeholderTextColor={theme.subtext}
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.tint,
                      marginTop: 24,
                      borderRadius: 10,
                      paddingVertical: 16,
                      alignItems: "center",
                      width: "100%",
                    }}
                    onPress={() => {
                      handleSaveEnergyLimit();
                      setShowEnergyModal(false);
                    }}
                  >
                    <Text
                      style={{
                        color: theme.background,
                        fontWeight: "600",
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Moon size={20} color={theme.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Dark Mode
                </Text>
                <Text
                  style={[styles.settingDescription, { color: theme.subtext }]}
                >
                  Use dark theme throughout the app
                </Text>
              </View>
              <View style={styles.settingAction}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    { backgroundColor: darkMode ? theme.tint : theme.border },
                  ]}
                  onPress={() => setDarkMode(!darkMode)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.toggleKnob,
                      {
                        backgroundColor: theme.background,
                        transform: [{ translateX: darkMode ? 20 : 0 }],
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {Platform.OS !== "web" && (
              <View
                style={[
                  styles.settingRow,
                  styles.borderTop,
                  { borderTopColor: theme.border },
                ]}
              >
                <View style={styles.settingIconContainer}>
                  <Bell size={20} color={theme.text} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Notifications
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.subtext },
                    ]}
                  >
                    Get reminders for your tasks
                  </Text>
                </View>
                <View style={styles.settingAction}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      {
                        backgroundColor: notifications
                          ? theme.tint
                          : theme.border,
                      },
                    ]}
                    onPress={() => setNotifications(!notifications)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.toggleKnob,
                        {
                          backgroundColor: theme.background,
                          transform: [{ translateX: notifications ? 20 : 0 }],
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Github size={20} color={theme.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Developer
                </Text>
                <Text
                  style={[styles.settingDescription, { color: theme.subtext }]}
                >
                  Pratik Patil
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.githubButton,
                  { backgroundColor: theme.background },
                ]}
                onPress={openGithub}
              >
                <Text style={[styles.githubButtonText, { color: theme.text }]}>
                  @0xpratikpatil
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.subtext }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 8,
  },
  settingsCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  borderTop: {
    borderTopWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingAction: {
    marginLeft: 12,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  energyEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  energyInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    marginRight: 8,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  energyValue: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  energyValueText: {
    fontWeight: "500",
  },
  githubButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  githubButtonText: {
    fontWeight: "500",
    fontSize: 12,
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  footerText: {
    marginTop: -28,
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 0,
    marginVertical: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
});
