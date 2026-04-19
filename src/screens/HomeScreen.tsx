import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const tools = [
  { id: 1, name: 'Unit Converter', icon: '🔄', description: 'Convert Length, Weight, Temperature & Currency', screen: 'Converter' },
  { id: 2, name: 'Smart Notes', icon: '📝', description: 'Save and manage your important notes', screen: 'Notes' },
  { id: 3, name: 'Currency Rates', icon: '💱', description: 'Real-time currency conversion', screen: 'Converter' },
  { id: 4, name: 'Temperature Converter', icon: '🌡️', description: 'Celsius, Fahrenheit, Kelvin', screen: 'Converter' },
  { id: 5, name: 'Task Manager', icon: '✅', description: 'Manage your tasks and checklist', screen: 'Tasks' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Utility Toolkit</Text>
        <Text style={styles.subtitle}>Your everyday companion</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statNumber}>4+</Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>Tools</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statNumber}>10+</Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>Units</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.statNumber}>∞</Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>Notes</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Tools</Text>
      
      {tools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={[styles.toolCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate(tool.screen as never)}
        >
          <Text style={styles.toolIcon}>{tool.icon}</Text>
          <View style={styles.toolInfo}>
            <Text style={[styles.toolName, { color: theme.text }]}>{tool.name}</Text>
            <Text style={[styles.toolDescription, { color: theme.subtext }]}>{tool.description}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', marginTop: 5, opacity: 0.9 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: -20, marginHorizontal: 20 },
  statCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 5, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 20, marginBottom: 10, color: '#333' },
  toolCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 12, padding: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  toolIcon: { fontSize: 40, marginRight: 15 },
  toolInfo: { flex: 1 },
  toolName: { fontSize: 16, fontWeight: '600', color: '#333' },
  toolDescription: { fontSize: 12, color: '#666', marginTop: 2 },
  arrow: { fontSize: 20, color: '#007AFF' },
});