import AsyncStorage from '@react-native-async-storage/async-storage';
import { InventoryHistoryEntry, InventoryItem } from '../types';

const STORAGE_KEYS = {
  ITEMS: '@ims_inventory_items_v1',
  HISTORY: '@ims_inventory_history_v1',
};

/**
 * Loads all inventory items from offline local storage.
 * Returns an empty array if no items have been created yet.
 */
export async function loadItems(): Promise<InventoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load inventory items from local storage:', error);
    return [];
  }
}

/**
 * Persists all inventory items to offline local storage.
 */
export async function saveItems(items: InventoryItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save inventory items to local storage:', error);
    throw new Error('Could not persist inventory items');
  }
}

/**
 * Loads inventory adjustment history from offline local storage.
 */
export async function loadHistory(): Promise<InventoryHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load inventory history from local storage:', error);
    return [];
  }
}

/**
 * Persists inventory adjustment history to offline local storage.
 */
export async function saveHistory(history: InventoryHistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save inventory history to local storage:', error);
    throw new Error('Could not persist inventory history');
  }
}

/**
 * Clears all local inventory data and history from local storage.
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.ITEMS, STORAGE_KEYS.HISTORY]);
  } catch (error) {
    console.error('Failed to clear inventory data from local storage:', error);
    throw new Error('Could not clear local inventory data');
  }
}
