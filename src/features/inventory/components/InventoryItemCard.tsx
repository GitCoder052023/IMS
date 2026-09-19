import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { InventoryItem } from '../types';
import { getAvailableQuantity, getInventoryStatus } from '../logic/quantity';
import { Card, StatusBadge, DamagedBadge } from '../../../components/ui';
import { styles } from '../styles/InventoryItemCard.styles';

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
        <Feather name="chevron-right" size={16} color={colors.mutedGray} />
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
