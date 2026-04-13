import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    loadSettings();
    loadNotesCount();
  }, []);

  const loadSettings = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('@dark_mode');
      if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
      const savedNotifications = await AsyncStorage.getItem('@notifications');
      if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadNotesCount = async () => {
    try {
      const notes = await AsyncStorage.getItem('@smart_notes');
      if (notes) setNotesCount(JSON.parse(notes).length);
    } catch (error) {
      console.error('Error loading notes count:', error);
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    saveSetting('@dark_mode', value);
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotifications(value);
    saveSetting('@notifications', value);
  };

  const clearAllData = () => {
    Alert.alert('Clear All Data', 'This will delete all your notes. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('@smart_notes');
          setNotesCount(0);
          Alert.alert('Success', 'All data has been cleared');
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={handleDarkModeToggle} trackColor={{ false: '#ddd', true: '#007AFF' }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch value={notifications} onValueChange={handleNotificationsToggle} trackColor={{ false: '#ddd', true: '#007AFF' }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Total Notes</Text>
          <Text style={styles.statsValue}>{notesCount}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Converter Types</Text>
          <Text style={styles.statsValue}>4</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Available Units</Text>
          <Text style={styles.statsValue}>18+</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.appName}>Smart Utility Toolkit</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            A comprehensive utility app providing unit conversion and note-taking capabilities.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
        <Text style={styles.clearButtonText}>Clear All Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { backgroundColor: '#fff', marginTop: 20, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', padding: 16, paddingBottom: 8 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  settingLabel: { fontSize: 16, color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  statsLabel: { fontSize: 16, color: '#333' },
  statsValue: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  aboutCard: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  appName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  version: { fontSize: 14, color: '#999', marginTop: 4 },
  description: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 12, lineHeight: 20 },
  clearButton: { backgroundColor: '#fff', margin: 16, marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ff3b30' },
  clearButtonText: { color: '#ff3b30', fontSize: 16, fontWeight: '600' },
});