import React, { createContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { AddItemInput, InventoryHistoryEntry, InventoryItem, UpdateItemInput } from '../types';
import * as storage from '../storage/inventoryStorage';
import {
  createInventoryItem,
  applyItemUpdate,
  applyAddStock,
  applyRemoveStock,
  applyRecordDamage,
  applyRepairDamage,
} from './inventoryOperations';

export interface InventoryContextType {
  items: InventoryItem[];
  history: InventoryHistoryEntry[];
  isLoading: boolean;
  addItem: (input: AddItemInput, note?: string) => Promise<InventoryItem>;
  updateItem: (id: string, updates: UpdateItemInput) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addStock: (id: string, amount: number, note?: string) => Promise<void>;
  removeStock: (id: string, amount: number, note?: string) => Promise<void>;
  recordDamage: (id: string, amount: number, note?: string) => Promise<void>;
  repairDamage: (id: string, amount: number, note?: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  getItem: (id: string) => InventoryItem | undefined;
  getItemHistory: (id: string) => InventoryHistoryEntry[];
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

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
    const { newItem, initialHistoryEntry } = createInventoryItem(input, note);

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

  const updateItem = async (id: string, updates: UpdateItemInput): Promise<void> => {
    const nextItems = applyItemUpdate(items, id, updates);

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
    const { nextItems, newHistoryEntry } = applyAddStock(items, id, amount, note);
    const nextHistory = [newHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const removeStock = async (id: string, amount: number, note?: string): Promise<void> => {
    const { nextItems, newHistoryEntry } = applyRemoveStock(items, id, amount, note);
    const nextHistory = [newHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const recordDamage = async (id: string, amount: number, note?: string): Promise<void> => {
    const { nextItems, newHistoryEntry } = applyRecordDamage(items, id, amount, note);
    const nextHistory = [newHistoryEntry, ...history];

    setItems(nextItems);
    setHistory(nextHistory);

    await Promise.all([
      storage.saveItems(nextItems),
      storage.saveHistory(nextHistory),
    ]);
  };

  const repairDamage = async (id: string, amount: number, note?: string): Promise<void> => {
    const { nextItems, newHistoryEntry } = applyRepairDamage(items, id, amount, note);
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
