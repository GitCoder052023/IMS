import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import {
  getAvailableQuantity,
  getInventoryStatus,
} from '../../utils/inventoryCalculations';
import { colors, radii, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge, DamagedBadge, CategoryTag } from '../../components/ui/StatusBadge';
import {
  AdjustmentModal,
  AdjustmentMode,
} from '../../components/ui/AdjustmentModal';
import { HistoryTimeline } from '../../components/inventory/HistoryTimeline';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const {
    getItem,
    getItemHistory,
    addStock,
    removeStock,
    recordDamage,
    repairDamage,
    deleteItem,
  } = useInventory();

  const [activeModal, setActiveModal] = useState<AdjustmentMode | null>(null);

  const item = getItem(String(id));
  const history = getItemHistory(String(id));

  if (!item) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.mist} />
          </Pressable>
          <Text style={styles.headerTitle}>Item Not Found</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.centerBox}>
          <Text style={styles.notFoundText}>Equipment item does not exist or was deleted.</Text>
          <Button
            title="Back to Inventory"
            variant="ghost"
            onPress={() => router.replace('/(tabs)/inventory')}
            style={{ marginTop: spacing[16] }}
          />
        </View>
      </View>
    );
  }

  const available = getAvailableQuantity(item);
  const status = getInventoryStatus(item);

  const handleDelete = () => {
    const confirmMsg = `Are you sure you want to delete "${item.name}"? All stock history for this item will also be removed.`;

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        deleteItem(item.id);
        router.back();
      }
    } else {
      Alert.alert(
        'Delete Equipment Item',
        confirmMsg,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteItem(item.id);
              router.back();
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleModalSubmit = async (amount: number, note?: string) => {
    if (!activeModal) return;

    switch (activeModal) {
      case 'ADD_STOCK':
        await addStock(item.id, amount, note);
        break;
      case 'REMOVE_STOCK':
        await removeStock(item.id, amount, note);
        break;
      case 'RECORD_DAMAGE':
        await recordDamage(item.id, amount, note);
        break;
      case 'REPAIR_DAMAGED':
        await repairDamage(item.id, amount, note);
        break;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <Feather name="arrow-left" size={20} color={colors.mist} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push({ pathname: '/item/edit', params: { id: item.id } })}
            hitSlop={8}
            style={styles.actionIconBtn}
            accessibilityLabel="Edit item"
          >
            <Feather name="edit-2" size={18} color={colors.mist} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            hitSlop={8}
            style={styles.actionIconBtn}
            accessibilityLabel="Delete item"
          >
            <Feather name="trash-2" size={18} color={colors.coralRed} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Item Header & Category */}
        <View style={styles.itemHeaderBlock}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.badgeRow}>
            <CategoryTag category={item.category} />
            <StatusBadge status={status} />
            {item.damagedQuantity > 0 && (
              <DamagedBadge count={item.damagedQuantity} unit={item.unit} />
            )}
          </View>
        </View>

        {/* Core Stock Breakdown Card */}
        <Card style={styles.breakdownCard}>
          <Text style={styles.cardHeaderTitle}>INVENTORY BREAKDOWN</Text>

          <View style={styles.primaryMetricRow}>
            <View>
              <Text style={styles.primaryMetricValue}>{available}</Text>
              <Text style={styles.primaryMetricLabel}>
                AVAILABLE FOR USE ({item.unit.toUpperCase()})
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View>
              <Text style={styles.secondaryMetricValue}>{item.quantity}</Text>
              <Text style={styles.secondaryMetricLabel}>TOTAL OWNED</Text>
            </View>
          </View>

          <View style={styles.metricDetailGrid}>
            <View style={styles.metricTile}>
              <Text style={styles.tileLabel}>Damaged / Broken</Text>
              <Text
                style={[
                  styles.tileValue,
                  item.damagedQuantity > 0 && { color: colors.coralRed },
                ]}
              >
                {item.damagedQuantity} {item.unit}
              </Text>
            </View>

            <View style={styles.metricTile}>
              <Text style={styles.tileLabel}>Minimum Desired</Text>
              <Text style={styles.tileValue}>
                {item.minimumQuantity} {item.unit}
              </Text>
            </View>
          </View>

          {item.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesBody}>{item.notes}</Text>
            </View>
          ) : null}
        </Card>

        {/* Stock Actions Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeaderTitle}>STOCK & CONDITION ACTIONS</Text>

          <View style={styles.actionButtonsGrid}>
            <Button
              title="Add Stock"
              variant="secondary"
              icon={<Feather name="plus-circle" size={15} color={colors.acidLime} />}
              onPress={() => setActiveModal('ADD_STOCK')}
              style={styles.gridBtn}
            />

            <Button
              title="Remove Stock"
              variant="secondary"
              icon={<Feather name="minus-circle" size={15} color={colors.mist} />}
              onPress={() => setActiveModal('REMOVE_STOCK')}
              disabled={available <= 0}
              style={styles.gridBtn}
            />

            <Button
              title="Record Damage"
              variant="secondary"
              icon={<Feather name="alert-triangle" size={15} color={colors.coralRed} />}
              onPress={() => setActiveModal('RECORD_DAMAGE')}
              disabled={available <= 0}
              style={styles.gridBtn}
            />

            <Button
              title="Repair / Restore"
              variant="secondary"
              icon={<Feather name="check-circle" size={15} color={colors.pulseGreen} />}
              onPress={() => setActiveModal('REPAIR_DAMAGED')}
              disabled={item.damagedQuantity <= 0}
              style={styles.gridBtn}
            />
          </View>
        </View>

        {/* History Timeline */}
        <View style={styles.sectionBlock}>
          <View style={styles.timelineHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>ACTIVITY HISTORY</Text>
            <Text style={styles.timelineCount}>{history.length} events</Text>
          </View>

          <Card style={styles.historyCard}>
            <HistoryTimeline history={history} unit={item.unit} />
          </Card>
        </View>
      </ScrollView>

      {/* Adjustment Modal */}
      <AdjustmentModal
        visible={activeModal !== null}
        mode={activeModal}
        itemName={item.name}
        unit={item.unit}
        currentQuantity={item.quantity}
        currentDamaged={item.damagedQuantity}
        currentAvailable={available}
        onClose={() => setActiveModal(null)}
        onSubmit={handleModalSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.graphite,
  },
  backBtn: {
    padding: spacing[4],
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.paper,
    maxWidth: 220,
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[16],
  },
  actionIconBtn: {
    padding: spacing[4],
  },
  scrollContent: {
    padding: spacing[16],
    paddingBottom: spacing[48],
    gap: spacing[20],
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[24],
  },
  notFoundText: {
    fontSize: 14,
    color: colors.fog,
    textAlign: 'center',
  },
  itemHeaderBlock: {
    gap: spacing[8],
  },
  itemName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.paper,
    letterSpacing: -0.4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[8],
  },
  breakdownCard: {
    gap: spacing[16],
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.fog,
    letterSpacing: 0.6,
  },
  primaryMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[24],
    paddingVertical: spacing[4],
  },
  primaryMetricValue: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.paper,
    letterSpacing: -1,
  },
  primaryMetricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.fog,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.graphite,
  },
  secondaryMetricValue: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.bone,
    letterSpacing: -0.5,
  },
  secondaryMetricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.ash,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  metricDetailGrid: {
    flexDirection: 'row',
    gap: spacing[12],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: spacing[12],
  },
  metricTile: {
    flex: 1,
    gap: 2,
  },
  tileLabel: {
    fontSize: 12,
    color: colors.fog,
  },
  tileValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.mist,
  },
  notesBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radii.input,
    padding: spacing[10],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 4,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.fog,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesBody: {
    fontSize: 13,
    color: colors.mist,
    lineHeight: 18,
  },
  sectionBlock: {
    gap: spacing[10],
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.fog,
    letterSpacing: 0.6,
    paddingLeft: spacing[4],
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[10],
  },
  gridBtn: {
    flex: 1,
    minWidth: '46%',
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  timelineCount: {
    fontSize: 12,
    color: colors.fog,
  },
  historyCard: {
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
  },
});
