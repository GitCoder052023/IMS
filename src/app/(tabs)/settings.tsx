import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import { colors, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { items, history, clearAllData } = useInventory();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = () => {
    const confirmMessage =
      'Are you sure you want to permanently delete all inventory items and activity logs? This action cannot be undone.';

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        performClear();
      }
    } else {
      Alert.alert(
        'Clear All Inventory',
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Everything',
            style: 'destructive',
            onPress: performClear,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const performClear = async () => {
    try {
      setIsClearing(true);
      await clearAllData();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

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
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoTitleCol}>
                <Feather name="hard-drive" size={16} color={colors.mutedGray} />
                <Text style={styles.infoLabel}>Persistence Mode</Text>
              </View>
              <Text style={styles.infoValue}>100% Offline Local Storage</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoTitleCol}>
                <Feather name="layers" size={16} color={colors.mutedGray} />
                <Text style={styles.infoLabel}>Stored Equipment Items</Text>
              </View>
              <Text style={styles.infoValue}>{items.length} items</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoTitleCol}>
                <Feather name="clock" size={16} color={colors.mutedGray} />
                <Text style={styles.infoLabel}>Adjustment History Logs</Text>
              </View>
              <Text style={styles.infoValue}>{history.length} records</Text>
            </View>
          </Card>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATA MANAGEMENT</Text>
          <Card style={styles.dangerCard}>
            <View style={styles.dangerHeader}>
              <Feather name="alert-circle" size={18} color="#eb5757" />
              <Text style={styles.dangerTitle}>Clear All Inventory</Text>
            </View>
            <Text style={styles.dangerDescription}>
              Permanently wipes all user-created inventory items, damage records, and
              adjustment history from local storage.
            </Text>
            <Button
              title="Clear All Inventory"
              variant="danger"
              icon={<Feather name="trash-2" size={15} color="#ffffff" />}
              onPress={handleClearAll}
              loading={isClearing}
              disabled={items.length === 0 && history.length === 0}
              style={styles.dangerBtn}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasMist,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    backgroundColor: '#ffffff',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#787574',
    letterSpacing: 0.6,
    paddingLeft: 4,
  },
  infoCard: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#787574',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ebebeb',
  },
  dangerCard: {
    gap: 10,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#eb5757',
    letterSpacing: -0.2,
  },
  dangerDescription: {
    fontSize: 13,
    color: '#787574',
    lineHeight: 18,
  },
  dangerBtn: {
    marginTop: 6,
  },
});
