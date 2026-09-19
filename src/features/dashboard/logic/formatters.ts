import { colors } from '../../../theme';
import { HistoryAdjustmentType, InventoryItem } from '../../inventory/types';
import { FormattedActivityItem } from '../types';

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

/**
 * Formats activity history item for dashboard display.
 */
export function formatActivityItem(
  type: HistoryAdjustmentType,
  quantity: number,
  itemId: string,
  items: InventoryItem[]
): FormattedActivityItem {
  const matchedItem = items.find((i) => i.id === itemId);
  const itemName = matchedItem ? matchedItem.name : 'Equipment Item';
  const unit = matchedItem ? ` ${matchedItem.unit}` : '';

  switch (type) {
    case 'INITIAL':
      return {
        title: `+ ${quantity}${unit} ${itemName} added (intake)`,
        icon: 'box' as const,
        color: colors.inkBlack,
      };
    case 'STOCK_ADDED':
      return {
        title: `+ ${quantity}${unit} ${itemName} added`,
        icon: 'plus-circle' as const,
        color: colors.pulseGreen,
      };
    case 'STOCK_REMOVED':
      return {
        title: `- ${quantity}${unit} ${itemName} removed`,
        icon: 'minus-circle' as const,
        color: colors.coralRed,
      };
    case 'DAMAGED_RECORDED':
      return {
        title: `${quantity}${unit} ${itemName} marked damaged`,
        icon: 'alert-triangle' as const,
        color: colors.coralRed,
      };
    case 'DAMAGED_RESOLVED':
      return {
        title: `${quantity}${unit} ${itemName} repaired & restored`,
        icon: 'check-circle' as const,
        color: colors.pulseGreen,
      };
  }
}
