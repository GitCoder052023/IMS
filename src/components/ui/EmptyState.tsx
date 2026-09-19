import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/tokens';
import { Button } from './Button';

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
        <Feather name={icon} size={28} color={colors.fog} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          icon={<Feather name="plus" size={16} color={colors.void} />}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[40],
    paddingHorizontal: spacing[24],
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.carbon,
    borderWidth: 1,
    borderColor: colors.graphite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[16],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.paper,
    marginBottom: spacing[8],
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.fog,
    textAlign: 'center',
    marginBottom: spacing[20],
    maxWidth: 320,
  },
  button: {
    marginTop: spacing[4],
  },
});
