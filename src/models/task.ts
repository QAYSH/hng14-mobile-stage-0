export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  category: 'personal' | 'work' | 'shopping' | 'other';
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'personal' | 'work' | 'shopping' | 'other';

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'high': return '#FF3B30';
    case 'medium': return '#FF9500';
    case 'low': return '#34C759';
    default: return '#8E8E93';
  }
};

export const getCategoryIcon = (category: TaskCategory): string => {
  switch (category) {
    case 'personal': return 'person-outline';
    case 'work': return 'briefcase-outline';
    case 'shopping': return 'cart-outline';
    case 'other': return 'apps-outline';
    default: return 'checkbox-outline';
  }
};