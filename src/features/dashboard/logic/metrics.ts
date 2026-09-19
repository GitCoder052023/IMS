import { InventoryItem, InventoryStatus } from '../../inventory/types';
import { getAvailableQuantity, getInventoryStatus, isNeedsAttention } from '../../inventory/logic/quantity';
import { CategoryBreakdown, DashboardMetrics } from '../types';

/**
 * Aggregates high-level inventory metrics for the dashboard.
 */
export function calculateDashboardMetrics(items: InventoryItem[]): DashboardMetrics {
  let totalQuantity = 0;
  let totalAvailable = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let damagedCount = 0;

  const attentionItems: InventoryItem[] = [];

  for (const item of items) {
    const available = getAvailableQuantity(item);
    const status = getInventoryStatus(item);

    totalQuantity += item.quantity;
    totalAvailable += available;
    damagedCount += item.damagedQuantity;

    if (status === 'OUT_OF_STOCK') {
      outOfStockCount += 1;
    } else if (status === 'LOW_STOCK') {
      lowStockCount += 1;
    }

    if (isNeedsAttention(item)) {
      attentionItems.push(item);
    }
  }

  // Sort attention items: OUT_OF_STOCK first, then LOW_STOCK, then others
  attentionItems.sort((a, b) => {
    const statusOrder: Record<InventoryStatus, number> = {
      OUT_OF_STOCK: 0,
      LOW_STOCK: 1,
      IN_STOCK: 2,
    };
    const orderA = statusOrder[getInventoryStatus(a)];
    const orderB = statusOrder[getInventoryStatus(b)];
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return b.damagedQuantity - a.damagedQuantity;
  });

  return {
    totalItems: items.length,
    totalQuantity,
    totalAvailable,
    lowStockCount,
    outOfStockCount,
    damagedCount,
    needsAttentionItems: attentionItems,
  };
}

/**
 * Calculates stock breakdown by category from actual inventory data.
 */
export function calculateCategoryBreakdown(items: InventoryItem[]): CategoryBreakdown[] {
  const categoryMap = new Map<
    string,
    { total: number; available: number; damaged: number; count: number }
  >();
  let overallTotal = 0;

  for (const item of items) {
    const available = getAvailableQuantity(item);
    const existing = categoryMap.get(item.category) || {
      total: 0,
      available: 0,
      damaged: 0,
      count: 0,
    };
    categoryMap.set(item.category, {
      total: existing.total + item.quantity,
      available: existing.available + available,
      damaged: existing.damaged + item.damagedQuantity,
      count: existing.count + 1,
    });
    overallTotal += item.quantity;
  }

  const result: CategoryBreakdown[] = [];
  for (const [category, data] of categoryMap.entries()) {
    result.push({
      category,
      totalQuantity: data.total,
      availableQuantity: data.available,
      damagedQuantity: data.damaged,
      itemCount: data.count,
      percentageOfTotal: overallTotal > 0 ? Math.round((data.total / overallTotal) * 100) : 0,
    });
  }

  return result.sort(
    (a, b) => b.totalQuantity - a.totalQuantity || b.itemCount - a.itemCount
  );
}
