import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  useInventoryList,
  InventoryItemCard,
  FilterModal,
  SortModal,
} from '../../features/inventory';
import { colors } from '../../theme';
import { Button, EmptyState } from '../../components/ui';
import { styles } from '../../features/inventory/styles/InventoryScreen.styles';

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedSort,
    setSelectedSort,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItemsCount,
    categoryGroups,
    collapsedCategories,
    toggleCategory,
    isFilterModalOpen,
    setIsFilterModalOpen,
    isSortModalOpen,
    setIsSortModalOpen,
    availableCategories,
    handleApplyFilters,
    clearAllFilters,
    totalAvailableUnits,
    hasActiveFilters,
    filterBadgeCount,
    currentSortLabel,
    filteredItemsCount,
    goToPreviousPage,
    goToNextPage,
    navigateToAddItem,
    navigateToItemDetail,
  } = useInventoryList();

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
              : `Showing ${filteredItemsCount} of ${items.length} items`}
          </Text>
        </View>
        <Button
          title="Add Item"
          variant="primary"
          icon={<Feather name="plus" size={15} color={colors.pureWhite} />}
          onPress={navigateToAddItem}
        />
      </View>

      {/* 2. Search Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={colors.mutedGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment, category, notes..."
            placeholderTextColor={colors.mutedGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Feather name="x-circle" size={16} color={colors.mutedGray} />
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
            onPress={() => setIsFilterModalOpen(true)}
          >
            <Feather
              name="sliders"
              size={13}
              color={filterBadgeCount > 0 ? colors.shopViolet : colors.slateInk}
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
            <Feather name="bar-chart-2" size={13} color={colors.slateInk} />
            <Text style={styles.controlBtnText} numberOfLines={1}>
              {currentSortLabel}
            </Text>
            <Feather name="chevron-down" size={13} color={colors.mutedGray} />
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
            onAction={navigateToAddItem}
            style={styles.emptyContainer}
          />
        ) : filteredItemsCount === 0 ? (
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
                      color={colors.mutedGray}
                    />
                  </Pressable>

                  {/* Expanded Items */}
                  {!isCollapsed && (
                    <View style={styles.categoryItemsContainer}>
                      {group.items.map((item) => (
                        <InventoryItemCard
                          key={item.id}
                          item={item}
                          onPress={() => navigateToItemDetail(item.id)}
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
                  onPress={goToPreviousPage}
                  disabled={currentPage <= 1}
                  style={[
                    styles.pageNavBtn,
                    currentPage <= 1 && styles.pageNavBtnDisabled,
                  ]}
                >
                  <Feather
                    name="arrow-left"
                    size={14}
                    color={currentPage <= 1 ? colors.warmFog : colors.slateInk}
                  />
                  <Text
                    style={[
                      styles.pageNavBtnText,
                      currentPage <= 1 && styles.pageNavBtnTextDisabled,
                    ]}
                  >
                    Previous
                  </Text>
                </Pressable>

                <Text style={styles.pageIndicatorText}>
                  Page {currentPage} of {totalPages}
                </Text>

                <Pressable
                  onPress={goToNextPage}
                  disabled={currentPage >= totalPages}
                  style={[
                    styles.pageNavBtn,
                    currentPage >= totalPages && styles.pageNavBtnDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.pageNavBtnText,
                      currentPage >= totalPages && styles.pageNavBtnTextDisabled,
                    ]}
                  >
                    Next
                  </Text>
                  <Feather
                    name="arrow-right"
                    size={14}
                    color={currentPage >= totalPages ? colors.warmFog : colors.slateInk}
                  />
                </Pressable>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Filter Modal Sheet */}
      <FilterModal
        visible={isFilterModalOpen}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        availableCategories={availableCategories}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />

      {/* Sort Modal Sheet */}
      <SortModal
        visible={isSortModalOpen}
        selectedSort={selectedSort}
        onClose={() => setIsSortModalOpen(false)}
        onSelectSort={setSelectedSort}
      />
    </View>
  );
}
