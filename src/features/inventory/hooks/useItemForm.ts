import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useInventory } from '../state/useInventory';
import { InventoryItem } from '../types';
import { validateItemInput } from '../logic/validation';
import { DEFAULT_CATEGORIES, DEFAULT_UNITS } from '../constants';

interface UseItemFormProps {
  initialItem?: InventoryItem;
}

export function useItemForm({ initialItem }: UseItemFormProps = {}) {
  const router = useRouter();
  const { addItem, updateItem } = useInventory();

  const [name, setName] = useState(initialItem?.name || '');
  const [category, setCategory] = useState(initialItem?.category || '');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [quantity, setQuantity] = useState(
    initialItem ? String(initialItem.quantity) : ''
  );
  const [minimumQuantity, setMinimumQuantity] = useState(
    initialItem ? String(initialItem.minimumQuantity) : ''
  );

  const [unit, setUnit] = useState(initialItem?.unit || 'pieces');
  const [customUnit, setCustomUnit] = useState('');
  const [isCustomUnit, setIsCustomUnit] = useState(false);

  const [notes, setNotes] = useState(initialItem?.notes || '');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setMinimumQuantity(String(initialItem.minimumQuantity));
      setNotes(initialItem.notes || '');

      if (DEFAULT_CATEGORIES.includes(initialItem.category as any)) {
        setCategory(initialItem.category);
        setIsCustomCategory(false);
      } else {
        setCategory('');
        setCustomCategory(initialItem.category);
        setIsCustomCategory(true);
      }

      if (DEFAULT_UNITS.includes(initialItem.unit as any)) {
        setUnit(initialItem.unit);
        setIsCustomUnit(false);
      } else {
        setUnit('');
        setCustomUnit(initialItem.unit);
        setIsCustomUnit(true);
      }
    }
  }, [initialItem]);

  const effectiveCategory = isCustomCategory ? customCategory : category;
  const effectiveUnit = isCustomUnit ? customUnit : unit;

  const handleNameChange = (text: string) => {
    setName(text);
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleCategorySelect = (cat: string) => {
    setIsCustomCategory(false);
    setCategory(cat);
    if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleCustomCategorySelect = () => {
    setIsCustomCategory(true);
  };

  const handleCustomCategoryChange = (text: string) => {
    setCustomCategory(text);
    if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleQuantityChange = (text: string) => {
    setQuantity(text.replace(/[^0-9]/g, ''));
    if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
  };

  const handleMinQuantityChange = (text: string) => {
    setMinimumQuantity(text.replace(/[^0-9]/g, ''));
    if (errors.minimumQuantity) {
      setErrors((prev) => ({ ...prev, minimumQuantity: undefined }));
    }
  };

  const handleUnitSelect = (u: string) => {
    setIsCustomUnit(false);
    setUnit(u);
    if (errors.unit) setErrors((prev) => ({ ...prev, unit: undefined }));
  };

  const handleCustomUnitSelect = () => {
    setIsCustomUnit(true);
  };

  const handleCustomUnitChange = (text: string) => {
    setCustomUnit(text);
    if (errors.unit) setErrors((prev) => ({ ...prev, unit: undefined }));
  };

  const handleNotesChange = (text: string) => {
    setNotes(text);
  };

  const handleCreate = async () => {
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

  const handleUpdate = async () => {
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

    if (!initialItem) return;

    try {
      setIsSubmitting(true);
      await updateItem(initialItem.id, {
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

  const navigateBack = () => router.back();

  return {
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
    handleUpdate,
    navigateBack,
  };
}
