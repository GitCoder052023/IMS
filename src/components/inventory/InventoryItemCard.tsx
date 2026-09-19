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
import { StatusBadge, DamagedBadge, CategoryTag } from '../ui/StatusBadge';

interface InventoryItemCardProps {
  item: InventoryItem;
  onPress: () => void;
}

export function InventoryItemCard({ item, onPress }: InventoryItemCardProps) {
  const available = getAvailableQuantity(item);
  const status = getInventoryStatus(item);

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <CategoryTag category={item.category} />
        </View>
        <Feather name="chevron-right" size={18} color={colors.fog} />
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.qtyContainer}>
          <Text style={styles.qtyNumber}>{available}</Text>
          <Text style={styles.qtyUnit}>
            {item.unit} available
          </Text>
          {item.damagedQuantity > 0 && (
            <Text style={styles.totalOwned}>
              ({item.quantity} total)
            </Text>
          )}
        </View>

        <View style={styles.badgeContainer}>
          <StatusBadge status={status} />
          {item.damagedQuantity > 0 && (
            <DamagedBadge count={item.damagedQuantity} />
          )}
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.minThreshold}>
          Desired min: {item.minimumQuantity} {item.unit}
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
    marginBottom: spacing[12],
    gap: spacing[12],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    gap: spacing[6],
    marginRight: spacing[8],
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.paper,
    letterSpacing: -0.2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  qtyNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.paper,
    letterSpacing: -0.3,
  },
  qtyUnit: {
    fontSize: 13,
    color: colors.bone,
    fontWeight: '400',
  },
  totalOwned: {
    fontSize: 12,
    color: colors.fog,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[8],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  minThreshold: {
    fontSize: 12,
    color: colors.fog,
    letterSpacing: -0.1,
  },
  notesText: {
    fontSize: 12,
    color: colors.ash,
    maxWidth: 160,
    fontStyle: 'italic',
  },
});
