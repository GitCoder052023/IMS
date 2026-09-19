import { useState, useEffect } from 'react';
import {
  AdjustmentMode,
  getAdjustmentConfig,
  validateAdjustmentAmount,
} from '../logic/adjustmentConfig';

interface UseAdjustmentFormParams {
  visible: boolean;
  mode: AdjustmentMode | null;
  unit: string;
  currentQuantity: number;
  currentDamaged: number;
  currentAvailable: number;
  onClose: () => void;
  onSubmit: (amount: number, note?: string) => Promise<void>;
}

export function useAdjustmentForm({
  visible,
  mode,
  unit,
  currentQuantity,
  currentDamaged,
  currentAvailable,
  onClose,
  onSubmit,
}: UseAdjustmentFormParams) {
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

  const config = mode
    ? getAdjustmentConfig(
        mode,
        currentQuantity,
        currentDamaged,
        currentAvailable,
        unit
      )
    : null;

  const handleAmountChange = (text: string) => {
    setAmountStr(text.replace(/[^0-9]/g, ''));
    if (error) setError(null);
  };

  const handleConfirm = async () => {
    if (!mode) return;

    const amount = Number(amountStr);
    const validationErr = validateAdjustmentAmount(
      mode,
      amount,
      currentAvailable,
      currentDamaged,
      unit
    );

    if (validationErr) {
      setError(validationErr);
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

  return {
    amountStr,
    note,
    error,
    isSubmitting,
    config,
    handleAmountChange,
    setNote,
    handleConfirm,
  };
}
