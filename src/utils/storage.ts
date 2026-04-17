import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../models/task';

const STORAGE_KEYS = {
  NOTES: '@smart_notes',
  TASKS: '@smart_tasks',
  SETTINGS: '@smart_settings',
};

// ============ TASK STORAGE ============

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTask = async (task: Task): Promise<void> => {
  const tasks = await loadTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  
  await saveTasks(tasks);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const tasks = await loadTasks();
  const filteredTasks = tasks.filter(t => t.id !== taskId);
  await saveTasks(filteredTasks);
};

export const toggleTaskCompletion = async (taskId: string): Promise<Task[]> => {
  const tasks = await loadTasks();
  const updatedTasks = tasks.map(task =>
    task.id === taskId 
      ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
      : task
  );
  await saveTasks(updatedTasks);
  return updatedTasks;
};

// ============ NOTE STORAGE ============

export const saveNotes = async (notes: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const loadNotes = async (): Promise<any[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

// ============ SETTINGS STORAGE ============

export const saveSetting = async (key: string, value: any): Promise<void> => {
  try {
    const settings = await loadSettings();
    settings[key] = value;
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving setting:', error);
  }
};

export const loadSettings = async (): Promise<any> => {
  try {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : {};
  } catch (error) {
    console.error('Error loading settings:', error);
    return {};
  }
};