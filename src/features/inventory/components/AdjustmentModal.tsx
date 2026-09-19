import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { Button, Input } from '../../../components/ui';
import { AdjustmentMode } from '../logic/adjustmentConfig';
import { useAdjustmentForm } from '../hooks/useAdjustmentForm';
import { styles } from '../styles/AdjustmentModal.styles';

interface AdjustmentModalProps {
  visible: boolean;
  mode: AdjustmentMode | null;
  itemName: string;
  unit: string;
  currentQuantity: number;
  currentDamaged: number;
  currentAvailable: number;
  onClose: () => void;
  onSubmit: (amount: number, note?: string) => Promise<void>;
}

export function AdjustmentModal({
  visible,
  mode,
  itemName,
  unit,
  currentQuantity,
  currentDamaged,
  currentAvailable,
  onClose,
  onSubmit,
}: AdjustmentModalProps) {
  const {
    amountStr,
    note,
    error,
    isSubmitting,
    config,
    handleAmountChange,
    setNote,
    handleConfirm,
  } = useAdjustmentForm({
    visible,
    mode,
    unit,
    currentQuantity,
    currentDamaged,
    currentAvailable,
    onClose,
    onSubmit,
  });

  if (!mode || !config) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        <Pressable style={styles.scrim} onPress={onClose} />

        <View style={styles.dialogContainer}>
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.dialogContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Feather
                  name={config.icon}
                  size={20}
                  color={config.iconColor}
                />
                <Text style={styles.title}>{config.title}</Text>
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                style={styles.closeButton}
                accessibilityLabel="Close"
              >
                <Feather name="x" size={18} color={colors.mutedGray} />
              </Pressable>
            </View>

            <Text style={styles.itemName} numberOfLines={1}>
              {itemName}
            </Text>
            <Text style={styles.subtitle}>{config.subtitle}</Text>

            {/* Inputs */}
            <Input
              label={`Quantity (${unit})`}
              value={amountStr}
              onChangeText={handleAmountChange}
              placeholder="e.g. 2"
              keyboardType="number-pad"
              autoFocus
              error={error || undefined}
            />

            <Input
              label="Optional Note / Reason"
              value={note}
              onChangeText={setNote}
              placeholder={config.placeholderNote}
              multiline
              numberOfLines={2}
              style={styles.noteInput}
            />

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={onClose}
                style={styles.actionBtn}
                disabled={isSubmitting}
              />
              <Button
                title={config.actionLabel}
                variant={config.buttonVariant}
                onPress={handleConfirm}
                loading={isSubmitting}
                style={styles.actionBtn}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
