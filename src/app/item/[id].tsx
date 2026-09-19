import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  useItemDetail,
  AdjustmentModal,
  HistoryTimeline,
} from '../../features/inventory';
import { colors, spacing } from '../../theme';
import { Button, Card, StatusBadge, DamagedBadge, CategoryTag } from '../../components/ui';
import { styles } from '../../features/inventory/styles/ItemDetailScreen.styles';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const {
    item,
    history,
    available,
    status,
    activeModal,
    setActiveModal,
    handleDelete,
    handleModalSubmit,
    navigateBack,
    navigateToInventory,
    navigateToEdit,
  } = useItemDetail(id ? String(id) : undefined);

  if (!item) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={navigateBack} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.slateInk} />
          </Pressable>
          <Text style={styles.headerTitle}>Item Not Found</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.centerBox}>
          <Text style={styles.notFoundText}>Equipment item does not exist or was deleted.</Text>
          <Button
            title="Back to Inventory"
            variant="ghost"
            onPress={navigateToInventory}
            style={{ marginTop: spacing[16] }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={navigateBack}
          hitSlop={8}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <Feather name="arrow-left" size={20} color={colors.slateInk} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.headerActions}>
          <Pressable
            onPress={navigateToEdit}
            hitSlop={8}
            style={styles.actionIconBtn}
            accessibilityLabel="Edit item"
          >
            <Feather name="edit-2" size={18} color={colors.slateInk} />
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
              icon={<Feather name="plus-circle" size={15} color={colors.shopViolet} />}
              onPress={() => setActiveModal('ADD_STOCK')}
              style={styles.gridBtn}
            />

            <Button
              title="Remove Stock"
              variant="secondary"
              icon={<Feather name="minus-circle" size={15} color={colors.slateInk} />}
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
