import { InventoryItem } from '../../inventory/types';
import { Feather } from '@expo/vector-icons';

export interface DashboardMetrics {
  totalItems: number;
  totalQuantity: number;
  totalAvailable: number;
  lowStockCount: number;
  outOfStockCount: number;
  damagedCount: number;
  needsAttentionItems: InventoryItem[];
}

export interface CategoryBreakdown {
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  damagedQuantity: number;
  itemCount: number;
  percentageOfTotal: number;
}

export interface FormattedActivityItem {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}
