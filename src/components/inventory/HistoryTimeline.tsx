import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../../theme/tokens';
import { InventoryHistoryEntry, HistoryAdjustmentType } from '../../types/inventory';

interface HistoryTimelineProps {
  history: InventoryHistoryEntry[];
  unit: string;
}

export function HistoryTimeline({ history, unit }: HistoryTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No activity history recorded yet.</Text>
      </View>
    );
  }

  const getEntryConfig = (type: HistoryAdjustmentType, quantity: number) => {
    switch (type) {
      case 'INITIAL':
        return {
          label: 'Initial Intake',
          sign: '+',
          color: colors.bone,
          icon: 'box' as const,
        };
      case 'STOCK_ADDED':
        return {
          label: 'Stock Added',
          sign: '+',
          color: colors.pulseGreen,
          icon: 'plus' as const,
        };
      case 'STOCK_REMOVED':
        return {
          label: 'Stock Removed',
          sign: '-',
          color: colors.coralRed,
          icon: 'minus' as const,
        };
      case 'DAMAGED_RECORDED':
        return {
          label: 'Marked Damaged',
          sign: '+',
          color: colors.coralRed,
          icon: 'alert-triangle' as const,
        };
      case 'DAMAGED_RESOLVED':
        return {
          label: 'Repaired / Restored',
          sign: '+',
          color: colors.pulseGreen,
          icon: 'check-circle' as const,
        };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <View style={styles.container}>
      {history.map((entry, index) => {
        const config = getEntryConfig(entry.type, entry.quantity);
        const isLast = index === history.length - 1;

        return (
          <View key={entry.id} style={styles.row}>
            {/* Timeline line and icon dot */}
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.iconNode,
                  { backgroundColor: `${config.color}20`, borderColor: config.color },
                ]}
              >
                <Feather name={config.icon} size={11} color={config.color} />
              </View>
              {!isLast && <View style={styles.connector} />}
            </View>

            {/* Content */}
            <View style={[styles.contentCol, !isLast && styles.contentColBottom]}>
              <View style={styles.titleRow}>
                <Text style={styles.actionTitle}>{config.label}</Text>
                <Text style={[styles.qtyBadge, { color: config.color }]}>
                  {config.sign}
                  {entry.quantity} {unit}
                </Text>
              </View>

              {entry.note ? (
                <Text style={styles.noteText}>"{entry.note}"</Text>
              ) : null}

              <Text style={styles.timestamp}>{formatDate(entry.createdAt)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[8],
  },
  emptyContainer: {
    paddingVertical: spacing[20],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.fog,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
    marginRight: spacing[12],
  },
  iconNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  connector: {
    flex: 1,
    width: 1,
    backgroundColor: colors.graphite,
    marginVertical: 2,
  },
  contentCol: {
    flex: 1,
    gap: 3,
  },
  contentColBottom: {
    paddingBottom: spacing[16],
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.bone,
    letterSpacing: -0.1,
  },
  qtyBadge: {
    fontSize: 13,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: colors.mist,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: colors.ash,
  },
});
