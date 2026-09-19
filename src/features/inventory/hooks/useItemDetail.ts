import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useInventory } from '../state/useInventory';
import { getAvailableQuantity, getInventoryStatus } from '../logic/quantity';
import { AdjustmentMode } from '../logic/adjustmentConfig';

export function useItemDetail(id: string | undefined) {
  const router = useRouter();
  const {
    getItem,
    getItemHistory,
    addStock,
    removeStock,
    recordDamage,
    repairDamage,
    deleteItem,
  } = useInventory();

  const [activeModal, setActiveModal] = useState<AdjustmentMode | null>(null);

  const item = id ? getItem(id) : undefined;
  const history = id ? getItemHistory(id) : [];

  const available = item ? getAvailableQuantity(item) : 0;
  const status = item ? getInventoryStatus(item) : 'OUT_OF_STOCK';

  const handleDelete = () => {
    if (!item) return;

    const confirmMsg = `Are you sure you want to delete "${item.name}"? All stock history for this item will also be removed.`;

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        deleteItem(item.id);
        router.back();
      }
    } else {
      Alert.alert(
        'Delete Equipment Item',
        confirmMsg,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteItem(item.id);
              router.back();
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleModalSubmit = async (amount: number, note?: string) => {
    if (!activeModal || !item) return;

    switch (activeModal) {
      case 'ADD_STOCK':
        await addStock(item.id, amount, note);
        break;
      case 'REMOVE_STOCK':
        await removeStock(item.id, amount, note);
        break;
      case 'RECORD_DAMAGE':
        await recordDamage(item.id, amount, note);
        break;
      case 'REPAIR_DAMAGED':
        await repairDamage(item.id, amount, note);
        break;
    }
  };

  const navigateBack = () => router.back();
  const navigateToInventory = () => router.replace('/(tabs)/inventory');
  const navigateToEdit = () => {
    if (item) {
      router.push({ pathname: '/item/edit', params: { id: item.id } });
    }
  };

  return {
    item,
    history,
    available,
    status,
    activeModal,
    setActiveModal,
    handleDelete,
    handleModalSubmit,
    navigateBack,
    navigateToInventory,
    navigateToEdit,
  };
}
