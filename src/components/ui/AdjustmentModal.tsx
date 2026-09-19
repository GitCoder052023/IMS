import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../../theme/tokens';
import { Button } from './Button';
import { Input } from './Input';

export type AdjustmentMode =
  | 'ADD_STOCK'
  | 'REMOVE_STOCK'
  | 'RECORD_DAMAGE'
  | 'REPAIR_DAMAGED';

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
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset inputs when modal opens or mode changes
  useEffect(() => {
    if (visible) {
      setAmountStr('');
      setNote('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [visible, mode]);

  if (!mode) return null;

  const getConfig = () => {
    switch (mode) {
      case 'ADD_STOCK':
        return {
          title: 'Add Stock',
          subtitle: `Adds new items to total inventory. Currently ${currentQuantity} ${unit} total.`,
          actionLabel: 'Add Stock',
          buttonVariant: 'primary' as const,
          icon: 'plus-circle' as const,
          placeholderNote: 'e.g. New purchase, seasonal intake',
        };
      case 'REMOVE_STOCK':
        return {
          title: 'Remove Stock',
          subtitle: `Permanently removes items from inventory. Max available: ${currentAvailable} ${unit}.`,
          actionLabel: 'Remove Stock',
          buttonVariant: 'danger' as const,
          icon: 'minus-circle' as const,
          placeholderNote: 'e.g. Disposed, sold, lost during practice',
        };
      case 'RECORD_DAMAGE':
        return {
          title: 'Record Damage',
          subtitle: `Marks equipment as damaged. Total count stays ${currentQuantity}; available drops. Max: ${currentAvailable} ${unit}.`,
          actionLabel: 'Record Damage',
          buttonVariant: 'danger' as const,
          icon: 'alert-triangle' as const,
          placeholderNote: 'e.g. Cracked shaft, torn seam, broken strap',
        };
      case 'REPAIR_DAMAGED':
        return {
          title: 'Repair / Restore',
          subtitle: `Restores repaired equipment to active available stock. Currently ${currentDamaged} ${unit} damaged.`,
          actionLabel: 'Restore to Stock',
          buttonVariant: 'primary' as const,
          icon: 'check-circle' as const,
          placeholderNote: 'e.g. Restrung, re-inflated, stitched',
        };
    }
  };

  const config = getConfig();

  const handleConfirm = async () => {
    const amount = Number(amountStr);

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a quantity greater than 0');
      return;
    }

    if (!Number.isInteger(amount)) {
      setError('Quantity must be a whole number');
      return;
    }

    if (mode === 'REMOVE_STOCK' && amount > currentAvailable) {
      setError(
        `Cannot remove ${amount} ${unit}. Only ${currentAvailable} ${unit} are available.`
      );
      return;
    }

    if (mode === 'RECORD_DAMAGE' && amount > currentAvailable) {
      setError(
        `Cannot mark ${amount} ${unit} as damaged. Only ${currentAvailable} ${unit} are available.`
      );
      return;
    }

    if (mode === 'REPAIR_DAMAGED' && amount > currentDamaged) {
      setError(
        `Cannot repair ${amount} ${unit}. Only ${currentDamaged} ${unit} are marked damaged.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(amount, note);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  color={
                    config.buttonVariant === 'danger'
                      ? '#eb5757'
                      : '#5433eb'
                  }
                />
                <Text style={styles.title}>{config.title}</Text>
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                style={styles.closeButton}
                accessibilityLabel="Close"
              >
                <Feather name="x" size={18} color="#787574" />
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
              onChangeText={(text) => {
                setAmountStr(text.replace(/[^0-9]/g, ''));
                setError(null);
              }}
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  dialogContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#332f2d',
    marginTop: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#787574',
    lineHeight: 18,
    marginBottom: 16,
  },
  noteInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
