import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Task, TaskPriority } from '../models/task';
import { loadTasks, saveTasks, toggleTaskCompletion, deleteTask, saveTask } from '../utils/storage';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import TaskStats from '../components/TasksStats';

type FilterType = 'all' | 'active' | 'completed';

export default function TasksScreen() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasksData();
  }, []);

  const loadTasksData = async () => {
    const loadedTasks = await loadTasks();
    setTasks(loadedTasks);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasksData();
    setRefreshing(false);
  }, []);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    const now = new Date().toISOString();
    let updatedTasks: Task[];
    
    if (editingTask) {
      updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              ...taskData,
              updatedAt: now,
            } as Task
          : task
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        category: taskData.category || 'personal',
        dueDate: taskData.dueDate || null,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      updatedTasks = [newTask, ...tasks];
    }
    
    await saveTasks(updatedTasks);
    setTasks(updatedTasks);
    setEditingTask(null);
    setModalVisible(false);
  };

  const handleToggleTask = async (taskId: string) => {
    const updatedTasks = await toggleTaskCompletion(taskId);
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
          },
        },
      ]
    );
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  }), [tasks]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <TaskStats stats={stats} />
      
      <View style={[styles.filterContainer, { backgroundColor: theme.card }]}>
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f ? styles.filterTextActive : { color: theme.subtext },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggleTask}
            onEdit={(task) => {
              setEditingTask(task);
              setModalVisible(true);
            }}
            onDelete={handleDeleteTask}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkbox-outline" size={80} color={theme.border} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No tasks yet</Text>
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              {filter === 'all'
                ? 'Tap the + button to create your first task'
                : filter === 'active'
                ? "You don't have any active tasks"
                : "You haven't completed any tasks yet"}
            </Text>
          </View>
        }
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyList : styles.list}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 4,
    borderRadius: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});