import { StyleSheet } from 'react-native';
import { colors, radii, spacing, shadows } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.pureWhite,
    borderRadius: radii.card,
    padding: spacing[16],
    shadowColor: shadows.card.shadowColor,
    shadowOffset: shadows.card.shadowOffset,
    shadowOpacity: shadows.card.shadowOpacity,
    shadowRadius: shadows.card.shadowRadius,
    elevation: shadows.card.elevation,
  },
  elevated: {
    backgroundColor: colors.pureWhite,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  pressed: {
    opacity: 0.92,
  },
});
