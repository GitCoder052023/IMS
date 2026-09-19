import { DashboardMetrics, InventoryItem, InventoryStatus } from '../types/inventory';

/**
 * Calculates available (usable) quantity.
 * availableQuantity = quantity - damagedQuantity
 * Invariant: availableQuantity >= 0
 */
export function getAvailableQuantity(item: Pick<InventoryItem, 'quantity' | 'damagedQuantity'>): number {
  const qty = Number(item.quantity) || 0;
  const damaged = Number(item.damagedQuantity) || 0;
  return Math.max(0, qty - damaged);
}

/**
 * Determines stock status based strictly on available quantity and minimum threshold.
 * - OUT_OF_STOCK if availableQuantity <= 0
 * - LOW_STOCK if availableQuantity <= minimumQuantity
 * - IN_STOCK if availableQuantity > minimumQuantity
 *
 * Damaged quantity is NOT a status; it is tracked independently.
 */
export function getInventoryStatus(
  item: Pick<InventoryItem, 'quantity' | 'damagedQuantity' | 'minimumQuantity'>
): InventoryStatus {
  const available = getAvailableQuantity(item);
  const min = Number(item.minimumQuantity) || 0;

  if (available <= 0) {
    return 'OUT_OF_STOCK';
  }
  if (available <= min) {
    return 'LOW_STOCK';
  }
  return 'IN_STOCK';
}

/**
 * Returns true if an item requires attention:
 * - Has damaged units (damagedQuantity > 0)
 * - Is running low on stock (availableQuantity <= minimumQuantity)
 * - Is completely out of stock (availableQuantity <= 0)
 */
export function isNeedsAttention(item: InventoryItem): boolean {
  const available = getAvailableQuantity(item);
  const min = Number(item.minimumQuantity) || 0;
  return item.damagedQuantity > 0 || available <= min;
}

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

export interface ItemFormValidation {
  isValid: boolean;
  errors: {
    name?: string;
    category?: string;
    quantity?: string;
    minimumQuantity?: string;
    unit?: string;
  };
}

/**
 * Validates inventory item creation or update inputs.
 */
export function validateItemInput(input: {
  name: string;
  category: string;
  quantity: number | string;
  minimumQuantity: number | string;
  unit: string;
}): ItemFormValidation {
  const errors: ItemFormValidation['errors'] = {};

  const trimmedName = String(input.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Item name is required';
  }

  const trimmedCategory = String(input.category || '').trim();
  if (!trimmedCategory) {
    errors.category = 'Category is required';
  }

  const trimmedUnit = String(input.unit || '').trim();
  if (!trimmedUnit) {
    errors.unit = 'Unit is required (e.g. pieces, pairs, sets)';
  }

  const qty = Number(input.quantity);
  if (isNaN(qty) || qty < 0) {
    errors.quantity = 'Total quantity must be 0 or greater';
  }

  const minQty = Number(input.minimumQuantity);
  if (isNaN(minQty) || minQty < 0) {
    errors.minimumQuantity = 'Minimum quantity must be 0 or greater';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Add Stock adjustment.
 */
export function validateAddStock(amount: number): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  return null;
}

/**
 * Validates Remove Stock adjustment.
 * Cannot remove more than available functional units.
 */
export function validateRemoveStock(
  currentQuantity: number,
  currentDamaged: number,
  amount: number
): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  const available = Math.max(0, currentQuantity - currentDamaged);
  if (amount > available) {
    return `Cannot remove ${amount}. Only ${available} units are currently available (excluding ${currentDamaged} damaged).`;
  }
  return null;
}

/**
 * Validates Record Damage adjustment.
 * Cannot mark more units as damaged than currently available.
 */
export function validateRecordDamage(
  currentAvailable: number,
  amount: number
): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  if (amount > currentAvailable) {
    return `Cannot mark ${amount} as damaged. Only ${currentAvailable} units are available.`;
  }
  return null;
}

/**
 * Validates Repair Damaged adjustment.
 * Cannot repair more units than are currently marked as damaged.
 */
export function validateRepairDamage(
  currentDamaged: number,
  amount: number
): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  if (amount > currentDamaged) {
    return `Cannot repair ${amount}. Only ${currentDamaged} units are currently damaged.`;
  }
  return null;
}

export interface CategoryBreakdown {
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  damagedQuantity: number;
  itemCount: number;
  percentageOfTotal: number;
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

/**
 * Formats activity timestamps into friendly relative strings (e.g. "Today · 09:18 AM").
 */
export function formatActivityTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isToday) {
      return `Today · ${timeStr}`;
    }
    if (isYesterday) {
      return `Yesterday · ${timeStr}`;
    }

    const dateStr = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    return `${dateStr} · ${timeStr}`;
  } catch {
    return isoString;
  }
}

/**
 * Formats current date for the dashboard header (e.g. "Saturday, 19 September").
 */
export function formatDashboardDate(date: Date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

