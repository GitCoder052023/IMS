import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { styles } from '../styles/MetricCard.styles';

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
  accentColor = colors.shopViolet,
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
            { backgroundColor: `${accentColor}15` },
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
