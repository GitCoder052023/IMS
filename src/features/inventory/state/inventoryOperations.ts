import { AddItemInput, InventoryHistoryEntry, InventoryItem, UpdateItemInput } from '../types';
import {
  validateAddStock,
  validateRemoveStock,
  validateRecordDamage,
  validateRepairDamage,
} from '../logic/validation';
import { getAvailableQuantity } from '../logic/quantity';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function createInventoryItem(
  input: AddItemInput,
  note?: string
): { newItem: InventoryItem; initialHistoryEntry: InventoryHistoryEntry } {
  const now = new Date().toISOString();
  const id = generateId();

  const newItem: InventoryItem = {
    id,
    name: input.name.trim(),
    category: input.category.trim(),
    quantity: Number(input.quantity) || 0,
    damagedQuantity: Number(input.damagedQuantity) || 0,
    minimumQuantity: Number(input.minimumQuantity) || 0,
    unit: input.unit.trim(),
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  const initialHistoryEntry: InventoryHistoryEntry = {
    id: generateId(),
    inventoryItemId: id,
    type: 'INITIAL',
    quantity: newItem.quantity,
    note: note?.trim() || 'Initial inventory intake',
    createdAt: now,
  };

  return { newItem, initialHistoryEntry };
}

export function applyItemUpdate(
  items: InventoryItem[],
  id: string,
  updates: UpdateItemInput
): InventoryItem[] {
  const now = new Date().toISOString();
  return items.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      ...updates,
      name: updates.name !== undefined ? updates.name.trim() : item.name,
      category: updates.category !== undefined ? updates.category.trim() : item.category,
      minimumQuantity:
        updates.minimumQuantity !== undefined
          ? Number(updates.minimumQuantity)
          : item.minimumQuantity,
      unit: updates.unit !== undefined ? updates.unit.trim() : item.unit,
      notes: updates.notes !== undefined ? updates.notes.trim() || undefined : item.notes,
      updatedAt: now,
    };
  });
}

export function applyAddStock(
  items: InventoryItem[],
  id: string,
  amount: number,
  note?: string
): { nextItems: InventoryItem[]; newHistoryEntry: InventoryHistoryEntry } {
  const err = validateAddStock(amount);
  if (err) throw new Error(err);

  const now = new Date().toISOString();
  const nextItems = items.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      quantity: item.quantity + amount,
      updatedAt: now,
    };
  });

  const newHistoryEntry: InventoryHistoryEntry = {
    id: generateId(),
    inventoryItemId: id,
    type: 'STOCK_ADDED',
    quantity: amount,
    note: note?.trim() || undefined,
    createdAt: now,
  };

  return { nextItems, newHistoryEntry };
}

export function applyRemoveStock(
  items: InventoryItem[],
  id: string,
  amount: number,
  note?: string
): { nextItems: InventoryItem[]; newHistoryEntry: InventoryHistoryEntry } {
  const target = items.find((i) => i.id === id);
  if (!target) throw new Error('Item not found');

  const err = validateRemoveStock(target.quantity, target.damagedQuantity, amount);
  if (err) throw new Error(err);

  const now = new Date().toISOString();
  const nextItems = items.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      quantity: item.quantity - amount,
      updatedAt: now,
    };
  });

  const newHistoryEntry: InventoryHistoryEntry = {
    id: generateId(),
    inventoryItemId: id,
    type: 'STOCK_REMOVED',
    quantity: amount,
    note: note?.trim() || undefined,
    createdAt: now,
  };

  return { nextItems, newHistoryEntry };
}

export function applyRecordDamage(
  items: InventoryItem[],
  id: string,
  amount: number,
  note?: string
): { nextItems: InventoryItem[]; newHistoryEntry: InventoryHistoryEntry } {
  const target = items.find((i) => i.id === id);
  if (!target) throw new Error('Item not found');

  const available = getAvailableQuantity(target);
  const err = validateRecordDamage(available, amount);
  if (err) throw new Error(err);

  const now = new Date().toISOString();
  const nextItems = items.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      damagedQuantity: item.damagedQuantity + amount,
      updatedAt: now,
    };
  });

  const newHistoryEntry: InventoryHistoryEntry = {
    id: generateId(),
    inventoryItemId: id,
    type: 'DAMAGED_RECORDED',
    quantity: amount,
    note: note?.trim() || undefined,
    createdAt: now,
  };

  return { nextItems, newHistoryEntry };
}

export function applyRepairDamage(
  items: InventoryItem[],
  id: string,
  amount: number,
  note?: string
): { nextItems: InventoryItem[]; newHistoryEntry: InventoryHistoryEntry } {
  const target = items.find((i) => i.id === id);
  if (!target) throw new Error('Item not found');

  const err = validateRepairDamage(target.damagedQuantity, amount);
  if (err) throw new Error(err);

  const now = new Date().toISOString();
  const nextItems = items.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      damagedQuantity: item.damagedQuantity - amount,
      updatedAt: now,
    };
  });

  const newHistoryEntry: InventoryHistoryEntry = {
    id: generateId(),
    inventoryItemId: id,
    type: 'DAMAGED_RESOLVED',
    quantity: amount,
    note: note?.trim() || undefined,
    createdAt: now,
  };

  return { nextItems, newHistoryEntry };
}
