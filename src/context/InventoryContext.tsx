import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { InventoryHistoryEntry, InventoryItem } from '../types/inventory';
import * as storage from '../storage/inventoryStorage';
import {
  validateAddStock,
  validateRemoveStock,
  validateRecordDamage,
  validateRepairDamage,
  getAvailableQuantity,
} from '../utils/inventoryCalculations';

interface AddItemInput {
  name: string;
  category: string;
  quantity: number;
  minimumQuantity: number;
  unit: string;
  notes?: string;
  damagedQuantity?: number;
}

interface InventoryContextType {
  items: InventoryItem[];
  history: InventoryHistoryEntry[];
  isLoading: boolean;
  addItem: (input: AddItemInput, note?: string) => Promise<InventoryItem>;
  updateItem: (
    id: string,
    updates: Partial<Pick<InventoryItem, 'name' | 'category' | 'minimumQuantity' | 'unit' | 'notes'>>
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addStock: (id: string, amount: number, note?: string) => Promise<void>;
  removeStock: (id: string, amount: number, note?: string) => Promise<void>;
  recordDamage: (id: string, amount: number, note?: string) => Promise<void>;
  repairDamage: (id: string, amount: number, note?: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  getItem: (id: string) => InventoryItem | undefined;
  getItemHistory: (id: string) => InventoryHistoryEntry[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<InventoryHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load offline data on initial mount
  useEffect(() => {
    async function init() {
      try {
        const [savedItems, savedHistory] = await Promise.all([
          storage.loadItems(),
          storage.loadHistory(),
        ]);
        setItems(savedItems);
        setHistory(savedHistory);
      } catch (err) {
        console.error('Failed to initialize inventory from local storage:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const addItem = async (input: AddItemInput, note?: string): Promise<InventoryItem> => {
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

    const nextItems = [newItem, ...items];
    const nextHistory = [initialHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);

    return newItem;
  };

  const updateItem = async (
    id: string,
    updates: Partial<Pick<InventoryItem, 'name' | 'category' | 'minimumQuantity' | 'unit' | 'notes'>>
  ): Promise<void> => {
    const now = new Date().toISOString();
    const nextItems = items.map((item) => {
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

    setItems(nextItems);
    await storage.saveItems(nextItems);
  };

  const deleteItem = async (id: string): Promise<void> => {
    const nextItems = items.filter((item) => item.id !== id);
    const nextHistory = history.filter((entry) => entry.inventoryItemId !== id);

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const addStock = async (id: string, amount: number, note?: string): Promise<void> => {
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

    const nextHistory = [newHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const removeStock = async (id: string, amount: number, note?: string): Promise<void> => {
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

    const nextHistory = [newHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const recordDamage = async (id: string, amount: number, note?: string): Promise<void> => {
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

    const nextHistory = [newHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const repairDamage = async (id: string, amount: number, note?: string): Promise<void> => {
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

    const nextHistory = [newHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const clearAllData = async (): Promise<void> => {
    await storage.clearAllData();
    setItems([]);
    setHistory([]);
  };

  const getItem = (id: string) => items.find((item) => item.id === id);

  const getItemHistory = (id: string) =>
    history.filter((entry) => entry.inventoryItemId === id);

  const contextValue = useMemo(
    () => ({
      items,
      history,
      isLoading,
      addItem,
      updateItem,
      deleteItem,
      addStock,
      removeStock,
      recordDamage,
      repairDamage,
      clearAllData,
      getItem,
      getItemHistory,
    }),
    [items, history, isLoading]
  );

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
