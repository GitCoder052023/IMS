import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  useDashboard,
  InventoryHealthCard,
  NeedsAttentionCard,
  RecentActivityCard,
  CategoryBreakdownCard,
} from '../../features/dashboard';
import { colors } from '../../theme';
import { Button, Card, EmptyState } from '../../components/ui';
import { styles } from '../../features/dashboard/styles/DashboardScreen.styles';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const {
    items,
    history,
    metrics,
    categoryBreakdown,
    currentDateFormatted,
    availabilityPercentage,
    maxCategoryUnits,
    navigateToAddItem,
    navigateToItemDetail,
    navigateToInventory,
  } = useDashboard();

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
          icon={<Feather name="plus" size={15} color={colors.pureWhite} />}
          onPress={navigateToAddItem}
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
            onAction={navigateToAddItem}
            style={styles.emptyContainer}
          />
        ) : (
          <>
            {/* 2. Inventory Health Section */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeaderTitle}>INVENTORY HEALTH</Text>
              <InventoryHealthCard
                metrics={metrics}
                availabilityPercentage={availabilityPercentage}
              />
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
                      onPress={() => navigateToItemDetail(item.id)}
                    />
                  ))}

                  {metrics.needsAttentionItems.length > 4 && (
                    <Pressable
                      style={styles.viewAllAttentionBtn}
                      onPress={navigateToInventory}
                    >
                      <Text style={styles.viewAllAttentionText}>
                        View all {metrics.needsAttentionItems.length} items needing attention
                      </Text>
                      <Feather name="arrow-right" size={14} color={colors.slateInk} />
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

              <RecentActivityCard
                history={history}
                items={items}
                onItemPress={navigateToItemDetail}
                onViewAllPress={navigateToInventory}
              />
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

                <CategoryBreakdownCard
                  categoryBreakdown={categoryBreakdown}
                  maxCategoryUnits={maxCategoryUnits}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
