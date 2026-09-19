import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import { validateItemInput } from '../../utils/inventoryCalculations';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_UNITS,
} from '../../constants/inventoryDefaults';
import { colors, radii, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function AddItemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useInventory();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [quantity, setQuantity] = useState('');
  const [minimumQuantity, setMinimumQuantity] = useState('');

  const [unit, setUnit] = useState('pieces');
  const [customUnit, setCustomUnit] = useState('');
  const [isCustomUnit, setIsCustomUnit] = useState(false);

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveCategory = isCustomCategory ? customCategory : category;
  const effectiveUnit = isCustomUnit ? customUnit : unit;

  const handleSubmit = async () => {
    const validation = validateItemInput({
      name,
      category: effectiveCategory,
      quantity,
      minimumQuantity,
      unit: effectiveUnit,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await addItem({
        name,
        category: effectiveCategory,
        quantity: Number(quantity),
        minimumQuantity: Number(minimumQuantity),
        unit: effectiveUnit,
        notes,
      });
      router.back();
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to create equipment item' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={styles.headerBtn}
        >
          <Feather name="x" size={20} color={colors.mist} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Equipment Item</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Name */}
        <Input
          label="Equipment Name *"
          placeholder="e.g. 5 kg Dumbbells, Cricket Balls, Yoga Mats"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          autoFocus
        />

        {/* Category Selection */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>Category *</Text>
          <View style={styles.chipsContainer}>
            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = !isCustomCategory && category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => {
                    setIsCustomCategory(false);
                    setCategory(cat);
                    if (errors.category)
                      setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
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
              onPress={() => {
                setIsCustomCategory(true);
              }}
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
              onChangeText={(text) => {
                setCustomCategory(text);
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              containerStyle={styles.customInputContainer}
            />
          )}
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        {/* Quantities Row */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Input
              label="Starting Quantity *"
              placeholder="0"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={(text) => {
                setQuantity(text.replace(/[^0-9]/g, ''));
                if (errors.quantity)
                  setErrors((prev) => ({ ...prev, quantity: undefined }));
              }}
              error={errors.quantity}
              helperText="Total physical units owned"
            />
          </View>
          <View style={styles.col}>
            <Input
              label="Minimum Quantity *"
              placeholder="0"
              keyboardType="number-pad"
              value={minimumQuantity}
              onChangeText={(text) => {
                setMinimumQuantity(text.replace(/[^0-9]/g, ''));
                if (errors.minimumQuantity)
                  setErrors((prev) => ({
                    ...prev,
                    minimumQuantity: undefined,
                  }));
              }}
              error={errors.minimumQuantity}
              helperText="Low stock alert threshold"
            />
          </View>
        </View>

        {/* Unit Selection */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>Unit of Measure *</Text>
          <View style={styles.chipsContainer}>
            {DEFAULT_UNITS.map((u) => {
              const isSelected = !isCustomUnit && unit === u;
              return (
                <Pressable
                  key={u}
                  onPress={() => {
                    setIsCustomUnit(false);
                    setUnit(u);
                    if (errors.unit)
                      setErrors((prev) => ({ ...prev, unit: undefined }));
                  }}
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
              onPress={() => {
                setIsCustomUnit(true);
              }}
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
              onChangeText={(text) => {
                setCustomUnit(text);
                if (errors.unit)
                  setErrors((prev) => ({ ...prev, unit: undefined }));
              }}
              containerStyle={styles.customInputContainer}
            />
          )}
          {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
        </View>

        {/* Optional Notes */}
        <Input
          label="Optional Notes"
          placeholder="e.g. Rack location, model, supplier notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />

        {errors.form && (
          <Text style={[styles.errorText, { marginBottom: 12 }]}>
            {errors.form}
          </Text>
        )}

        {/* Submit Button */}
        <Button
          title="Create Equipment Item"
          variant="primary"
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.graphite,
  },
  headerBtn: {
    padding: spacing[4],
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.paper,
    letterSpacing: -0.2,
  },
  scrollContent: {
    padding: spacing[16],
    paddingBottom: spacing[48],
  },
  fieldSection: {
    marginBottom: spacing[16],
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.bone,
    marginBottom: spacing[8],
    letterSpacing: -0.1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[8],
  },
  chip: {
    paddingHorizontal: spacing[12],
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipActive: {
    backgroundColor: colors.acidLime,
    borderColor: colors.acidLime,
  },
  chipText: {
    fontSize: 12,
    color: colors.mist,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.void,
    fontWeight: '600',
  },
  customInputContainer: {
    marginTop: spacing[8],
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing[12],
  },
  col: {
    flex: 1,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colors.coralRed,
    marginTop: 4,
  },
  submitBtn: {
    marginTop: spacing[8],
  },
});
