import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'pill';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const getContainerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    const baseStyle = styles.base;
    const variantStyle = styles[variant];
    const pressedStyle = pressed ? styles.pressed : null;
    const disabledStyle = disabled ? styles.disabled : null;

    return [baseStyle, variantStyle, pressedStyle, disabledStyle, style];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    switch (variant) {
      case 'primary':
        return [styles.textPrimary, textStyle];
      case 'danger':
        return [styles.textDanger, textStyle];
      case 'pill':
        return [styles.textPill, textStyle];
      case 'ghost':
      case 'secondary':
      default:
        return [styles.textSecondary, textStyle];
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => getContainerStyle(pressed)}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.void : colors.mist}
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[8],
    borderRadius: radii.button,
    paddingVertical: 10,
    paddingHorizontal: spacing[16],
  },
  primary: {
    backgroundColor: colors.acidLime,
  },
  secondary: {
    backgroundColor: colors.obsidian,
    borderWidth: 1,
    borderColor: colors.graphite,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.graphite,
  },
  danger: {
    backgroundColor: 'rgba(235, 87, 87, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.3)',
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing[12],
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.45,
  },
  textPrimary: {
    color: colors.void,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  textSecondary: {
    color: colors.mist,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  textDanger: {
    color: colors.coralRed,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  textPill: {
    color: colors.mist,
    fontSize: 13,
    fontWeight: '400',
  },
});
