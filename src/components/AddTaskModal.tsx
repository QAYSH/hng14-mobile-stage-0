import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Task, TaskPriority, TaskCategory } from '../models/task';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  editingTask?: Task | null;
}

export default function AddTaskModal({ visible, onClose, onSave, editingTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate) : null);
    } else {
      resetForm();
    }
  }, [editingTask, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('personal');
    setDueDate(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });
    
    resetForm();
    onClose();
  };

  const priorities: TaskPriority[] = ['low', 'medium', 'high'];
  const categories: TaskCategory[] = ['personal', 'work', 'shopping', 'other'];

  const getPriorityIcon = (p: TaskPriority) => {
    switch (p) {
      case 'high': return 'alert-circle';
      case 'medium': return 'remove-circle';
      case 'low': return 'checkmark-circle';
    }
  };

  const getCategoryIcon = (c: TaskCategory) => {
    switch (c) {
      case 'personal': return 'person';
      case 'work': return 'briefcase';
      case 'shopping': return 'cart';
      case 'other': return 'apps';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingTask ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What needs to be done?"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#C6C6C8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add more details..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#C6C6C8"
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityOption,
                    priority === p && styles.priorityOptionActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Ionicons
                    name={getPriorityIcon(p)}
                    size={20}
                    color={priority === p ? '#FFFFFF' : getPriorityColor(p)}
                  />
                  <Text
                    style={[
                      styles.priorityOptionText,
                      priority === p && styles.priorityOptionTextActive,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.categoryOption,
                    category === c && styles.categoryOptionActive,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Ionicons
                    name={getCategoryIcon(c)}
                    size={18}
                    color={category === c ? '#FFFFFF' : '#007AFF'}
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      category === c && styles.categoryOptionTextActive,
                    ]}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.dateButtonText}>
                {dueDate ? dueDate.toLocaleDateString() : 'Select a date'}
              </Text>
              {dueDate && (
                <TouchableOpacity onPress={() => setDueDate(null)}>
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'high': return '#FF3B30';
    case 'medium': return '#FF9500';
    case 'low': return '#34C759';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  descriptionInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9F9F9',
    minHeight: 100,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  priorityOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  priorityOptionTextActive: {
    color: '#FFFFFF',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
  },
  categoryOptionActive: {
    backgroundColor: '#007AFF',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#007AFF',
  },
  categoryOptionTextActive: {
    color: '#FFFFFF',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
});