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
import { colors, radii, spacing } from '../../theme/tokens';
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
        <Text style={styles.screenSubtitle}>Local offline data & preferences</Text>
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
                <Feather name="hard-drive" size={16} color={colors.mist} />
                <Text style={styles.infoLabel}>Persistence Mode</Text>
              </View>
              <Text style={styles.infoValue}>100% Offline Local Storage</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoTitleCol}>
                <Feather name="layers" size={16} color={colors.mist} />
                <Text style={styles.infoLabel}>Stored Equipment Items</Text>
              </View>
              <Text style={styles.infoValue}>{items.length} items</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoTitleCol}>
                <Feather name="clock" size={16} color={colors.mist} />
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
              <Feather name="alert-circle" size={18} color={colors.coralRed} />
              <Text style={styles.dangerTitle}>Clear All Inventory</Text>
            </View>
            <Text style={styles.dangerDescription}>
              Permanently wipes all user-created inventory items, damage records, and
              adjustment history from local storage.
            </Text>
            <Button
              title="Clear All Inventory"
              variant="danger"
              icon={<Feather name="trash-2" size={15} color={colors.coralRed} />}
              onPress={handleClearAll}
              loading={isClearing}
              disabled={items.length === 0 && history.length === 0}
              style={styles.dangerBtn}
            />
          </Card>
        </View>

        {/* About Domain Card */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DOMAIN & PURPOSE</Text>
          <Card style={styles.infoCard}>
            <Text style={styles.aboutTitle}>Domain-Universal Architecture</Text>
            <Text style={styles.aboutText}>
              This application is designed for sports and fitness organizations including:
            </Text>
            <View style={styles.sportsList}>
              {[
                'Gyms & Fitness Studios',
                'Cricket Academies',
                'Football & Futsal Clubs',
                'Tennis & Racket Academies',
                'Basketball & Volleyball Facilities',
                'Swimming Centers',
                'Martial Arts & Combat Dojos',
                'Yoga & Pilates Studios',
              ].map((domain) => (
                <View key={domain} style={styles.sportItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.sportText}>{domain}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  header: {
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.graphite,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.paper,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12,
    color: colors.fog,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing[16],
    paddingBottom: spacing[40],
    gap: spacing[20],
  },
  section: {
    gap: spacing[8],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.fog,
    letterSpacing: 0.6,
    paddingLeft: spacing[4],
  },
  infoCard: {
    gap: spacing[10],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  infoTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  infoLabel: {
    fontSize: 13,
    color: colors.mist,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.paper,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dangerCard: {
    backgroundColor: 'rgba(235, 87, 87, 0.05)',
    borderColor: 'rgba(235, 87, 87, 0.2)',
    gap: spacing[10],
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.coralRed,
  },
  dangerDescription: {
    fontSize: 13,
    color: colors.fog,
    lineHeight: 18,
  },
  dangerBtn: {
    marginTop: spacing[6],
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.paper,
    marginBottom: spacing[4],
  },
  aboutText: {
    fontSize: 13,
    color: colors.fog,
    lineHeight: 18,
  },
  sportsList: {
    marginTop: spacing[4],
    gap: 6,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.acidLime,
  },
  sportText: {
    fontSize: 12,
    color: colors.mist,
  },
});
