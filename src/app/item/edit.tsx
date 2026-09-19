import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  useInventory,
  useItemForm,
  CategoryChips,
  UnitChips,
} from '../../features/inventory';
import { colors } from '../../theme';
import { Button, Input } from '../../components/ui';
import { styles } from '../../features/inventory/styles/ItemFormScreen.styles';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getItem } = useInventory();

  const item = id ? getItem(String(id)) : undefined;

  const {
    name,
    category,
    customCategory,
    isCustomCategory,
    minimumQuantity,
    unit,
    customUnit,
    isCustomUnit,
    notes,
    errors,
    isSubmitting,
    handleNameChange,
    handleCategorySelect,
    handleCustomCategorySelect,
    handleCustomCategoryChange,
    handleMinQuantityChange,
    handleUnitSelect,
    handleCustomUnitSelect,
    handleCustomUnitChange,
    handleNotesChange,
    handleUpdate,
    navigateBack,
  } = useItemForm({ initialItem: item });

  if (!item) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={navigateBack} style={styles.headerBtn}>
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={navigateBack}
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
          onChangeText={handleNameChange}
          error={errors.name}
        />

        {/* Category Selection */}
        <CategoryChips
          category={category}
          customCategory={customCategory}
          isCustomCategory={isCustomCategory}
          onSelectDefault={handleCategorySelect}
          onSelectCustom={handleCustomCategorySelect}
          onChangeCustomText={handleCustomCategoryChange}
          error={errors.category}
        />

        {/* Minimum Quantity */}
        <Input
          label="Minimum Desired Quantity *"
          placeholder="0"
          keyboardType="number-pad"
          value={minimumQuantity}
          onChangeText={handleMinQuantityChange}
          error={errors.minimumQuantity}
          helperText="Triggers low stock status when available stock falls to or below this threshold"
        />

        {/* Unit Selection */}
        <UnitChips
          unit={unit}
          customUnit={customUnit}
          isCustomUnit={isCustomUnit}
          onSelectDefault={handleUnitSelect}
          onSelectCustom={handleCustomUnitSelect}
          onChangeCustomText={handleCustomUnitChange}
          error={errors.unit}
        />

        {/* Optional Notes */}
        <Input
          label="Optional Notes"
          placeholder="e.g. Rack location, model, supplier notes"
          value={notes}
          onChangeText={handleNotesChange}
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
          onPress={handleUpdate}
          loading={isSubmitting}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
