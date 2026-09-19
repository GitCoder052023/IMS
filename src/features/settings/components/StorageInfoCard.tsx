import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { Card } from '../../../components/ui';
import { styles } from '../styles/StorageInfoCard.styles';

interface StorageInfoCardProps {
  itemsCount: number;
  historyCount: number;
}

export function StorageInfoCard({ itemsCount, historyCount }: StorageInfoCardProps) {
  return (
    <Card style={styles.infoCard}>
      <View style={styles.infoRow}>
        <View style={styles.infoTitleCol}>
          <Feather name="hard-drive" size={16} color={colors.mutedGray} />
          <Text style={styles.infoLabel}>Persistence Mode</Text>
        </View>
        <Text style={styles.infoValue}>100% Offline Local Storage</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoTitleCol}>
          <Feather name="layers" size={16} color={colors.mutedGray} />
          <Text style={styles.infoLabel}>Stored Equipment Items</Text>
        </View>
        <Text style={styles.infoValue}>{itemsCount} items</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoTitleCol}>
          <Feather name="clock" size={16} color={colors.mutedGray} />
          <Text style={styles.infoLabel}>Adjustment History Logs</Text>
        </View>
        <Text style={styles.infoValue}>{historyCount} records</Text>
      </View>
    </Card>
  );
}
