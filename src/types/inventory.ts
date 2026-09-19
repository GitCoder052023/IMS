export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  /** Total physical quantity owned */
  quantity: number;
  /** Quantity currently damaged / unusable (0 <= damagedQuantity <= quantity) */
  damagedQuantity: number;
  /** Minimum desired quantity threshold for low stock alert */
  minimumQuantity: number;
  /** Unit of measurement (e.g. pieces, pairs, sets, boxes, kg, balls, mats) */
  unit: string;
  /** Optional user notes */
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type HistoryAdjustmentType =
  | 'INITIAL'
  | 'STOCK_ADDED'
  | 'STOCK_REMOVED'
  | 'DAMAGED_RECORDED'
  | 'DAMAGED_RESOLVED';

export interface InventoryHistoryEntry {
  id: string;
  inventoryItemId: string;
  type: HistoryAdjustmentType;
  /** Positive delta quantity of this adjustment */
  quantity: number;
  /** Optional reason or description for this action */
  note?: string;
  createdAt: string;
}

export type InventoryFilterStatus = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DAMAGED';

export interface DashboardMetrics {
  totalItems: number;
  totalQuantity: number;
  totalAvailable: number;
  lowStockCount: number;
  outOfStockCount: number;
  damagedCount: number;
  needsAttentionItems: InventoryItem[];
}
