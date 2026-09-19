import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInventory } from '../../features/inventory';
import { StorageInfoCard, DataManagementCard } from '../../features/settings';
import { styles } from '../../features/settings/styles/SettingsScreen.styles';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { items, history, clearAllData } = useInventory();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Application Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Storage Status Card */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OFFLINE STORAGE</Text>
          <StorageInfoCard
            itemsCount={items.length}
            historyCount={history.length}
          />
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATA MANAGEMENT</Text>
          <DataManagementCard
            hasData={items.length > 0 || history.length > 0}
            onClearAll={clearAllData}
          />
        </View>
      </ScrollView>
    </View>
  );
}
