import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import { calculateDashboardMetrics } from '../../utils/inventoryCalculations';
import { colors, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/inventory/MetricCard';
import { NeedsAttentionCard } from '../../components/inventory/NeedsAttentionCard';
import { EmptyState } from '../../components/ui/EmptyState';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, isLoading } = useInventory();

  const metrics = calculateDashboardMetrics(items);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>EQUIPMENT DASHBOARD</Text>
          <Text style={styles.brandSubtitle}>Sports & Fitness Operations</Text>
        </View>
        <Button
          title="Add Item"
          variant="primary"
          icon={<Feather name="plus" size={15} color={colors.void} />}
          onPress={() => router.push('/item/new')}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <EmptyState
            icon="box"
            title="No inventory yet"
            description="Add your first equipment item to start tracking your stock, damages, and minimum thresholds."
            actionTitle="Add First Equipment"
            onAction={() => router.push('/item/new')}
            style={styles.emptyContainer}
          />
        ) : (
          <>
            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricsRow}>
                <MetricCard
                  label="Total Items"
                  value={metrics.totalItems}
                  subtitle="Unique equipment items"
                  icon="layers"
                  accentColor={colors.paper}
                  onPress={() => router.push('/(tabs)/inventory')}
                />
                <MetricCard
                  label="Total Stock"
                  value={metrics.totalQuantity}
                  subtitle={`${metrics.totalAvailable} functional available`}
                  icon="check-circle"
                  accentColor={colors.pulseGreen}
                  onPress={() => router.push('/(tabs)/inventory')}
                />
              </View>

              <View style={styles.metricsRow}>
                <MetricCard
                  label="Low Stock"
                  value={metrics.lowStockCount + metrics.outOfStockCount}
                  subtitle={`${metrics.outOfStockCount} completely depleted`}
                  icon="alert-triangle"
                  accentColor={
                    metrics.lowStockCount + metrics.outOfStockCount > 0
                      ? colors.amber
                      : colors.mist
                  }
                  onPress={() => router.push('/(tabs)/inventory')}
                />
                <MetricCard
                  label="Damaged Units"
                  value={metrics.damagedCount}
                  subtitle="Excluded from usable stock"
                  icon="tool"
                  accentColor={
                    metrics.damagedCount > 0 ? colors.coralRed : colors.mist
                  }
                  onPress={() => router.push('/(tabs)/inventory')}
                />
              </View>
            </View>

            {/* Needs Attention Section */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Needs Attention</Text>
                {metrics.needsAttentionItems.length > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>
                      {metrics.needsAttentionItems.length}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.sectionHint}>
                Depleted, low-stock, or damaged gear
              </Text>
            </View>

            {metrics.needsAttentionItems.length === 0 ? (
              <View style={styles.healthyCard}>
                <Feather
                  name="check-circle"
                  size={20}
                  color={colors.pulseGreen}
                />
                <View style={styles.healthyTextContainer}>
                  <Text style={styles.healthyTitle}>
                    All equipment in good standing
                  </Text>
                  <Text style={styles.healthySubtitle}>
                    Every item is above its minimum desired quantity with zero reported damage.
                  </Text>
                </View>
              </View>
            ) : (
              metrics.needsAttentionItems.map((item) => (
                <NeedsAttentionCard
                  key={item.id}
                  item={item}
                  onPress={() => router.push(`/item/${item.id}`)}
                />
              ))
            )}

            {/* Quick Link to Full Inventory */}
            <View style={styles.footerAction}>
              <Button
                title={`View All ${items.length} Items`}
                variant="ghost"
                icon={<Feather name="arrow-right" size={15} color={colors.mist} />}
                onPress={() => router.push('/(tabs)/inventory')}
              />
            </View>
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.graphite,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.paper,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.fog,
    marginTop: 1,
  },
  scrollContent: {
    padding: spacing[16],
    paddingBottom: spacing[40],
  },
  emptyContainer: {
    marginTop: spacing[48],
  },
  metricsGrid: {
    gap: spacing[12],
    marginBottom: spacing[24],
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing[12],
  },
  sectionHeader: {
    marginBottom: spacing[12],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.paper,
    letterSpacing: -0.2,
  },
  countBadge: {
    backgroundColor: 'rgba(235, 87, 87, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.3)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.coralRed,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.fog,
    marginTop: 2,
  },
  healthyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    backgroundColor: colors.carbon,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.graphite,
    padding: spacing[16],
  },
  healthyTextContainer: {
    flex: 1,
    gap: 2,
  },
  healthyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.paper,
  },
  healthySubtitle: {
    fontSize: 12,
    color: colors.fog,
    lineHeight: 16,
  },
  footerAction: {
    marginTop: spacing[16],
    marginBottom: spacing[8],
  },
});
