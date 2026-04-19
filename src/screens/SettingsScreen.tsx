import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [notesCount, setNotesCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);

  useEffect(() => {
    loadSettings();
    loadCounts();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('@notifications');
      if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadCounts = async () => {
    try {
      const notes = await AsyncStorage.getItem('@smart_notes');
      if (notes) setNotesCount(JSON.parse(notes).length);
      
      const tasks = await AsyncStorage.getItem('@smart_tasks');
      if (tasks) setTasksCount(JSON.parse(tasks).length);
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    try {
      setNotifications(value);
      await AsyncStorage.setItem('@notifications', value.toString());
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const clearAllData = () => {
    Alert.alert('Clear All Data', 'This will delete all your notes and tasks. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('@smart_notes');
          await AsyncStorage.removeItem('@smart_tasks');
          setNotesCount(0);
          setTasksCount(0);
          Alert.alert('Success', 'All data has been cleared');
        }
      }
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Appearance</Text>
        <View style={[styles.settingRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: '#ddd', true: '#007AFF' }} />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Preferences</Text>
        <View style={[styles.settingRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>Enable Notifications</Text>
          <Switch value={notifications} onValueChange={handleNotificationsToggle} trackColor={{ false: '#ddd', true: '#007AFF' }} />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Statistics</Text>
        <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.statsLabel, { color: theme.text }]}>Total Notes</Text>
          <Text style={styles.statsValue}>{notesCount}</Text>
        </View>
        <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.statsLabel, { color: theme.text }]}>Total Tasks</Text>
          <Text style={styles.statsValue}>{tasksCount}</Text>
        </View>
        <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.statsLabel, { color: theme.text }]}>Converter Types</Text>
          <Text style={styles.statsValue}>4</Text>
        </View>
        <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.statsLabel, { color: theme.text }]}>Available Units</Text>
          <Text style={styles.statsValue}>18+</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>About</Text>
        <View style={[styles.aboutCard, { borderTopColor: theme.border }]}>
          <Text style={[styles.appName, { color: theme.text }]}>Smart Utility Toolkit</Text>
          <Text style={[styles.version, { color: theme.subtext }]}>Version 2.0.0</Text>
          <Text style={[styles.description, { color: theme.subtext }]}>
            A comprehensive utility app providing unit conversion, note-taking, and task management capabilities.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.clearButton, { backgroundColor: theme.card }]} onPress={clearAllData}>
        <Text style={styles.clearButtonText}>Clear All Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: 20, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  sectionTitle: { fontSize: 16, fontWeight: '600', padding: 16, paddingBottom: 8 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1 },
  settingLabel: { fontSize: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1 },
  statsLabel: { fontSize: 16 },
  statsValue: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  aboutCard: { padding: 16, alignItems: 'center', borderTopWidth: 1 },
  appName: { fontSize: 18, fontWeight: 'bold' },
  version: { fontSize: 14, marginTop: 4 },
  description: { fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  clearButton: { margin: 16, marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ff3b30' },
  clearButtonText: { color: '#ff3b30', fontSize: 16, fontWeight: '600' },
});