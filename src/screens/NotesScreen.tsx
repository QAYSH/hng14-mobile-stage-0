import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesScreen() {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('@smart_notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('@smart_notes', JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const saveNote = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Please enter a title or content');
      return;
    }

    const now = new Date().toISOString();
    if (editingNote) {
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? { ...note, title: title.trim() || 'Untitled', content: content.trim(), updatedAt: now }
          : note
      );
      saveNotes(updatedNotes);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim() || 'Untitled',
        content: content.trim(),
        createdAt: now,
        updatedAt: now,
      };
      saveNotes([newNote, ...notes]);
    }
    closeModal();
  };

  const deleteNote = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => saveNotes(notes.filter(note => note.id !== id)) }
    ]);
  };

  const openModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity style={[styles.noteCard, { backgroundColor: theme.card }]} onPress={() => openModal(item)}>
      <View style={styles.noteHeader}>
        <Text style={[styles.noteTitle, { color: theme.text }]}>{item.title}</Text>
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#ff3b30" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.notePreview, { color: theme.subtext }]} numberOfLines={2}>{item.content}</Text>
      <Text style={[styles.noteDate, { color: theme.subtext }]}>Updated: {formatDate(item.updatedAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.subtext }]}>No notes yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.border }]}>Tap + to create your first note</Text>
          </View>
        }
        contentContainerStyle={notes.length === 0 ? styles.emptyList : styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" visible={modalVisible} onRequestClose={closeModal}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{editingNote ? 'Edit Note' : 'New Note'}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={[styles.titleInput, { color: theme.text, borderColor: theme.border }]}
              placeholder="Title"
              placeholderTextColor={theme.subtext}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.contentInput, { color: theme.text, borderColor: theme.border }]}
              placeholder="Write your note here..."
              placeholderTextColor={theme.subtext}
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
            />
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  emptyList: { flex: 1 },
  noteCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  noteTitle: { fontSize: 18, fontWeight: '600', color: '#333', flex: 1 },
  notePreview: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 8 },
  noteDate: { fontSize: 11, color: '#999' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#ccc', marginTop: 8 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalContent: { flex: 1, padding: 20 },
  titleInput: { fontSize: 18, fontWeight: '500', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 16 },
  contentInput: { fontSize: 16, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, minHeight: 200, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#007AFF', margin: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});