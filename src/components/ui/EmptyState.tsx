import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';
import { Button } from './Button';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Feather name={icon} size={28} color={colors.mutedGray} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          icon={<Feather name="plus" size={16} color={colors.pureWhite} />}
          style={styles.button}
        />
      )}
    </View>
  );
}
