import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  helperText,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={colors.fog}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[16],
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.bone,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: radii.input,
    paddingVertical: 10,
    paddingHorizontal: spacing[12],
    color: colors.mist,
    fontSize: 14,
  },
  inputFocused: {
    borderColor: colors.mist,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputError: {
    borderColor: colors.coralRed,
  },
  errorText: {
    fontSize: 12,
    color: colors.coralRed,
    marginTop: 4,
    letterSpacing: -0.1,
  },
  helperText: {
    fontSize: 12,
    color: colors.fog,
    marginTop: 4,
    letterSpacing: -0.1,
  },
});
