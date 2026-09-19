import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../../../components/ui';
import { InventoryHistoryEntry, InventoryItem } from '../../inventory/types';
import { formatActivityItem, formatActivityTimestamp } from '../logic/formatters';
import { styles } from '../styles/RecentActivityCard.styles';

interface RecentActivityCardProps {
  history: InventoryHistoryEntry[];
  items: InventoryItem[];
  onItemPress: (itemId: string) => void;
  onViewAllPress: () => void;
}

export function RecentActivityCard({
  history,
  items,
  onItemPress,
  onViewAllPress,
}: RecentActivityCardProps) {
  return (
    <Card style={styles.activityCard}>
      {history.length === 0 ? (
        <View style={styles.emptyActivityBox}>
          <Feather name="clock" size={20} color="#787574" />
          <Text style={styles.emptyActivityText}>
            No recent activity recorded yet.
          </Text>
        </View>
      ) : (
        <View style={styles.activityList}>
          {history.slice(0, 4).map((entry, idx) => {
            const formatted = formatActivityItem(
              entry.type,
              entry.quantity,
              entry.inventoryItemId,
              items
            );
            const isLast = idx === Math.min(history.length, 4) - 1;

            return (
              <Pressable
                key={entry.id}
                style={[styles.activityRow, !isLast && styles.activityRowDivider]}
                onPress={() => {
                  const exists = items.some((i) => i.id === entry.inventoryItemId);
                  if (exists) {
                    onItemPress(entry.inventoryItemId);
                  }
                }}
              >
                <View
                  style={[
                    styles.activityIconCircle,
                    { backgroundColor: `${formatted.color}15` },
                  ]}
                >
                  <Feather
                    name={formatted.icon}
                    size={13}
                    color={formatted.color}
                  />
                </View>

                <View style={styles.activityContentCol}>
                  <Text style={styles.activityTitleText} numberOfLines={1}>
                    {formatted.title}
                  </Text>
                  <View style={styles.activityMetaRow}>
                    <Text style={styles.activityTimestamp}>
                      {formatActivityTimestamp(entry.createdAt)}
                    </Text>
                    {entry.note ? (
                      <>
                        <Text style={styles.activityDot}>•</Text>
                        <Text style={styles.activityNote} numberOfLines={1}>
                          {entry.note}
                        </Text>
                      </>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            );
          })}

          {history.length > 4 && (
            <Pressable
              style={styles.viewAllHistoryRow}
              onPress={onViewAllPress}
            >
              <Text style={styles.viewAllHistoryText}>
                View full activity history
              </Text>
              <Feather name="chevron-right" size={14} color="#787574" />
            </Pressable>
          )}
        </View>
      )}
    </Card>
  );
}
