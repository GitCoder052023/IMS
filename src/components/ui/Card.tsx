import React, { ReactNode } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevated?: boolean;
}

export function Card({ children, style, onPress, elevated = false }: CardProps) {
  const containerStyle: StyleProp<ViewStyle> = [
    styles.card,
    elevated && styles.elevated,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.carbon,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.graphite,
    padding: spacing[16],
  },
  elevated: {
    backgroundColor: colors.obsidian,
  },
  pressed: {
    opacity: 0.88,
    backgroundColor: colors.slate,
  },
});
