import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import {
  getInventoryStatus,
} from '../../utils/inventoryCalculations';
import { colors, radii, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { InventoryItemCard } from '../../components/inventory/InventoryItemCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { InventoryFilterStatus } from '../../types/inventory';

export default function InventoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<InventoryFilterStatus>('ALL');

  // Dynamically extract all unique categories present in items
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['ALL', ...cats.sort()];
  }, [items]);

  // Filter items based on search query, category, and status
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      // 1. Search Query
      if (q) {
        const nameMatch = item.name.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const notesMatch = item.notes?.toLowerCase().includes(q);
        if (!nameMatch && !catMatch && !notesMatch) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus === 'DAMAGED') {
        // Orthogonal damage filter: filters items that have damagedQuantity > 0
        if (item.damagedQuantity <= 0) return false;
      } else if (selectedStatus !== 'ALL') {
        const itemStatus = getInventoryStatus(item);
        if (itemStatus !== selectedStatus) return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'ALL' ||
    selectedStatus !== 'ALL';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Equipment Inventory</Text>
          <Text style={styles.itemCountText}>
            {filteredItems.length} of {items.length} items
          </Text>
        </View>
        <Button
          title="Add Item"
          variant="primary"
          icon={<Feather name="plus" size={15} color={colors.void} />}
          onPress={() => router.push('/item/new')}
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={colors.fog} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment, category, notes..."
            placeholderTextColor={colors.fog}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Feather name="x-circle" size={16} color={colors.fog} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Status Filter Chips */}
      <View style={styles.filterChipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}
        >
          {(
            [
              { key: 'ALL', label: 'All Status' },
              { key: 'IN_STOCK', label: 'In Stock' },
              { key: 'LOW_STOCK', label: 'Low Stock' },
              { key: 'OUT_OF_STOCK', label: 'Out of Stock' },
              { key: 'DAMAGED', label: 'Has Damaged' },
            ] as const
          ).map((statusOption) => {
            const isSelected = selectedStatus === statusOption.key;
            return (
              <Pressable
                key={statusOption.key}
                onPress={() => setSelectedStatus(statusOption.key)}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {statusOption.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Categories Filter Chips (if more than 1 category exists) */}
      {categories.length > 1 && (
        <View style={styles.categoryChipsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsScroll}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Inventory List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InventoryItemCard
            item={item}
            onPress={() => router.push(`/item/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          items.length === 0 ? (
            <EmptyState
              icon="box"
              title="No inventory yet"
              description="Add your first item to start tracking your equipment, stock, and damage counts."
              actionTitle="Add Equipment Item"
              onAction={() => router.push('/item/new')}
              style={styles.emptyContainer}
            />
          ) : (
            <EmptyState
              icon="search"
              title="No equipment found"
              description={`No equipment items match the current search query and filters.`}
              actionTitle="Clear Filters"
              onAction={clearAllFilters}
              style={styles.emptyContainer}
            />
          )
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  itemCountText: {
    fontSize: 12,
    color: colors.fog,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: spacing[16],
    paddingTop: spacing[12],
    paddingBottom: spacing[8],
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radii.input,
    paddingHorizontal: spacing[12],
    height: 40,
    gap: spacing[8],
  },
  searchInput: {
    flex: 1,
    color: colors.mist,
    fontSize: 14,
  },
  filterChipsRow: {
    paddingBottom: spacing[6],
  },
  categoryChipsRow: {
    paddingBottom: spacing[10],
  },
  filterChipsScroll: {
    paddingHorizontal: spacing[16],
    gap: spacing[8],
  },
  filterChip: {
    paddingHorizontal: spacing[12],
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: {
    backgroundColor: colors.acidLime,
    borderColor: colors.acidLime,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mist,
  },
  filterChipTextActive: {
    color: colors.void,
    fontWeight: '600',
  },
  categoryChip: {
    paddingHorizontal: spacing[10],
    paddingVertical: 4,
    borderRadius: radii.badge,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: colors.irisViolet,
  },
  categoryChipText: {
    fontSize: 11,
    color: '#a5b4fc',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.paper,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing[16],
    paddingTop: spacing[8],
    paddingBottom: spacing[40],
  },
  emptyContainer: {
    marginTop: spacing[40],
  },
});
