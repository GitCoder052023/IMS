import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../../theme';
import { styles } from './Button.styles';

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
    return [
      styles.base,
      styles[variant],
      pressed && styles.pressed,
      disabled && styles.disabled,
      style,
    ];
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
          color={variant === 'primary' || variant === 'danger' ? colors.pureWhite : colors.mutedGray}
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
