import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { Button, Card } from '../../../components/ui';
import { useDataManagement } from '../hooks/useDataManagement';
import { styles } from '../styles/DataManagementCard.styles';

interface DataManagementCardProps {
  hasData: boolean;
  onClearAll: () => Promise<void>;
}

export function DataManagementCard({ hasData, onClearAll }: DataManagementCardProps) {
  const { isClearing, handleClearAll } = useDataManagement({ onClearAll });

  return (
    <Card style={styles.dangerCard}>
      <View style={styles.dangerHeader}>
        <Feather name="alert-circle" size={18} color={colors.coralRed} />
        <Text style={styles.dangerTitle}>Clear All Inventory</Text>
      </View>
      <Text style={styles.dangerDescription}>
        Permanently wipes all user-created inventory items, damage records, and
        adjustment history from local storage.
      </Text>
      <Button
        title="Clear All Inventory"
        variant="danger"
        icon={<Feather name="trash-2" size={15} color={colors.pureWhite} />}
        onPress={handleClearAll}
        loading={isClearing}
        disabled={!hasData}
        style={styles.dangerBtn}
      />
    </Card>
  );
}
