import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_UNITS,
} from '../../constants/inventoryDefaults';
import { colors, radii, spacing } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function EditItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getItem, updateItem } = useInventory();

  const item = getItem(String(id));

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [minimumQuantity, setMinimumQuantity] = useState('');

  const [unit, setUnit] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [isCustomUnit, setIsCustomUnit] = useState(false);

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setMinimumQuantity(String(item.minimumQuantity));
      setNotes(item.notes || '');

      // Check if item's category is one of the defaults
      if (DEFAULT_CATEGORIES.includes(item.category as any)) {
        setCategory(item.category);
        setIsCustomCategory(false);
      } else {
        setCategory('');
        setCustomCategory(item.category);
        setIsCustomCategory(true);
      }

      // Check if item's unit is one of the defaults
      if (DEFAULT_UNITS.includes(item.unit as any)) {
        setUnit(item.unit);
        setIsCustomUnit(false);
      } else {
        setUnit('');
        setCustomUnit(item.unit);
        setIsCustomUnit(true);
      }
    }
  }, [item]);

  if (!item) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerBtn}>
            <Feather name="arrow-left" size={20} color={colors.slateInk} />
          </Pressable>
          <Text style={styles.headerTitle}>Item Not Found</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Equipment item does not exist.</Text>
        </View>
      </View>
    );
  }

  const effectiveCategory = isCustomCategory ? customCategory : category;
  const effectiveUnit = isCustomUnit ? customUnit : unit;

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Item name is required';
    if (!effectiveCategory.trim()) errs.category = 'Category is required';
    if (!effectiveUnit.trim()) errs.unit = 'Unit is required';

    const minQty = Number(minimumQuantity);
    if (isNaN(minQty) || minQty < 0) {
      errs.minimumQuantity = 'Minimum quantity must be 0 or greater';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsSubmitting(true);
      await updateItem(item.id, {
        name,
        category: effectiveCategory,
        minimumQuantity: minQty,
        unit: effectiveUnit,
        notes,
      });
      router.back();
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to update equipment item' });
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
          <Feather name="x" size={20} color={colors.slateInk} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Equipment Item</Text>
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
          placeholder="e.g. 5 kg Dumbbells, Cricket Balls"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
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

        {/* Minimum Quantity */}
        <Input
          label="Minimum Desired Quantity *"
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
          helperText="Triggers low stock status when available stock falls to or below this threshold"
        />

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

        {/* Save Button */}
        <Button
          title="Save Changes"
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
    backgroundColor: colors.canvasMist,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.faintBorder,
    backgroundColor: colors.pureWhite,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 14,
    color: colors.mutedGray,
  },
  fieldSection: {
    marginBottom: spacing[16],
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.inkBlack,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.pureWhite,
    borderWidth: 1,
    borderColor: colors.faintBorder,
  },
  chipActive: {
    backgroundColor: colors.shopViolet,
    borderColor: colors.shopViolet,
  },
  chipText: {
    fontSize: 12,
    color: colors.slateInk,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.pureWhite,
    fontWeight: '600',
  },
  customInputContainer: {
    marginTop: 8,
    marginBottom: 0,
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
    marginTop: 8,
  },
});
