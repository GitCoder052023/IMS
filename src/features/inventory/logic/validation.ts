export interface ItemFormValidation {
  isValid: boolean;
  errors: {
    name?: string;
    category?: string;
    quantity?: string;
    minimumQuantity?: string;
    unit?: string;
  };
}

/**
 * Validates inventory item creation or update inputs.
 */
export function validateItemInput(input: {
  name: string;
  category: string;
  quantity: number | string;
  minimumQuantity: number | string;
  unit: string;
}): ItemFormValidation {
  const errors: ItemFormValidation['errors'] = {};

  const trimmedName = String(input.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Item name is required';
  }

  const trimmedCategory = String(input.category || '').trim();
  if (!trimmedCategory) {
    errors.category = 'Category is required';
  }

  const trimmedUnit = String(input.unit || '').trim();
  if (!trimmedUnit) {
    errors.unit = 'Unit is required (e.g. pieces, pairs, sets)';
  }

  const qty = Number(input.quantity);
  if (isNaN(qty) || qty < 0) {
    errors.quantity = 'Total quantity must be 0 or greater';
  }

  const minQty = Number(input.minimumQuantity);
  if (isNaN(minQty) || minQty < 0) {
    errors.minimumQuantity = 'Minimum quantity must be 0 or greater';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Add Stock adjustment.
 */
export function validateAddStock(amount: number): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  return null;
}

/**
 * Validates Remove Stock adjustment.
 * Cannot remove more than available functional units.
 */
export function validateRemoveStock(
  currentQuantity: number,
  currentDamaged: number,
  amount: number
): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  const available = Math.max(0, currentQuantity - currentDamaged);
  if (amount > available) {
    return `Cannot remove ${amount}. Only ${available} units are currently available (excluding ${currentDamaged} damaged).`;
  }
  return null;
}

/**
 * Validates Record Damage adjustment.
 * Cannot mark more units as damaged than currently available.
 */
export function validateRecordDamage(
  currentAvailable: number,
  amount: number
): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  if (amount > currentAvailable) {
    return `Cannot mark ${amount} as damaged. Only ${currentAvailable} units are available.`;
  }
  return null;
}

/**
 * Validates Repair Damaged adjustment.
 * Cannot repair more units than are currently marked as damaged.
 */
export function validateRepairDamage(
  currentDamaged: number,
  amount: number
): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a quantity greater than 0';
  }
  if (amount > currentDamaged) {
    return `Cannot repair ${amount}. Only ${currentDamaged} units are currently damaged.`;
  }
  return null;
}
