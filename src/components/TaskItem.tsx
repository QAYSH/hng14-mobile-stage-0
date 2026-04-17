import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Task, getPriorityColor, getCategoryIcon } from '../models/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          Animated.spring(translateX, {
            toValue: -200,
            useNativeDriver: true,
          }).start(() => onDelete(task.id));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX }],
          opacity: translateX.interpolate({
            inputRange: [-200, 0],
            outputRange: [0.5, 1],
          }),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={[styles.card, task.completed && styles.completedCard]}
        onPress={() => onEdit(task)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.checkbox}>
            <Ionicons
              name={task.completed ? 'checkbox' : 'square-outline'}
              size={24}
              color={task.completed ? '#34C759' : '#8E8E93'}
            />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, task.completed && styles.completedText]}>
                {task.title}
              </Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                  {task.priority}
                </Text>
              </View>
            </View>
            
            {task.description ? (
              <Text style={[styles.description, task.completed && styles.completedText]} numberOfLines={2}>
                {task.description}
              </Text>
            ) : null}
            
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name={getCategoryIcon(task.category)} size={14} color="#8E8E93" />
                <Text style={styles.metaText}>{task.category}</Text>
              </View>
              
              {task.dueDate && (
                <View style={styles.metaItem}>
                  <Ionicons 
                    name="calendar-outline" 
                    size={14} 
                    color={isOverdue() ? '#FF3B30' : '#8E8E93'} 
                  />
                  <Text style={[styles.metaText, isOverdue() && styles.overdueText]}>
                    {formatDate(task.dueDate)}
                    {isOverdue() ? ' (Overdue)' : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  completedCard: {
    backgroundColor: '#F9F9F9',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  overdueText: {
    color: '#FF3B30',
  },
});