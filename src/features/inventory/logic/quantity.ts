import { InventoryItem, InventoryStatus } from '../types';

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
