// AddPlantPicker.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { launchCamera, CameraOptions, Asset } from 'react-native-image-picker';

export default function AddPlantPicker() {
  const [photo, setPhoto] = useState<Asset | null>(null);

  const openCamera = async () => {
    const opts: CameraOptions = { mediaType: 'photo', quality: 0.8, saveToPhotos: true };
    const res = await launchCamera(opts);
    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert('Camera error', res.errorMessage || res.errorCode);
      return;
    }
    if (res.assets?.length) setPhoto(res.assets[0]);
  };

  return (
    <View style={{ flex: 1 }}>
      {photo ? (
        <>
          <Image source={{ uri: photo.uri }} style={{ width: '100%', height: 400 }} resizeMode="contain" />
          <TouchableOpacity onPress={() => setPhoto(null)} style={styles.captureButton}><Text>Retake</Text></TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={openCamera} style={styles.captureButton}><Text>Take Photo</Text></TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  previewImage: { width: '100%', height: 400 },
  captureButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});