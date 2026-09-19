import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { ButtonVariant } from '../../../components/ui';

export type AdjustmentMode =
  | 'ADD_STOCK'
  | 'REMOVE_STOCK'
  | 'RECORD_DAMAGE'
  | 'REPAIR_DAMAGED';

export interface AdjustmentConfig {
  title: string;
  subtitle: string;
  actionLabel: string;
  buttonVariant: ButtonVariant;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  placeholderNote: string;
}

/**
 * Returns configuration metadata for a given stock adjustment mode.
 */
export function getAdjustmentConfig(
  mode: AdjustmentMode,
  currentQuantity: number,
  currentDamaged: number,
  currentAvailable: number,
  unit: string
): AdjustmentConfig {
  switch (mode) {
    case 'ADD_STOCK':
      return {
        title: 'Add Stock',
        subtitle: `Adds new items to total inventory. Currently ${currentQuantity} ${unit} total.`,
        actionLabel: 'Add Stock',
        buttonVariant: 'primary',
        icon: 'plus-circle',
        iconColor: colors.shopViolet,
        placeholderNote: 'e.g. New purchase, seasonal intake',
      };
    case 'REMOVE_STOCK':
      return {
        title: 'Remove Stock',
        subtitle: `Permanently removes items from inventory. Max available: ${currentAvailable} ${unit}.`,
        actionLabel: 'Remove Stock',
        buttonVariant: 'danger',
        icon: 'minus-circle',
        iconColor: colors.coralRed,
        placeholderNote: 'e.g. Disposed, sold, lost during practice',
      };
    case 'RECORD_DAMAGE':
      return {
        title: 'Record Damage',
        subtitle: `Marks equipment as damaged. Total count stays ${currentQuantity}; available drops. Max: ${currentAvailable} ${unit}.`,
        actionLabel: 'Record Damage',
        buttonVariant: 'danger',
        icon: 'alert-triangle',
        iconColor: colors.coralRed,
        placeholderNote: 'e.g. Cracked shaft, torn seam, broken strap',
      };
    case 'REPAIR_DAMAGED':
      return {
        title: 'Repair / Restore',
        subtitle: `Restores repaired equipment to active available stock. Currently ${currentDamaged} ${unit} damaged.`,
        actionLabel: 'Restore to Stock',
        buttonVariant: 'primary',
        icon: 'check-circle',
        iconColor: colors.shopViolet,
        placeholderNote: 'e.g. Restrung, re-inflated, stitched',
      };
  }
}

/**
 * Validates adjustment modal input value before submission.
 */
export function validateAdjustmentAmount(
  mode: AdjustmentMode,
  amount: number,
  currentAvailable: number,
  currentDamaged: number,
  unit: string
): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }

  if (!Number.isInteger(amount)) {
    return 'Quantity must be a whole number';
  }

  if (mode === 'REMOVE_STOCK' && amount > currentAvailable) {
    return `Cannot remove ${amount} ${unit}. Only ${currentAvailable} ${unit} are available.`;
  }

  if (mode === 'RECORD_DAMAGE' && amount > currentAvailable) {
    return `Cannot mark ${amount} ${unit} as damaged. Only ${currentAvailable} ${unit} are available.`;
  }

  if (mode === 'REPAIR_DAMAGED' && amount > currentDamaged) {
    return `Cannot repair ${amount} ${unit}. Only ${currentDamaged} ${unit} are marked damaged.`;
  }

  return null;
}
