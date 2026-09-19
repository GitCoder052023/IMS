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
          color={variant === 'primary' ? '#ffffff' : '#787574'}
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
    gap: 8,
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: '#5433eb',
    shadowColor: '#5433eb',
    shadowOpacity: 0.34,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  danger: {
    backgroundColor: 'rgba(235, 87, 87, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.2)',
  },
  pill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.45,
  },
  textPrimary: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  textSecondary: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  textDanger: {
    color: '#eb5757',
    fontSize: 14,
    fontWeight: '600',
  },
  textPill: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '400',
  },
});
