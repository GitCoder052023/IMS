import { InventoryFilterStatus, InventoryItem } from '../types';
import { getAvailableQuantity, getInventoryStatus } from './quantity';

export const PAGE_SIZE = 10;

export type SortOption =
  | 'RECENT'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'AVAILABLE_ASC'
  | 'AVAILABLE_DESC'
  | 'DAMAGED_DESC';

export const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'RECENT', label: 'Recently Updated' },
  { key: 'NAME_ASC', label: 'Name A–Z' },
  { key: 'NAME_DESC', label: 'Name Z–A' },
  { key: 'AVAILABLE_ASC', label: 'Lowest Available Stock' },
  { key: 'AVAILABLE_DESC', label: 'Highest Available Stock' },
  { key: 'DAMAGED_DESC', label: 'Most Damaged' },
];

/**
 * Filters inventory items based on search query, category, and status.
 */
export function filterInventoryItems(
  items: InventoryItem[],
  searchQuery: string,
  selectedCategory: string,
  selectedStatus: InventoryFilterStatus
): InventoryItem[] {
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
}

/**
 * Sorts inventory items by selected criteria.
 */
export function sortInventoryItems(
  items: InventoryItem[],
  selectedSort: SortOption
): InventoryItem[] {
  const sorted = [...items];
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
}

export interface CategoryGroup {
  category: string;
  items: InventoryItem[];
}

/**
 * Groups inventory items by their category.
 */
export function groupItemsByCategory(items: InventoryItem[]): CategoryGroup[] {
  const groupMap = new Map<string, InventoryItem[]>();

  for (const item of items) {
    const list = groupMap.get(item.category) || [];
    list.push(item);
    groupMap.set(item.category, list);
  }

  return Array.from(groupMap.entries()).map(([category, groupItems]) => ({
    category,
    items: groupItems,
  }));
}
