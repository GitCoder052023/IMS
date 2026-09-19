import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../../../components/ui';
import { CategoryBreakdown } from '../types';
import { styles } from '../styles/CategoryBreakdownCard.styles';

interface CategoryBreakdownCardProps {
  categoryBreakdown: CategoryBreakdown[];
  maxCategoryUnits: number;
}

export function CategoryBreakdownCard({
  categoryBreakdown,
  maxCategoryUnits,
}: CategoryBreakdownCardProps) {
  if (categoryBreakdown.length === 0) return null;

  return (
    <Card style={styles.categoryCard}>
      <View style={styles.categoryList}>
        {categoryBreakdown.map((cat, idx) => {
          const isLast = idx === categoryBreakdown.length - 1;
          const barWidthPercent = Math.max(
            8,
            Math.round((cat.totalQuantity / maxCategoryUnits) * 100)
          );

          return (
            <View
              key={cat.category}
              style={[
                styles.categoryRowItem,
                !isLast && styles.categoryRowDivider,
              ]}
            >
              <View style={styles.categoryHeaderRow}>
                <Text style={styles.categoryNameText}>{cat.category}</Text>
                <Text style={styles.categoryUnitsText}>
                  {cat.totalQuantity} {cat.totalQuantity === 1 ? 'unit' : 'units'}
                </Text>
              </View>

              {/* Proportion Bar */}
              <View style={styles.categoryBarContainer}>
                <View
                  style={[
                    styles.categoryBarFill,
                    { width: `${barWidthPercent}%` },
                  ]}
                />
              </View>

              <View style={styles.categoryFooterRow}>
                <Text style={styles.categoryFooterText}>
                  {cat.itemCount} {cat.itemCount === 1 ? 'item type' : 'item types'}
                </Text>
                <Text style={styles.categoryFooterText}>
                  {cat.availableQuantity} available
                  {cat.damagedQuantity > 0 ? ` · ${cat.damagedQuantity} damaged` : ''}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
