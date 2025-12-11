import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
// import MaterialIcons from '@react-native-vector-icons/material-icons';
import { addPlant, updatePlant, getPlantById } from '../../utils/database';
import { generateThumbnail } from '../../utils/imageUtils';
import { useDatabase } from '../../contexts/DatabaseContext';

const COLORS = {
  primary: '#4CAF50',
  light: '#E8F5E9',
  dark: '#2E7D32',
};

export default function AddPlantScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { refreshPlants } = useDatabase();
  const editingId = route?.params?.id ?? null;
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('3');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load plant details if editing
  useEffect(() => {
    if (editingId) {
      (async () => {
        try {
          const plant = await getPlantById(editingId);
          if (plant) {
            setName(plant.name || '');
            setSpecies(plant.species || '');
            setWateringFrequency(String(plant.watering_frequency || '3'));
            setNotes(plant.notes || '');
            setImage(plant.image_thumb || null);
          }
        } catch (err) {
          Alert.alert('Error', 'Failed to load plant details');
        }
      })();
    }
  }, [editingId]);

  const pickImage = async (useCamera: boolean) => {
    try {
      const cameraOptions: CameraOptions = { mediaType: 'photo', quality: 0.8, includeBase64: false };
      const libOptions: ImageLibraryOptions = { mediaType: 'photo', quality: 0.8 };
      const result = useCamera ? await launchCamera(cameraOptions) : await launchImageLibrary(libOptions);

      if (result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri || null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSavePlant = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a plant name');
      return;
    }
    if (!species.trim()) {
      Alert.alert('Error', 'Please enter a species');
      return;
    }
    setLoading(true);
    try {
      let thumbnail = null;
      if (image) {
        thumbnail = await generateThumbnail(image);
      }
      if (editingId) {
        await updatePlant(editingId, {
          name: name.trim(),
          species: species.trim(),
          watering_frequency: parseInt(wateringFrequency) || 3,
          image_thumb: thumbnail,
          notes: notes.trim(),
        });
      } else {
        await addPlant({
          name: name.trim(),
          species: species.trim(),
          added_date: new Date().toISOString(),
          last_watered_date: null,
          watering_frequency: parseInt(wateringFrequency) || 3,
          image_thumb: thumbnail,
          notes: notes.trim(),
          sync_status: 1,
        });
      }
      await refreshPlants();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', editingId ? 'Failed to update plant' : 'Failed to add plant');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editingId ? 'Edit Plant' : 'Add New Plant'}
        </Text>
        <TouchableOpacity onPress={handleSavePlant} disabled={loading}>
          <Text style={[styles.headerButton, loading && styles.disabledButton]}>
            {loading ? (editingId ? 'Saving...' : 'Adding...') : (editingId ? 'Save' : 'Add')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageSection}>
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="image" size={64} color="#ccc" />
          </View>
        )}
        <View style={styles.imageButtons}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage(true)}
          >
            <MaterialIcons name="camera" size={20} color="#fff" />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage(false)}
          >
            <MaterialIcons name="photo-library" size={20} color="#fff" />
            <Text style={styles.imageButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plant Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., My Monstera"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Species *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Monstera deliciosa"
            value={species}
            onChangeText={setSpecies}
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Watering Frequency (days)</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            value={wateringFrequency}
            onChangeText={setWateringFrequency}
            keyboardType="number-pad"
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Care Notes</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Add any care instructions..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor="#ccc"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSavePlant}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading
            ? (editingId ? 'Saving Plant...' : 'Adding Plant...')
            : (editingId ? 'Save Plant' : 'Add Plant')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerButton: { color: COLORS.primary, fontWeight: '600', fontSize: 16 },
  disabledButton: { opacity: 0.5 },
  imageSection: { padding: 16 },
  selectedImage: { width: '100%', height: 250, borderRadius: 8, marginBottom: 12 },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageButtons: { flexDirection: 'row', gap: 12 },
  imageButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  form: { paddingHorizontal: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textarea: { textAlignVertical: 'top', paddingTop: 10 },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
