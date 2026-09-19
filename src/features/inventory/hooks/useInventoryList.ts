import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useInventory } from '../state/useInventory';
import { InventoryFilterStatus } from '../types';
import {
  SortOption,
  SORT_OPTIONS,
  PAGE_SIZE,
  filterInventoryItems,
  sortInventoryItems,
  groupItemsByCategory,
} from '../logic/filtering';
import { getAvailableQuantity } from '../logic/quantity';

export function useInventoryList() {
  const router = useRouter();
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

  // Dynamically extract all unique categories present in actual inventory
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['ALL', ...cats.sort()];
  }, [items]);

  // Reset pagination whenever search query, filters, or sort order change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedSort]);

  const handleApplyFilters = (category: string, status: InventoryFilterStatus) => {
    setSelectedCategory(category);
    setSelectedStatus(status);
    setIsFilterModalOpen(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedSort('RECENT');
    setIsFilterModalOpen(false);
  };

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

  // 1. Filter items based on search query, category, and status
  const filteredItems = useMemo(() => {
    return filterInventoryItems(items, searchQuery, selectedCategory, selectedStatus);
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  // 2. Sort filtered items
  const sortedFilteredItems = useMemo(() => {
    return sortInventoryItems(filteredItems, selectedSort);
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
    return groupItemsByCategory(paginatedItems);
  }, [paginatedItems]);

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

  const goToPreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const navigateToAddItem = () => router.push('/item/new');
  const navigateToItemDetail = (id: string) => router.push(`/item/${id}`);

  return {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedSort,
    setSelectedSort,
    currentPage: safePage,
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
    filteredItemsCount: filteredItems.length,
    goToPreviousPage,
    goToNextPage,
    navigateToAddItem,
    navigateToItemDetail,
  };
}
