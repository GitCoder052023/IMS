import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  useItemForm,
  CategoryChips,
  UnitChips,
} from '../../features/inventory';
import { colors } from '../../theme';
import { Button, Input } from '../../components/ui';
import { styles } from '../../features/inventory/styles/ItemFormScreen.styles';

export default function AddItemScreen() {
  const insets = useSafeAreaInsets();
  const {
    name,
    category,
    customCategory,
    isCustomCategory,
    quantity,
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
    handleQuantityChange,
    handleMinQuantityChange,
    handleUnitSelect,
    handleCustomUnitSelect,
    handleCustomUnitChange,
    handleNotesChange,
    handleCreate,
    navigateBack,
  } = useItemForm();

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
          onChangeText={handleNameChange}
          error={errors.name}
          autoFocus
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

        {/* Quantities Row */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Input
              label="Starting Quantity *"
              placeholder="0"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={handleQuantityChange}
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
              onChangeText={handleMinQuantityChange}
              error={errors.minimumQuantity}
              helperText="Low stock alert threshold"
            />
          </View>
        </View>

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

        {/* Submit Button */}
        <Button
          title="Create Equipment Item"
          variant="primary"
          onPress={handleCreate}
          loading={isSubmitting}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
