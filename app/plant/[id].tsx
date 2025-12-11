import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
// @ts-ignore: react-native-vector-icons has no type declarations in this project
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  getPlant,
  getWateringHistory,
  getMoments,
  getGoals,
  getPlantNotes,
  deletePlant,
  addWateringRecord,
  addMoment,
  addGoal,
  addPlantNote,
  updateGoal,
  updatePlant,
  deletePlantNote,
  Plant,
  WateringHistory,
  Moment,
  Goal,
  PlantNote,
} from '../../utils/database';
import { useDatabase } from '../../contexts/DatabaseContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import * as ImagePicker from 'react-native-image-picker';
import { generateThumbnail } from '../../utils/imageUtils';
import { useRoute, useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#4CAF50',
  light: '#E8F5E9',
  dark: '#2E7D32',
  warning: '#FF9800',
  error: '#F44336',
};

export default function PlantDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const params = route.params as { id?: string };
  const id = params?.id;
  const { refreshPlants } = useDatabase();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [wateringHistory, setWateringHistory] = useState<WateringHistory[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<PlantNote[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [addingMoment, setAddingMoment] = useState(false);
  const [momentCaption, setMomentCaption] = useState('');
  const [momentUploading, setMomentUploading] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSpecies, setEditSpecies] = useState('');
  const [editWateringFrequency, setEditWateringFrequency] = useState<number | string>('');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    loadPlantData();
  }, [id]);

  const loadPlantData = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const plantData = await getPlant(id);
      setPlant(plantData);

      if (plantData) {
        const [historyData, momentsData, goalsData, notesData] = await Promise.all([
          getWateringHistory(id),
          getMoments(id),
          getGoals(id),
          getPlantNotes(id),
        ]);

        setWateringHistory(historyData);
        setMoments(momentsData);
        setGoals(goalsData);
        setNotes(notesData);
      }
    } catch (error) {
      console.error('Error loading plant data:', error);
      Alert.alert('Error', 'Failed to load plant details');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    if (!plant) return;
    setEditName(plant.name || '');
    setEditSpecies(plant.species || '');
    setEditWateringFrequency(plant.watering_frequency ?? '');
    setEditNotes(plant.notes || '');
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!plant) return;
    try {
      setSavingEdit(true);
      await updatePlant(plant.id, {
        name: editName.trim(),
        species: editSpecies.trim(),
        watering_frequency: Number(editWateringFrequency) || 0,
        notes: editNotes ?? '',
      });
      await loadPlantData();
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleWater = async () => {
    if (!plant) return;
    try {
      await addWateringRecord(plant.id);
      await loadPlantData();
    } catch (error) {
      Alert.alert('Error', 'Failed to record watering');
    }
  };

  const handleAddMomentFromGallery = async () => {
    if (!plant) return;
    try {
      setMomentUploading(true);
      const result = await ImagePicker.launchImageLibrary({
        selectionLimit: 1,
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (!uri) {
          Alert.alert('Error', 'Selected image has no URI');
          return;
        }
        const thumbnail = await generateThumbnail(uri);
        await addMoment(plant.id, thumbnail, momentCaption);
        setMomentCaption('');
        setAddingMoment(false);
        await loadPlantData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add moment');
    } finally {
      setMomentUploading(false);
    }
  };

  const handleAddMomentFromCamera = async () => {
    if (!plant) return;
    try {
      setMomentUploading(true);
      const result = await ImagePicker.launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
        saveToPhotos: true,
      });

      if (!result.didCancel && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (!uri) {
          Alert.alert('Error', 'Captured image has no URI');
          return;
        }
        const thumbnail = await generateThumbnail(uri);
        await addMoment(plant.id, thumbnail, momentCaption);
        setMomentCaption('');
        setAddingMoment(false);
        await loadPlantData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture moment');
    } finally {
      setMomentUploading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !plant) return;
    try {
      await addPlantNote(plant.id, newNote.trim());
      setNewNote('');
      setAddingNote(false);
      await loadPlantData();
    } catch (error) {
      Alert.alert('Error', 'Failed to add note');
    }
  };

  const handleToggleGoal = async (goal: Goal) => {
    try {
      await updateGoal(goal.id, { completed: goal.completed });
      await loadPlantData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal');
    }
  };

  const handleDelete = () => {
    if (!plant) return;
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete ${plant.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deletePlant(plant.id);
              await refreshPlants();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plant');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteNote = (note: PlantNote) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlantNote(note.id);
              await loadPlantData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Plant not found</Text>
      </View>
    );
  }

  const daysSinceWatered = plant.last_watered_date
    ? differenceInDays(new Date(), parseISO(plant.last_watered_date))
    : differenceInDays(new Date(), parseISO(plant.added_date));

  const OverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {plant.image_thumb && (
        <Image source={{ uri: plant.image_thumb }} style={styles.detailImage} />
      )}

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{plant.watering_frequency}</Text>
          <Text style={styles.statLabel}>Days between watering</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{daysSinceWatered}</Text>
          <Text style={styles.statLabel}>Days since last watered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{wateringHistory.length}</Text>
          <Text style={styles.statLabel}>Times watered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{moments.length}</Text>
          <Text style={styles.statLabel}>Moments captured</Text>
        </View>
      </View>

      {plant.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Notes</Text>
          <Text style={styles.noteText}>{plant.notes}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.waterButton} onPress={handleWater}>
        <MaterialIcons name="water-drop" size={24} color="#fff" />
        <Text style={styles.waterButtonText}>Water Plant Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const HistoryTab = () => (
    <ScrollView style={styles.tabContent}>
      {wateringHistory.length === 0 ? (
        <Text style={styles.emptyText}>No watering history yet</Text>
      ) : (
        <FlatList
          data={wateringHistory}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <MaterialIcons name="water-drop" size={20} color={COLORS.primary} />
              <View style={styles.historyContent}>
                <Text style={styles.historyDate}>{format(parseISO(item.watered_date), 'PPP p')}</Text>
                {item.notes && <Text style={styles.historyNotes}>{item.notes}</Text>}
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </ScrollView>
  );

  const MomentsTab = () => (
    <ScrollView style={styles.tabContent}>
      {moments.length === 0 ? (
        <Text style={styles.emptyText}>No moments captured yet</Text>
      ) : (
        <FlatList
          data={moments}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.momentCard}>
              <Image source={{ uri: item.image }} style={styles.momentImage} />
              {item.caption && <Text style={styles.momentCaption}>{item.caption}</Text>}
              <Text style={styles.momentDate}>{format(parseISO(item.date), 'PPP')}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddingMoment(true)}
      >
        <MaterialIcons name="add-a-photo" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Moment</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const GoalsTab = () => (
    <ScrollView style={styles.tabContent}>
      {goals.length === 0 ? (
        <Text style={styles.emptyText}>No goals set yet</Text>
      ) : (
          <FlatList
          data={goals}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.goalCard, item.completed ? styles.completedGoal : undefined]}
              onPress={() => handleToggleGoal(item)}
            >
              <View style={styles.goalCheckbox}>
                {item.completed ? (
                  <MaterialIcons name="check" size={20} color={COLORS.primary} />
                ) : null}
              </View>
              <View style={styles.goalContent}>
                <Text style={[styles.goalTitle, item.completed ? styles.completedText : undefined]}>
                  {item.title}
                </Text>
                {item.description && (
                  <Text style={styles.goalDescription}>{item.description}</Text>
                )}
                {item.target_date && (
                  <Text style={styles.goalDate}>
                    Target: {format(parseISO(item.target_date), 'PPP')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </ScrollView>
  );

  const NotesTab = () => (
    <ScrollView style={styles.tabContent}>
      {notes.length === 0 ? (
        <Text style={styles.emptyText}>No growth notes yet</Text>
      ) : (
        <FlatList
          data={notes}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={styles.noteDate}>{format(parseISO(item.date), 'PPP p')}</Text>
                <TouchableOpacity onPress={() => handleDeleteNote(item)}>
                  <MaterialIcons name="delete" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.noteContent}>{item.note}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddingNote(true)}
      >
        <MaterialIcons name="note-add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{plant.name}</Text>
          <Text style={styles.headerSubtitle}>{plant.species}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={openEditModal} style={{ marginRight: 12 }}>
            <MaterialIcons name="edit" size={22} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        {(['overview', 'history', 'moments', 'goals', 'notes'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'moments' && <MomentsTab />}
      {activeTab === 'goals' && <GoalsTab />}
      {activeTab === 'notes' && <NotesTab />}

      <Modal visible={addingMoment} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { if (!momentUploading) setAddingMoment(false); }}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Moment</Text>
            <View style={{ width: 48 }} />{/* spacer */}
          </View>

          <View style={{ padding: 16 }}>
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              value={momentCaption}
              onChangeText={setMomentCaption}
              placeholderTextColor="#ccc"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.addButton, { flex: 1, marginRight: 8, opacity: momentUploading ? 0.6 : 1 }]}
                onPress={handleAddMomentFromCamera}
                disabled={momentUploading}
              >
                <MaterialIcons name="photo-camera" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, { flex: 1, marginLeft: 8, opacity: momentUploading ? 0.6 : 1 }]}
                onPress={handleAddMomentFromGallery}
                disabled={momentUploading}
              >
                <MaterialIcons name="photo-library" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>

            {momentUploading && (
              <Text style={{ marginTop: 12, color: COLORS.primary, textAlign: 'center' }}>Processing...</Text>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={addingNote} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddingNote(false)}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Growth Note</Text>
            <TouchableOpacity onPress={handleAddNote}>
              <Text style={styles.modalButton}>Add</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.captionInput, styles.noteInput]}
            placeholder="Write your growth note..."
            value={newNote}
            onChangeText={setNewNote}
            multiline
            numberOfLines={6}
            placeholderTextColor="#ccc"
          />
        </View>
      </Modal>

      {/* Edit Plant Modal */}
      <Modal visible={editing} animationType="slide" onRequestClose={() => { if (!savingEdit) setEditing(false); }}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { if (!savingEdit) setEditing(false); }}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Plant</Text>
            <TouchableOpacity onPress={handleSaveEdit} disabled={savingEdit}>
              <Text style={styles.modalButton}>{savingEdit ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 16 }}>
            <TextInput
              style={styles.captionInput}
              placeholder="Plant name"
              value={editName}
              onChangeText={setEditName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.captionInput, { marginTop: 12 }]}
              placeholder="Species"
              value={editSpecies}
              onChangeText={setEditSpecies}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.captionInput, { marginTop: 12 }]}
              placeholder="Watering frequency (days)"
              value={String(editWateringFrequency)}
              onChangeText={(v) => setEditWateringFrequency(v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.captionInput, styles.noteInput, { marginTop: 12 }]}
              placeholder="Care notes"
              value={editNotes}
              onChangeText={setEditNotes}
              multiline
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: COLORS.primary },
  errorText: { fontSize: 16, color: COLORS.error },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 12, color: '#999' },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabLabel: { fontSize: 12, color: '#999', fontWeight: '500' },
  activeTabLabel: { color: COLORS.primary, fontWeight: 'bold' },
  tabContent: { flex: 1, padding: 16 },
  detailImage: { width: '100%', height: 250, borderRadius: 8, marginBottom: 16 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 11, color: '#666', marginTop: 4 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  noteText: { fontSize: 13, color: '#555', lineHeight: 20 },
  waterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  waterButtonText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginVertical: 32 },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyContent: { flex: 1, marginLeft: 12 },
  historyDate: { fontSize: 13, fontWeight: '600', color: '#333' },
  historyNotes: { fontSize: 12, color: '#999', marginTop: 4 },
  momentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  momentImage: { width: '100%', height: 200 },
  momentCaption: { fontSize: 13, color: '#333', padding: 12 },
  momentDate: { fontSize: 11, color: '#999', paddingHorizontal: 12, paddingBottom: 12 },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  completedGoal: { borderLeftColor: COLORS.primary, backgroundColor: COLORS.light },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalContent: { flex: 1 },
  goalTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  completedText: { textDecorationLine: 'line-through', color: '#999' },
  goalDescription: { fontSize: 12, color: '#666', marginTop: 4 },
  goalDate: { fontSize: 11, color: '#999', marginTop: 4 },
  noteCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  noteDate: { fontSize: 11, color: '#999', marginBottom: 8 },
  noteContent: { fontSize: 13, color: '#333', lineHeight: 20 },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addButtonText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  modalButton: { color: COLORS.primary, fontWeight: '600' },
  captionInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  noteInput: { height: 120, textAlignVertical: 'top', borderBottomWidth: 0, paddingVertical: 16 },
});
