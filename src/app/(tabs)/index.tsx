import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import {
  calculateDashboardMetrics,
  calculateCategoryBreakdown,
  formatActivityTimestamp,
  formatDashboardDate,
  getAvailableQuantity,
  getInventoryStatus,
} from '../../utils/inventoryCalculations';
import { colors, radii, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { NeedsAttentionCard } from '../../components/inventory/NeedsAttentionCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { HistoryAdjustmentType } from '../../types/inventory';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, history } = useInventory();

  const metrics = useMemo(() => calculateDashboardMetrics(items), [items]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(items), [items]);
  const currentDateFormatted = useMemo(() => formatDashboardDate(), []);

  // Compute availability percentage for the health progress bar
  const availabilityPercentage = useMemo(() => {
    if (metrics.totalQuantity === 0) return 100;
    return Math.round((metrics.totalAvailable / metrics.totalQuantity) * 100);
  }, [metrics.totalAvailable, metrics.totalQuantity]);

  // Max quantity among categories for proportional horizontal bar widths
  const maxCategoryUnits = useMemo(() => {
    if (categoryBreakdown.length === 0) return 1;
    return Math.max(...categoryBreakdown.map((c) => c.totalQuantity), 1);
  }, [categoryBreakdown]);

  // Format activity action label
  const formatActivityItem = (
    type: HistoryAdjustmentType,
    quantity: number,
    itemId: string
  ) => {
    const matchedItem = items.find((i) => i.id === itemId);
    const itemName = matchedItem ? matchedItem.name : 'Equipment Item';
    const unit = matchedItem ? ` ${matchedItem.unit}` : '';

    switch (type) {
      case 'INITIAL':
        return {
          title: `+ ${quantity}${unit} ${itemName} added (intake)`,
          icon: 'box' as const,
          color: colors.bone,
        };
      case 'STOCK_ADDED':
        return {
          title: `+ ${quantity}${unit} ${itemName} added`,
          icon: 'plus-circle' as const,
          color: colors.pulseGreen,
        };
      case 'STOCK_REMOVED':
        return {
          title: `- ${quantity}${unit} ${itemName} removed`,
          icon: 'minus-circle' as const,
          color: colors.coralRed,
        };
      case 'DAMAGED_RECORDED':
        return {
          title: `${quantity}${unit} ${itemName} marked damaged`,
          icon: 'alert-triangle' as const,
          color: colors.coralRed,
        };
      case 'DAMAGED_RESOLVED':
        return {
          title: `${quantity}${unit} ${itemName} repaired & restored`,
          icon: 'check-circle' as const,
          color: colors.pulseGreen,
        };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 1. Dashboard Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleCol}>
          <Text style={styles.screenTitle}>Inventory Overview</Text>
          <Text style={styles.dateSubtitle}>{currentDateFormatted}</Text>
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
            {/* 2. Inventory Health Section */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeaderTitle}>INVENTORY HEALTH</Text>
              <Card style={styles.healthCard}>
                {/* 3 Core Metric Columns */}
                <View style={styles.healthStatsRow}>
                  <View style={styles.healthStatCol}>
                    <Text style={[styles.healthStatValue, { color: colors.pulseGreen }]}>
                      {metrics.totalAvailable}
                    </Text>
                    <Text style={styles.healthStatLabel}>Available</Text>
                  </View>

                  <View style={styles.healthDivider} />

                  <View style={styles.healthStatCol}>
                    <Text
                      style={[
                        styles.healthStatValue,
                        {
                          color:
                            metrics.lowStockCount + metrics.outOfStockCount > 0
                              ? colors.amber
                              : colors.mist,
                        },
                      ]}
                    >
                      {metrics.lowStockCount + metrics.outOfStockCount}
                    </Text>
                    <Text style={styles.healthStatLabel}>Low Stock</Text>
                  </View>

                  <View style={styles.healthDivider} />

                  <View style={styles.healthStatCol}>
                    <Text
                      style={[
                        styles.healthStatValue,
                        {
                          color:
                            metrics.damagedCount > 0
                              ? colors.coralRed
                              : colors.mist,
                        },
                      ]}
                    >
                      {metrics.damagedCount}
                    </Text>
                    <Text style={styles.healthStatLabel}>Damaged</Text>
                  </View>
                </View>

                {/* Availability Progress Indicator */}
                <View style={styles.progressSection}>
                  <View style={styles.progressBarWrapper}>
                    <View
                      style={[
                        styles.progressBarAvailable,
                        { width: `${availabilityPercentage}%` },
                      ]}
                    />
                    {metrics.damagedCount > 0 && metrics.totalQuantity > 0 && (
                      <View
                        style={[
                          styles.progressBarDamaged,
                          {
                            width: `${Math.min(
                              100 - availabilityPercentage,
                              Math.round((metrics.damagedCount / metrics.totalQuantity) * 100)
                            )}%`,
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressText}>
                      {metrics.totalAvailable} of {metrics.totalQuantity} units currently available
                    </Text>
                    <Text style={styles.percentageText}>{availabilityPercentage}% ready</Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* 3. Needs Attention Section (Primary Focus) */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionTitleWithBadge}>
                <Text style={styles.sectionHeaderTitle}>NEEDS ATTENTION</Text>
                {metrics.needsAttentionItems.length > 0 && (
                  <View style={styles.attentionCountBadge}>
                    <Text style={styles.attentionCountText}>
                      {metrics.needsAttentionItems.length}
                    </Text>
                  </View>
                )}
              </View>

              {metrics.needsAttentionItems.length === 0 ? (
                <Card style={styles.allGoodCard}>
                  <View style={styles.allGoodIconCircle}>
                    <Feather name="check" size={18} color={colors.pulseGreen} />
                  </View>
                  <View style={styles.allGoodTextCol}>
                    <Text style={styles.allGoodTitle}>All inventory is in good shape.</Text>
                    <Text style={styles.allGoodSubtitle}>
                      Nothing needs your attention right now.
                    </Text>
                  </View>
                </Card>
              ) : (
                <View style={styles.attentionList}>
                  {metrics.needsAttentionItems.slice(0, 4).map((item) => (
                    <NeedsAttentionCard
                      key={item.id}
                      item={item}
                      onPress={() => router.push(`/item/${item.id}`)}
                    />
                  ))}

                  {metrics.needsAttentionItems.length > 4 && (
                    <Pressable
                      style={styles.viewAllAttentionBtn}
                      onPress={() => router.push('/(tabs)/inventory')}
                    >
                      <Text style={styles.viewAllAttentionText}>
                        View all {metrics.needsAttentionItems.length} items needing attention
                      </Text>
                      <Feather name="arrow-right" size={14} color={colors.mist} />
                    </Pressable>
                  )}
                </View>
              )}
            </View>

            {/* 4. Recent Activity Section */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionTitleWithBadge}>
                <Text style={styles.sectionHeaderTitle}>RECENT ACTIVITY</Text>
                {history.length > 0 && (
                  <Text style={styles.activityCountText}>{history.length} logged</Text>
                )}
              </View>

              <Card style={styles.activityCard}>
                {history.length === 0 ? (
                  <View style={styles.emptyActivityBox}>
                    <Feather name="clock" size={20} color={colors.fog} />
                    <Text style={styles.emptyActivityText}>
                      No recent activity recorded yet.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.activityList}>
                    {history.slice(0, 4).map((entry, idx) => {
                      const formatted = formatActivityItem(
                        entry.type,
                        entry.quantity,
                        entry.inventoryItemId
                      );
                      const isLast = idx === Math.min(history.length, 4) - 1;

                      return (
                        <Pressable
                          key={entry.id}
                          style={[styles.activityRow, !isLast && styles.activityRowDivider]}
                          onPress={() => {
                            const exists = items.some(
                              (i) => i.id === entry.inventoryItemId
                            );
                            if (exists) {
                              router.push(`/item/${entry.inventoryItemId}`);
                            }
                          }}
                        >
                          <View
                            style={[
                              styles.activityIconCircle,
                              { backgroundColor: `${formatted.color}15` },
                            ]}
                          >
                            <Feather
                              name={formatted.icon}
                              size={13}
                              color={formatted.color}
                            />
                          </View>

                          <View style={styles.activityContentCol}>
                            <Text style={styles.activityTitleText} numberOfLines={1}>
                              {formatted.title}
                            </Text>
                            <View style={styles.activityMetaRow}>
                              <Text style={styles.activityTimestamp}>
                                {formatActivityTimestamp(entry.createdAt)}
                              </Text>
                              {entry.note ? (
                                <>
                                  <Text style={styles.activityDot}>•</Text>
                                  <Text style={styles.activityNote} numberOfLines={1}>
                                    {entry.note}
                                  </Text>
                                </>
                              ) : null}
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}

                    {history.length > 4 && (
                      <Pressable
                        style={styles.viewAllHistoryRow}
                        onPress={() => router.push('/(tabs)/inventory')}
                      >
                        <Text style={styles.viewAllHistoryText}>
                          View full activity history
                        </Text>
                        <Feather name="chevron-right" size={14} color={colors.fog} />
                      </Pressable>
                    )}
                  </View>
                )}
              </Card>
            </View>

            {/* 5. Inventory by Category Section */}
            {categoryBreakdown.length > 0 && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionTitleWithBadge}>
                  <Text style={styles.sectionHeaderTitle}>INVENTORY BY CATEGORY</Text>
                  <Text style={styles.activityCountText}>
                    {categoryBreakdown.length} {categoryBreakdown.length === 1 ? 'category' : 'categories'}
                  </Text>
                </View>

                <Card style={styles.categoryCard}>
                  <View style={styles.categoryList}>
                    {categoryBreakdown.map((cat, idx) => {
                      const isLast = idx === categoryBreakdown.length - 1;
                      const barWidthPercent = Math.max(
                        8,
                        Math.round((cat.totalQuantity / maxCategoryUnits) * 100)
                      );

                      return (
                        <View
                          key={cat.category}
                          style={[
                            styles.categoryRowItem,
                            !isLast && styles.categoryRowDivider,
                          ]}
                        >
                          <View style={styles.categoryHeaderRow}>
                            <Text style={styles.categoryNameText}>{cat.category}</Text>
                            <Text style={styles.categoryUnitsText}>
                              {cat.totalQuantity} {cat.totalQuantity === 1 ? 'unit' : 'units'}
                            </Text>
                          </View>

                          {/* Proportion Bar */}
                          <View style={styles.categoryBarContainer}>
                            <View
                              style={[
                                styles.categoryBarFill,
                                { width: `${barWidthPercent}%` },
                              ]}
                            />
                          </View>

                          <View style={styles.categoryFooterRow}>
                            <Text style={styles.categoryFooterText}>
                              {cat.itemCount} {cat.itemCount === 1 ? 'item type' : 'item types'}
                            </Text>
                            <Text style={styles.categoryFooterText}>
                              {cat.availableQuantity} available
                              {cat.damagedQuantity > 0 ? ` · ${cat.damagedQuantity} damaged` : ''}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </Card>
              </View>
            )}
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
  headerTitleCol: {
    gap: 2,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.paper,
    letterSpacing: -0.3,
  },
  dateSubtitle: {
    fontSize: 13,
    color: colors.fog,
    fontWeight: '400',
  },
  scrollContent: {
    padding: spacing[16],
    paddingBottom: spacing[40],
    gap: spacing[20],
  },
  emptyContainer: {
    marginTop: spacing[48],
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
  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing[4],
  },
  attentionCountBadge: {
    backgroundColor: 'rgba(235, 87, 87, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.3)',
  },
  attentionCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.coralRed,
  },
  activityCountText: {
    fontSize: 12,
    color: colors.fog,
  },
  healthCard: {
    padding: spacing[16],
    gap: spacing[16],
  },
  healthStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  healthStatCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  healthStatValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  healthStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.fog,
  },
  healthDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.graphite,
  },
  progressSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: spacing[14],
    gap: spacing[8],
  },
  progressBarWrapper: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.slate,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressBarAvailable: {
    height: '100%',
    backgroundColor: colors.pulseGreen,
  },
  progressBarDamaged: {
    height: '100%',
    backgroundColor: colors.coralRed,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: colors.mist,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.bone,
  },
  allGoodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[14],
    padding: spacing[16],
    backgroundColor: colors.carbon,
    borderColor: 'rgba(39, 166, 68, 0.2)',
  },
  allGoodIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(39, 166, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allGoodTextCol: {
    flex: 1,
    gap: 2,
  },
  allGoodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.paper,
  },
  allGoodSubtitle: {
    fontSize: 12,
    color: colors.fog,
    lineHeight: 16,
  },
  attentionList: {
    gap: spacing[8],
  },
  viewAllAttentionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    paddingVertical: spacing[10],
    backgroundColor: colors.carbon,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.graphite,
  },
  viewAllAttentionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.mist,
  },
  activityCard: {
    padding: spacing[14],
  },
  emptyActivityBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[20],
    gap: spacing[8],
  },
  emptyActivityText: {
    fontSize: 13,
    color: colors.fog,
    fontStyle: 'italic',
  },
  activityList: {
    gap: spacing[12],
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[12],
    paddingVertical: spacing[4],
  },
  activityRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    paddingBottom: spacing[10],
  },
  activityIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  activityContentCol: {
    flex: 1,
    gap: 3,
  },
  activityTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.bone,
    letterSpacing: -0.1,
  },
  activityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  activityTimestamp: {
    fontSize: 11,
    color: colors.fog,
  },
  activityDot: {
    fontSize: 11,
    color: colors.ash,
  },
  activityNote: {
    fontSize: 11,
    color: colors.ash,
    fontStyle: 'italic',
    maxWidth: 180,
  },
  viewAllHistoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[8],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  viewAllHistoryText: {
    fontSize: 12,
    color: colors.fog,
  },
  categoryCard: {
    padding: spacing[14],
  },
  categoryList: {
    gap: spacing[14],
  },
  categoryRowItem: {
    gap: spacing[6],
  },
  categoryRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    paddingBottom: spacing[12],
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.bone,
    letterSpacing: -0.1,
  },
  categoryUnitsText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.paper,
  },
  categoryBarContainer: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.slate,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.irisViolet,
  },
  categoryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryFooterText: {
    fontSize: 11,
    color: colors.fog,
  },
});
