import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';
import { InventoryStatus } from '../../types/inventory';

interface StatusBadgeProps {
  status: InventoryStatus;
  style?: StyleProp<ViewStyle>;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'IN_STOCK':
        return {
          label: 'In Stock',
          bg: 'rgba(39, 166, 68, 0.1)',
          border: 'rgba(39, 166, 68, 0.2)',
          text: '#27a644',
          dot: '#27a644',
        };
      case 'LOW_STOCK':
        return {
          label: 'Low Stock',
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.2)',
          text: '#d97706',
          dot: '#f59e0b',
        };
      case 'OUT_OF_STOCK':
        return {
          label: 'Out of Stock',
          bg: 'rgba(235, 87, 87, 0.1)',
          border: 'rgba(235, 87, 87, 0.2)',
          text: '#eb5757',
          dot: '#eb5757',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.badgeText, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
}

interface DamagedBadgeProps {
  count: number;
  unit?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Indicator pill showing damaged units, distinct from stock status.
 */
export function DamagedBadge({ count, unit, style }: DamagedBadgeProps) {
  if (count <= 0) return null;

  return (
    <View style={[styles.damagedBadge, style]}>
      <Text style={styles.damagedText}>
        {count} {unit ? `${unit} ` : ''}damaged
      </Text>
    </View>
  );
}

interface CategoryTagProps {
  category: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Visual pill for equipment category.
 */
export function CategoryTag({ category, style }: CategoryTagProps) {
  return (
    <View style={[styles.categoryTag, style]}>
      <Text style={styles.categoryText} numberOfLines={1}>
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  damagedBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(235, 87, 87, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.15)',
    alignSelf: 'flex-start',
  },
  damagedText: {
    color: '#eb5757',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  categoryTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(84, 51, 235, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(84, 51, 235, 0.15)',
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#5433eb',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
});
