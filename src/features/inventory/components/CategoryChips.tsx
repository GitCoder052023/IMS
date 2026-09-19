import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input } from '../../../components/ui';
import { DEFAULT_CATEGORIES } from '../constants';
import { styles } from '../styles/CategoryChips.styles';

interface CategoryChipsProps {
  category: string;
  customCategory: string;
  isCustomCategory: boolean;
  onSelectDefault: (category: string) => void;
  onSelectCustom: () => void;
  onChangeCustomText: (text: string) => void;
  error?: string;
}

export function CategoryChips({
  category,
  customCategory,
  isCustomCategory,
  onSelectDefault,
  onSelectCustom,
  onChangeCustomText,
  error,
}: CategoryChipsProps) {
  return (
    <View style={styles.fieldSection}>
      <Text style={styles.sectionLabel}>Category *</Text>
      <View style={styles.chipsContainer}>
        {DEFAULT_CATEGORIES.map((cat) => {
          const isSelected = !isCustomCategory && category === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => onSelectDefault(cat)}
              style={[styles.chip, isSelected && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextActive]}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={onSelectCustom}
          style={[styles.chip, isCustomCategory && styles.chipActive]}
        >
          <Text
            style={[
              styles.chipText,
              isCustomCategory && styles.chipTextActive,
            ]}
          >
            + Custom
          </Text>
        </Pressable>
      </View>

      {isCustomCategory && (
        <Input
          placeholder="Enter custom category name"
          value={customCategory}
          onChangeText={onChangeCustomText}
          containerStyle={styles.customInputContainer}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
