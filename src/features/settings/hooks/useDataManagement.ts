import { useState } from 'react';
import { Alert, Platform } from 'react-native';

interface UseDataManagementProps {
  onClearAll: () => Promise<void>;
}

export function useDataManagement({ onClearAll }: UseDataManagementProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = () => {
    const confirmMessage =
      'Are you sure you want to permanently delete all inventory items and activity logs? This action cannot be undone.';

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        performClear();
      }
    } else {
      Alert.alert(
        'Clear All Inventory',
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Everything',
            style: 'destructive',
            onPress: performClear,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const performClear = async () => {
    try {
      setIsClearing(true);
      await onClearAll();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  return {
    isClearing,
    handleClearAll,
  };
}
