import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../../theme';
import { Card } from '../../../components/ui';
import { DashboardMetrics } from '../types';
import { styles } from '../styles/InventoryHealthCard.styles';

interface InventoryHealthCardProps {
  metrics: DashboardMetrics;
  availabilityPercentage: number;
}

export function InventoryHealthCard({
  metrics,
  availabilityPercentage,
}: InventoryHealthCardProps) {
  return (
    <Card style={styles.healthCard}>
      {/* 3 Core Metric Columns */}
      <View style={styles.healthStatsRow}>
        <View style={styles.healthStatCol}>
          <Text style={[styles.healthStatValue, { color: colors.pulseGreen }]}>
            {metrics.totalAvailable}
          </Text>
          <Text style={styles.healthStatLabel}>Available</Text>
        </View>

        <View style={styles.healthDivider} />

        <View style={styles.healthStatCol}>
          <Text
            style={[
              styles.healthStatValue,
              {
                color:
                  metrics.lowStockCount + metrics.outOfStockCount > 0
                    ? colors.amber
                    : colors.slateInk,
              },
            ]}
          >
            {metrics.lowStockCount + metrics.outOfStockCount}
          </Text>
          <Text style={styles.healthStatLabel}>Low Stock</Text>
        </View>

        <View style={styles.healthDivider} />

        <View style={styles.healthStatCol}>
          <Text
            style={[
              styles.healthStatValue,
              {
                color:
                  metrics.damagedCount > 0
                    ? colors.coralRed
                    : colors.slateInk,
              },
            ]}
          >
            {metrics.damagedCount}
          </Text>
          <Text style={styles.healthStatLabel}>Damaged</Text>
        </View>
      </View>

      {/* Availability Progress Indicator */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarWrapper}>
          <View
            style={[
              styles.progressBarAvailable,
              { width: `${availabilityPercentage}%` },
            ]}
          />
          {metrics.damagedCount > 0 && metrics.totalQuantity > 0 && (
            <View
              style={[
                styles.progressBarDamaged,
                {
                  width: `${Math.min(
                    100 - availabilityPercentage,
                    Math.round((metrics.damagedCount / metrics.totalQuantity) * 100)
                  )}%`,
                },
              ]}
            />
          )}
        </View>

        <View style={styles.progressLabelRow}>
          <Text style={styles.progressText}>
            {metrics.totalAvailable} of {metrics.totalQuantity} units currently available
          </Text>
          <Text style={styles.percentageText}>{availabilityPercentage}% ready</Text>
        </View>
      </View>
    </Card>
  );
}
