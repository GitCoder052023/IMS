import { useContext } from 'react';
import { InventoryContext, InventoryContextType } from './InventoryContext';

export function useInventory(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
