import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../../theme/tokens';
import { InventoryItem } from '../../types/inventory';
import {
  getAvailableQuantity,
  getInventoryStatus,
} from '../../utils/inventoryCalculations';
import { Card } from '../ui/Card';
import { StatusBadge, DamagedBadge } from '../ui/StatusBadge';

interface InventoryItemCardProps {
  item: InventoryItem;
  onPress: () => void;
}

export function InventoryItemCard({ item, onPress }: InventoryItemCardProps) {
  const available = getAvailableQuantity(item);
  const status = getInventoryStatus(item);

  return (
    <Card onPress={onPress} style={styles.container}>
      {/* 1. Item Name & Navigation Indicator */}
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Feather name="chevron-right" size={16} color={colors.fog} />
      </View>

      {/* 2. Secondary Category Metadata */}
      <Text style={styles.categoryText} numberOfLines={1}>
        {item.category}
      </Text>

      {/* 3. Available vs Total Quantity */}
      <View style={styles.quantityRow}>
        <Text style={styles.availableQty}>
          {available} {item.unit} available
        </Text>
        <Text style={styles.dotSeparator}>·</Text>
        <Text style={styles.totalQty}>
          {item.quantity} total
        </Text>
      </View>

      {/* 4. Stock Status & Damaged Badges */}
      <View style={styles.badgesRow}>
        <StatusBadge status={status} />
        {item.damagedQuantity > 0 && (
          <DamagedBadge count={item.damagedQuantity} unit={item.unit} />
        )}
      </View>

      {/* 5. Minimum Threshold & Notes */}
      <View style={styles.bottomRow}>
        <Text style={styles.minThreshold}>
          Minimum: {item.minimumQuantity} {item.unit}
        </Text>
        {item.notes ? (
          <Text style={styles.notesText} numberOfLines={1}>
            {item.notes}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[8],
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[14],
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.paper,
    letterSpacing: -0.2,
    flex: 1,
    marginRight: spacing[8],
  },
  categoryText: {
    fontSize: 12,
    color: colors.fog,
    fontWeight: '400',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  availableQty: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.bone,
    letterSpacing: -0.1,
  },
  dotSeparator: {
    fontSize: 12,
    color: colors.ash,
  },
  totalQty: {
    fontSize: 13,
    color: colors.mist,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    flexWrap: 'wrap',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    marginTop: 2,
  },
  minThreshold: {
    fontSize: 11,
    color: colors.fog,
  },
  notesText: {
    fontSize: 11,
    color: colors.ash,
    fontStyle: 'italic',
    maxWidth: 160,
  },
});
