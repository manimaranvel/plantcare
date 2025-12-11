import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.syncButton} onPress={() => {/* TODO: implement sync */}}>
        <MaterialIcons name="cloud-upload" size={24} color="#fff" />
        <Text style={styles.syncButtonText}>Sync to Google Drive</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.syncButton} onPress={() => {/* TODO: implement retrieve */}}>
        <MaterialIcons name="cloud-download" size={24} color="#fff" />
        <Text style={styles.syncButtonText}>Retrieve from Google Drive</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  syncButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  syncButtonText: { color: '#fff', marginLeft: 12, fontSize: 16, fontWeight: '600' },
});
