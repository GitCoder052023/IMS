import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../../theme/tokens';

interface MetricCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  accentColor?: string;
  onPress?: () => void;
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon,
  accentColor = colors.mist,
  onPress,
}: MetricCardProps) {
  const content = (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${accentColor}18` },
          ]}
        >
          <Feather name={icon} size={14} color={accentColor} />
        </View>
      </View>

      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>

      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.wrapper}>{content}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: '45%',
  },
  card: {
    backgroundColor: colors.carbon,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.graphite,
    padding: spacing[14],
    gap: spacing[6],
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.fog,
    letterSpacing: -0.1,
    flex: 1,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: radii.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: colors.ash,
  },
});
