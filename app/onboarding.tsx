import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settings-store';
import Colors from '@/constants/colors';
import TimePickerInput from '@/components/TimePickerInput';

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = darkMode ? Colors.dark : Colors.light;
  
  const setUserName = useSettingsStore((state) => state.setUserName);
  const setWakeUpTime = useSettingsStore((state) => state.setWakeUpTime);
  const setBedTime = useSettingsStore((state) => state.setBedTime);
  const [wakeUpTime, setLocalWakeUpTime] = useState('06:00');
  const [bedTime, setLocalBedTime] = useState('22:00');

  const handleContinue = () => {
    if (!name.trim()) {
      return;
    }
    setUserName(name.trim());
    setWakeUpTime(wakeUpTime);
    setBedTime(bedTime);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>Welcome!</Text>
          <Text style={[styles.subtitle, { color: theme.subtext, textAlign: 'center' }]}>
            Let's get to know you better
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>What's your name?</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.subtext}
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>When do you wake up?</Text>
            <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 12, backgroundColor: theme.card }}>
              <TimePickerInput
                value={wakeUpTime}
                onChange={setLocalWakeUpTime}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>When do you go to bed?</Text>
            <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 12, backgroundColor: theme.card }}>
              <TimePickerInput
                value={bedTime}
                onChange={setLocalBedTime}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: name.trim() ? theme.tint : theme.border,
              opacity: name.trim() ? 1 : 0.5,
              marginTop: 8,
            },
          ]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  form: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});