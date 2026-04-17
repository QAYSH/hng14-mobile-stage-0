import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import UnitConverterScreen from '../screens/UnitConverterScreen';
import NotesScreen from '../screens/NotesScreen';
import TasksScreen from '../screens/TasksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, { focused: string; unfocused: string }> = {
            Home: { focused: 'home', unfocused: 'home-outline' },
            Converter: { focused: 'calculator', unfocused: 'calculator-outline' },
            Notes: { focused: 'document-text', unfocused: 'document-text-outline' },
            Tasks: { focused: 'checkbox', unfocused: 'checkbox-outline' },
            Settings: { focused: 'settings', unfocused: 'settings-outline' },
          };
          
          const iconSet = icons[route.name];
          const iconName = focused ? iconSet.focused : iconSet.unfocused;
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: { 
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { 
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Converter" component={UnitConverterScreen} options={{ title: 'Unit Converter' }} />
      <Tab.Screen name="Notes" component={NotesScreen} options={{ title: 'My Notes' }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: 'Task Manager' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}