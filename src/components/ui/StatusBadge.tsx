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
          bg: 'rgba(39, 166, 68, 0.12)',
          border: 'rgba(39, 166, 68, 0.28)',
          text: '#3cd060',
          dot: colors.pulseGreen,
        };
      case 'LOW_STOCK':
        return {
          label: 'Low Stock',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.28)',
          text: '#fbbf24',
          dot: colors.amber,
        };
      case 'OUT_OF_STOCK':
        return {
          label: 'Out of Stock',
          bg: 'rgba(235, 87, 87, 0.12)',
          border: 'rgba(235, 87, 87, 0.28)',
          text: '#f87171',
          dot: colors.coralRed,
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
    paddingHorizontal: spacing[8],
    borderRadius: radii.badge,
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
    paddingHorizontal: spacing[8],
    borderRadius: radii.badge,
    backgroundColor: 'rgba(235, 87, 87, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.25)',
    alignSelf: 'flex-start',
  },
  damagedText: {
    color: colors.coralRed,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  categoryTag: {
    paddingVertical: 2,
    paddingHorizontal: spacing[8],
    borderRadius: radii.badge,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.22)',
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
});
