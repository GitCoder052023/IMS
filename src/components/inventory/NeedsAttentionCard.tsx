import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/tokens';
import { InventoryItem } from '../../types/inventory';
import {
  getAvailableQuantity,
  getInventoryStatus,
} from '../../utils/inventoryCalculations';
import { Card } from '../ui/Card';
import { StatusBadge, DamagedBadge } from '../ui/StatusBadge';

interface NeedsAttentionCardProps {
  item: InventoryItem;
  onPress: () => void;
}

export function NeedsAttentionCard({ item, onPress }: NeedsAttentionCardProps) {
  const available = getAvailableQuantity(item);
  const status = getInventoryStatus(item);

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.contentRow}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.available}>
              {available} {item.unit} available
            </Text>
            <Text style={styles.divider}>•</Text>
            <Text style={styles.min}>
              Min: {item.minimumQuantity} {item.unit}
            </Text>
          </View>
        </View>

        <View style={styles.badges}>
          <StatusBadge status={status} />
          {item.damagedQuantity > 0 && (
            <DamagedBadge count={item.damagedQuantity} />
          )}
        </View>

        <Feather name="chevron-right" size={16} color={colors.mutedGray} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  available: {
    fontSize: 12,
    color: '#332f2d',
  },
  divider: {
    fontSize: 12,
    color: colors.coolStone,
  },
  min: {
    fontSize: 12,
    color: colors.mutedGray,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
