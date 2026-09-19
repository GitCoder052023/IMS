import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import {
  getAvailableQuantity,
  getInventoryStatus,
} from '../../utils/inventoryCalculations';
import { colors, radii, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { InventoryItemCard } from '../../components/inventory/InventoryItemCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { InventoryFilterStatus, InventoryItem } from '../../types/inventory';

const PAGE_SIZE = 10;

type SortOption =
  | 'RECENT'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'AVAILABLE_ASC'
  | 'AVAILABLE_DESC'
  | 'DAMAGED_DESC';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'RECENT', label: 'Recently Updated' },
  { key: 'NAME_ASC', label: 'Name A–Z' },
  { key: 'NAME_DESC', label: 'Name Z–A' },
  { key: 'AVAILABLE_ASC', label: 'Lowest Available Stock' },
  { key: 'AVAILABLE_DESC', label: 'Highest Available Stock' },
  { key: 'DAMAGED_DESC', label: 'Most Damaged' },
];

export default function InventoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items } = useInventory();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<InventoryFilterStatus>('ALL');
  const [selectedSort, setSelectedSort] = useState<SortOption>('RECENT');

  // Pagination & Grouping State
  const [currentPage, setCurrentPage] = useState(1);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Modal Sheet Visibility
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  // Temporary filter selections inside modal
  const [tempCategory, setTempCategory] = useState<string>('ALL');
  const [tempStatus, setTempStatus] = useState<InventoryFilterStatus>('ALL');

  // Dynamically extract all unique categories present in actual inventory
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['ALL', ...cats.sort()];
  }, [items]);

  // Reset pagination whenever search query, filters, or sort order change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedSort]);

  // Open filter modal and sync temp state
  const openFilterModal = () => {
    setTempCategory(selectedCategory);
    setTempStatus(selectedStatus);
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedStatus(tempStatus);
    setIsFilterModalOpen(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedSort('RECENT');
    setTempCategory('ALL');
    setTempStatus('ALL');
    setIsFilterModalOpen(false);
  };

  // 1. Filter items based on search query, category, and status
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      // Search
      if (q) {
        const nameMatch = item.name.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const notesMatch = item.notes?.toLowerCase().includes(q);
        if (!nameMatch && !catMatch && !notesMatch) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus === 'DAMAGED') {
        if (item.damagedQuantity <= 0) return false;
      } else if (selectedStatus !== 'ALL') {
        const itemStatus = getInventoryStatus(item);
        if (itemStatus !== selectedStatus) return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  // 2. Sort filtered items
  const sortedFilteredItems = useMemo(() => {
    const sorted = [...filteredItems];
    switch (selectedSort) {
      case 'NAME_ASC':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'NAME_DESC':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'AVAILABLE_ASC':
        return sorted.sort(
          (a, b) => getAvailableQuantity(a) - getAvailableQuantity(b)
        );
      case 'AVAILABLE_DESC':
        return sorted.sort(
          (a, b) => getAvailableQuantity(b) - getAvailableQuantity(a)
        );
      case 'DAMAGED_DESC':
        return sorted.sort((a, b) => b.damagedQuantity - a.damagedQuantity);
      case 'RECENT':
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA;
        });
    }
  }, [filteredItems, selectedSort]);

  // 3. Pagination calculations
  const totalItemsCount = sortedFilteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItemsCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItemsCount);

  const paginatedItems = useMemo(() => {
    return sortedFilteredItems.slice(startIndex, endIndex);
  }, [sortedFilteredItems, startIndex, endIndex]);

  // 4. Group paginated items by category
  const categoryGroups = useMemo(() => {
    const groupMap = new Map<string, InventoryItem[]>();

    for (const item of paginatedItems) {
      const list = groupMap.get(item.category) || [];
      list.push(item);
      groupMap.set(item.category, list);
    }

    return Array.from(groupMap.entries()).map(([category, groupItems]) => ({
      category,
      items: groupItems,
    }));
  }, [paginatedItems]);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  // Overall available units for header
  const totalAvailableUnits = useMemo(() => {
    return items.reduce((sum, i) => sum + getAvailableQuantity(i), 0);
  }, [items]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedSort !== 'RECENT';

  const filterBadgeCount =
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedStatus === 'DAMAGED' ? 1 : 0);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.key === selectedSort)?.label || 'Sort';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 1. Header with dynamic summary */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.screenTitle}>Inventory</Text>
          <Text style={styles.itemCountText}>
            {!hasActiveFilters
              ? `${items.length} ${items.length === 1 ? 'item' : 'items'} · ${totalAvailableUnits} available ${
                  totalAvailableUnits === 1 ? 'unit' : 'units'
                }`
              : `Showing ${filteredItems.length} of ${items.length} items`}
          </Text>
        </View>
        <Button
          title="Add Item"
          variant="primary"
          icon={<Feather name="plus" size={15} color={colors.void} />}
          onPress={() => router.push('/item/new')}
        />
      </View>

      {/* 2. Search Box */}
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

      {/* 3. Compact Filter Controls */}
      <View style={styles.filterBar}>
        {/* Quick Status Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickStatusScroll}
        >
          {(
            [
              { key: 'ALL', label: 'All' },
              { key: 'IN_STOCK', label: 'In Stock' },
              { key: 'LOW_STOCK', label: 'Low Stock' },
              { key: 'OUT_OF_STOCK', label: 'Out of Stock' },
            ] as const
          ).map((opt) => {
            const isSelected = selectedStatus === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSelectedStatus(opt.key)}
                style={[styles.statusPill, isSelected && styles.statusPillActive]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    isSelected && styles.statusPillTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Action Controls: Filters modal trigger + Sort modal trigger */}
        <View style={styles.controlsRow}>
          <Pressable
            style={[styles.controlBtn, filterBadgeCount > 0 && styles.controlBtnActive]}
            onPress={openFilterModal}
          >
            <Feather
              name="sliders"
              size={13}
              color={filterBadgeCount > 0 ? colors.acidLime : colors.mist}
            />
            <Text
              style={[
                styles.controlBtnText,
                filterBadgeCount > 0 && styles.controlBtnTextActive,
              ]}
            >
              Filters
              {filterBadgeCount > 0 ? ` (${filterBadgeCount})` : ''}
            </Text>
          </Pressable>

          <Pressable style={styles.controlBtn} onPress={() => setIsSortModalOpen(true)}>
            <Feather name="bar-chart-2" size={13} color={colors.mist} />
            <Text style={styles.controlBtnText} numberOfLines={1}>
              {currentSortLabel}
            </Text>
            <Feather name="chevron-down" size={13} color={colors.fog} />
          </Pressable>
        </View>
      </View>

      {/* 4. Inventory List with Collapsible Categories & Pagination */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <EmptyState
            icon="box"
            title="No inventory yet"
            description="Add your first item to start tracking your equipment, stock, and damage counts."
            actionTitle="Add Equipment Item"
            onAction={() => router.push('/item/new')}
            style={styles.emptyContainer}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon="search"
            title="No equipment found"
            description="No equipment items match the current search query and filters."
            actionTitle="Clear Filters"
            onAction={clearAllFilters}
            style={styles.emptyContainer}
          />
        ) : (
          <>
            {/* Category Groups */}
            {categoryGroups.map((group) => {
              const isCollapsed = collapsedCategories.has(group.category);

              return (
                <View key={group.category} style={styles.categorySection}>
                  {/* Category Header */}
                  <Pressable
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(group.category)}
                  >
                    <View style={styles.categoryHeaderTitleRow}>
                      <Text style={styles.categoryHeaderTitle}>
                        {group.category.toUpperCase()}
                      </Text>
                      <View style={styles.categoryCountBadge}>
                        <Text style={styles.categoryCountText}>
                          {group.items.length}
                        </Text>
                      </View>
                    </View>
                    <Feather
                      name={isCollapsed ? 'chevron-right' : 'chevron-down'}
                      size={16}
                      color={colors.fog}
                    />
                  </Pressable>

                  {/* Expanded Items */}
                  {!isCollapsed && (
                    <View style={styles.categoryItemsContainer}>
                      {group.items.map((item) => (
                        <InventoryItemCard
                          key={item.id}
                          item={item}
                          onPress={() => router.push(`/item/${item.id}`)}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {/* 5. Pagination Bar */}
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationSummaryText}>
                Showing {startIndex + 1}–{endIndex} of {totalItemsCount} items
              </Text>

              <View style={styles.paginationControls}>
                <Pressable
                  onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  style={[
                    styles.pageNavBtn,
                    safePage <= 1 && styles.pageNavBtnDisabled,
                  ]}
                >
                  <Feather
                    name="arrow-left"
                    size={14}
                    color={safePage <= 1 ? colors.ash : colors.mist}
                  />
                  <Text
                    style={[
                      styles.pageNavBtnText,
                      safePage <= 1 && styles.pageNavBtnTextDisabled,
                    ]}
                  >
                    Previous
                  </Text>
                </Pressable>

                <Text style={styles.pageIndicatorText}>
                  Page {safePage} of {totalPages}
                </Text>

                <Pressable
                  onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  style={[
                    styles.pageNavBtn,
                    safePage >= totalPages && styles.pageNavBtnDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.pageNavBtnText,
                      safePage >= totalPages && styles.pageNavBtnTextDisabled,
                    ]}
                  >
                    Next
                  </Text>
                  <Feather
                    name="arrow-right"
                    size={14}
                    color={safePage >= totalPages ? colors.ash : colors.mist}
                  />
                </Pressable>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Filter Modal Sheet */}
      <Modal
        visible={isFilterModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalBackdrop}
        >
          <Pressable
            style={styles.modalScrim}
            onPress={() => setIsFilterModalOpen(false)}
          />
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Inventory</Text>
              <Pressable
                onPress={() => setIsFilterModalOpen(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={18} color={colors.fog} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Status Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionLabel}>STOCK STATUS</Text>
                <View style={styles.modalOptionsGrid}>
                  {(
                    [
                      { key: 'ALL', label: 'All Statuses' },
                      { key: 'IN_STOCK', label: 'In Stock' },
                      { key: 'LOW_STOCK', label: 'Low Stock' },
                      { key: 'OUT_OF_STOCK', label: 'Out of Stock' },
                      { key: 'DAMAGED', label: 'Has Damaged Units' },
                    ] as const
                  ).map((opt) => {
                    const isSelected = tempStatus === opt.key;
                    return (
                      <Pressable
                        key={opt.key}
                        onPress={() => setTempStatus(opt.key)}
                        style={[
                          styles.modalOptionCard,
                          isSelected && styles.modalOptionCardActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            isSelected && styles.modalOptionTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        {isSelected && (
                          <Feather name="check" size={14} color={colors.acidLime} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Category Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionLabel}>CATEGORY</Text>
                <View style={styles.modalOptionsGrid}>
                  {availableCategories.map((cat) => {
                    const isSelected = tempCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setTempCategory(cat)}
                        style={[
                          styles.modalOptionCard,
                          isSelected && styles.modalOptionCardActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            isSelected && styles.modalOptionTextActive,
                          ]}
                        >
                          {cat === 'ALL' ? 'All Categories' : cat}
                        </Text>
                        {isSelected && (
                          <Feather name="check" size={14} color={colors.acidLime} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActionsRow}>
              <Button
                title="Reset"
                variant="ghost"
                onPress={() => {
                  setTempCategory('ALL');
                  setTempStatus('ALL');
                }}
                style={styles.modalActionBtn}
              />
              <Button
                title="Apply Filters"
                variant="primary"
                onPress={applyFilters}
                style={styles.modalActionBtn}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Sort Modal Sheet */}
      <Modal
        visible={isSortModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalBackdrop}
        >
          <Pressable
            style={styles.modalScrim}
            onPress={() => setIsSortModalOpen(false)}
          />
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Inventory</Text>
              <Pressable
                onPress={() => setIsSortModalOpen(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={18} color={colors.fog} />
              </Pressable>
            </View>

            <View style={styles.sortOptionsList}>
              {SORT_OPTIONS.map((opt) => {
                const isSelected = selectedSort === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => {
                      setSelectedSort(opt.key);
                      setIsSortModalOpen(false);
                    }}
                    style={[
                      styles.sortOptionRow,
                      isSelected && styles.sortOptionRowActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        isSelected && styles.sortOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={16} color={colors.acidLime} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerTextCol: {
    gap: 2,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.paper,
    letterSpacing: -0.3,
  },
  itemCountText: {
    fontSize: 12,
    color: colors.fog,
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
  filterBar: {
    paddingBottom: spacing[10],
    gap: spacing[8],
  },
  quickStatusScroll: {
    paddingHorizontal: spacing[16],
    gap: spacing[8],
  },
  statusPill: {
    paddingHorizontal: spacing[12],
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusPillActive: {
    backgroundColor: colors.acidLime,
    borderColor: colors.acidLime,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mist,
  },
  statusPillTextActive: {
    color: colors.void,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[16],
    gap: spacing[10],
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing[12],
    paddingVertical: 6,
    backgroundColor: colors.carbon,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.graphite,
  },
  controlBtnActive: {
    borderColor: 'rgba(228, 242, 34, 0.4)',
    backgroundColor: 'rgba(228, 242, 34, 0.06)',
  },
  controlBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mist,
  },
  controlBtnTextActive: {
    color: colors.acidLime,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: spacing[16],
    paddingTop: spacing[6],
    paddingBottom: spacing[40],
    gap: spacing[16],
  },
  emptyContainer: {
    marginTop: spacing[40],
  },
  categorySection: {
    gap: spacing[8],
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  categoryHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.bone,
    letterSpacing: 0.6,
  },
  categoryCountBadge: {
    backgroundColor: colors.slate,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.badge,
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.fog,
  },
  categoryItemsContainer: {
    gap: 2,
    paddingTop: spacing[4],
  },
  paginationContainer: {
    paddingTop: spacing[12],
    paddingBottom: spacing[8],
    borderTopWidth: 1,
    borderTopColor: colors.graphite,
    gap: spacing[12],
    alignItems: 'center',
  },
  paginationSummaryText: {
    fontSize: 12,
    color: colors.fog,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
  },
  pageNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[12],
    paddingVertical: 6,
    borderRadius: radii.button,
    backgroundColor: colors.carbon,
    borderWidth: 1,
    borderColor: colors.graphite,
  },
  pageNavBtnDisabled: {
    opacity: 0.4,
  },
  pageNavBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mist,
  },
  pageNavBtnTextDisabled: {
    color: colors.ash,
  },
  pageIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.bone,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheetContainer: {
    backgroundColor: colors.obsidian,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: colors.graphite,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? spacing[32] : spacing[16],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: colors.graphite,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.paper,
  },
  modalCloseBtn: {
    padding: spacing[4],
  },
  modalScrollContent: {
    padding: spacing[16],
    gap: spacing[20],
  },
  modalSection: {
    gap: spacing[8],
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.fog,
    letterSpacing: 0.5,
  },
  modalOptionsGrid: {
    gap: spacing[6],
  },
  modalOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[12],
    borderRadius: radii.button,
    backgroundColor: colors.carbon,
    borderWidth: 1,
    borderColor: colors.graphite,
  },
  modalOptionCardActive: {
    borderColor: 'rgba(228, 242, 34, 0.4)',
    backgroundColor: 'rgba(228, 242, 34, 0.05)',
  },
  modalOptionText: {
    fontSize: 13,
    color: colors.mist,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: colors.paper,
    fontWeight: '600',
  },
  modalActionsRow: {
    flexDirection: 'row',
    padding: spacing[16],
    gap: spacing[12],
    borderTopWidth: 1,
    borderTopColor: colors.graphite,
  },
  modalActionBtn: {
    flex: 1,
  },
  sortOptionsList: {
    padding: spacing[16],
    gap: spacing[6],
  },
  sortOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[14],
    borderRadius: radii.button,
    backgroundColor: colors.carbon,
    borderWidth: 1,
    borderColor: colors.graphite,
  },
  sortOptionRowActive: {
    borderColor: 'rgba(228, 242, 34, 0.4)',
    backgroundColor: 'rgba(228, 242, 34, 0.05)',
  },
  sortOptionText: {
    fontSize: 13,
    color: colors.mist,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: colors.paper,
    fontWeight: '600',
  },
});
