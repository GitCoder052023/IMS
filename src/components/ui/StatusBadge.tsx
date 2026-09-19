import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme';
import { styles } from './StatusBadge.styles';

export type StatusBadgeType = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

interface StatusBadgeProps {
  status: StatusBadgeType;
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
          text: colors.pulseGreen,
          dot: colors.pulseGreen,
        };
      case 'LOW_STOCK':
        return {
          label: 'Low Stock',
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.2)',
          text: '#d97706',
          dot: colors.amber,
        };
      case 'OUT_OF_STOCK':
        return {
          label: 'Out of Stock',
          bg: 'rgba(235, 87, 87, 0.1)',
          border: 'rgba(235, 87, 87, 0.2)',
          text: colors.coralRed,
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
