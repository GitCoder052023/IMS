import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { InventoryItem } from '../../inventory/types';
import { getAvailableQuantity, getInventoryStatus } from '../../inventory/logic/quantity';
import { Card, StatusBadge, DamagedBadge } from '../../../components/ui';
import { styles } from '../styles/NeedsAttentionCard.styles';

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
