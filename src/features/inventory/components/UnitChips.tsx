import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input } from '../../../components/ui';
import { DEFAULT_UNITS } from '../constants';
import { styles } from '../styles/UnitChips.styles';

interface UnitChipsProps {
  unit: string;
  customUnit: string;
  isCustomUnit: boolean;
  onSelectDefault: (unit: string) => void;
  onSelectCustom: () => void;
  onChangeCustomText: (text: string) => void;
  error?: string;
}

export function UnitChips({
  unit,
  customUnit,
  isCustomUnit,
  onSelectDefault,
  onSelectCustom,
  onChangeCustomText,
  error,
}: UnitChipsProps) {
  return (
    <View style={styles.fieldSection}>
      <Text style={styles.sectionLabel}>Unit of Measure *</Text>
      <View style={styles.chipsContainer}>
        {DEFAULT_UNITS.map((u) => {
          const isSelected = !isCustomUnit && unit === u;
          return (
            <Pressable
              key={u}
              onPress={() => onSelectDefault(u)}
              style={[styles.chip, isSelected && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextActive]}
              >
                {u}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={onSelectCustom}
          style={[styles.chip, isCustomUnit && styles.chipActive]}
        >
          <Text
            style={[
              styles.chipText,
              isCustomUnit && styles.chipTextActive,
            ]}
          >
            + Custom
          </Text>
        </Pressable>
      </View>

      {isCustomUnit && (
        <Input
          placeholder="e.g. pairs, tubes, canisters"
          value={customUnit}
          onChangeText={onChangeCustomText}
          containerStyle={styles.customInputContainer}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
