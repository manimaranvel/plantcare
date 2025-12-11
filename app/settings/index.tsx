import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  primary: '#4CAF50',
  inactive: '#999',
  background: '#f5f5f5',
};

export default function SettingsScreen({ navigation }: any) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [syncInterval, setSyncInterval] = useState(30); // minutes

  useEffect(() => {
    let syncTimer: NodeJS.Timeout;

    if (autoSyncEnabled) {
      syncTimer = setInterval(() => {
        handleGoogleDriveSync();
      }, syncInterval * 60 * 1000);
    }

    return () => {
      if (syncTimer) clearInterval(syncTimer);
    };
  }, [autoSyncEnabled, syncInterval]);

  const handleGoogleDriveSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Implement actual Google Drive API integration
      // This is a placeholder that simulates the sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date().toLocaleString();
      setLastSyncTime(now);
      
      if (!autoSyncEnabled) {
        Alert.alert('Success', 'Database synced with Google Drive successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sync with Google Drive');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAutoSyncToggle = (value: boolean) => {
    setAutoSyncEnabled(value);
    if (value) {
      Alert.alert('Auto Sync Enabled', `Your data will sync every ${syncInterval} minutes`);
    } else {
      Alert.alert('Auto Sync Disabled', 'Manual sync only');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cloud Sync</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Icon name="cloud-upload" size={24} color={COLORS.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Google Drive Sync</Text>
              <Text style={styles.settingDescription}>
                Backup your plant data to Google Drive
              </Text>
              {lastSyncTime && (
                <Text style={styles.lastSync}>Last sync: {lastSyncTime}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
            onPress={handleGoogleDriveSync}
            disabled={isSyncing}
          >
            <Text style={styles.syncButtonText}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auto Sync Settings</Text>
        
        <View style={styles.toggleItem}>
          <View style={styles.settingContent}>
            <Icon name="schedule" size={24} color={COLORS.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Enable Auto Sync</Text>
              <Text style={styles.settingDescription}>
                Automatically sync data at regular intervals
              </Text>
            </View>
          </View>
          <Switch
            value={autoSyncEnabled}
            onValueChange={handleAutoSyncToggle}
            trackColor={{ false: '#ccc', true: COLORS.primary }}
            thumbColor={autoSyncEnabled ? COLORS.primary : '#f4f3f4'}
          />
        </View>

        {autoSyncEnabled && (
          <View style={styles.intervalSelector}>
            <Text style={styles.intervalLabel}>Sync Interval</Text>
            <View style={styles.intervalButtonGroup}>
              {[15, 30, 60].map((interval) => (
                <TouchableOpacity
                  key={interval}
                  style={[
                    styles.intervalButton,
                    syncInterval === interval && styles.intervalButtonActive,
                  ]}
                  onPress={() => setSyncInterval(interval)}
                >
                  <Text
                    style={[
                      styles.intervalButtonText,
                      syncInterval === interval && styles.intervalButtonTextActive,
                    ]}
                  >
                    {interval}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Plant Care App</Text>
          <Text style={styles.settingDescription}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  lastSync: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
  },
  syncButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  intervalSelector: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  intervalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  intervalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  intervalButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  intervalButtonActive: {
    backgroundColor: COLORS.primary,
  },
  intervalButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  intervalButtonTextActive: {
    color: '#fff',
  },
});
